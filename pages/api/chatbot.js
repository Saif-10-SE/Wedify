import { formatPrice } from '@/data/marquees';
import { fetchMarquees, fetchVendors } from '@/lib/catalogService';
import { buildWeddingPlan, formatVerifiedPlanMarkdown } from '@/lib/weddingPlanBuilder';

const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
const GEMINI_TEXT_FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];
const OPENAI_RESPONSES_MODEL = process.env.OPENAI_RESPONSES_MODEL || 'gpt-5.4-mini';

const SYSTEM_PROMPT = `You are Wedify AI Chatbot, a practical Pakistani wedding planning assistant for Lahore.

Hard rules (never break these):
1. ONLY cite venue names, vendor names, capacities, and PKR amounts that appear in the Planning context / Verified plan below. Never invent venues, vendors, or prices.
2. If a detail is missing from context, ask a clarifying question or say you do not have that number. Do not guess.
3. When a total budget is present, deliver a COMPLETE plan: venue shortlist, package cost breakdown, vendor picks, trade-offs, and next steps. Use the Verified plan numbers as the source of truth.
4. Prefer total wedding budget (PKR). If the user gave a small amount that looks like per-head, ask whether they meant total or per-head before assuming.
5. Tone: warm, clear, concise. Use PKR. Pakistan/Lahore wedding context.
6. End with actionable next steps linking to /calculator, /marquees, /vendors, or /image-generation when relevant.
7. Never claim real-time market prices beyond the catalog context.`;

const AREA_ALIASES = {
  'mall road': 'Mall Road',
  gulberg: 'Gulberg',
  dha: 'DHA',
  cantt: 'Cantt',
  walton: 'Walton',
  'johar town': 'Johar Town',
  'raiwind road': 'Raiwind Road',
  'model town': 'Model Town',
  'bahria town': 'Bahria Town',
  'wapda town': 'Wapda Town',
  shadman: 'Shadman',
  'canal road': 'Canal Road'
};

const EVENT_KEYWORDS = ['mehndi', 'mayun', 'barat', 'baraat', 'walima', 'engagement', 'nikah', 'dholki'];

const parseNumberToken = (value, unit = '') => {
  if (!value) return null;
  const numeric = Number(String(value).replace(/,/g, ''));
  if (!Number.isFinite(numeric)) return null;

  const normalizedUnit = String(unit || '').toLowerCase();
  if (normalizedUnit.includes('crore')) return Math.round(numeric * 10000000);
  if (normalizedUnit.includes('lakh') || normalizedUnit.includes('lac')) return Math.round(numeric * 100000);
  if (normalizedUnit === 'k') return Math.round(numeric * 1000);
  if (normalizedUnit === 'm' || normalizedUnit.includes('million')) return Math.round(numeric * 1000000);
  return Math.round(numeric);
};

const extractBudgetPkr = (text) => {
  const source = String(text || '');
  const budgetPatterns = [
    /(?:budget|around|about|under|upto|up to|within|pkr|rs\.?|rupees?)\s*([0-9][0-9,.]*)\s*(crore|lakh|lac|k|m|million)?/gi,
    /([0-9][0-9,.]*)\s*(crore|lakh|lac|k|m|million)\s*(?:budget|for wedding|overall|total)?/gi,
    /(?:plan|wedding)\s+(?:for|with)\s+([0-9][0-9,.]*)\s*(crore|lakh|lac)/gi
  ];

  const matches = [];
  budgetPatterns.forEach((pattern) => {
    let found = pattern.exec(source);
    while (found) {
      const amount = parseNumberToken(found[1], found[2]);
      if (amount) matches.push(amount);
      found = pattern.exec(source);
    }
  });

  if (!matches.length) return null;
  return matches[matches.length - 1];
};

const detectBudgetMode = (text, budgetPkr, guests) => {
  const source = String(text || '').toLowerCase();
  if (/per\s*head|per\s*guest|\/\s*head|\/\s*guest/.test(source)) return 'per-head';
  if (/total\s*budget|overall\s*budget|complete\s*budget|full\s*budget|wedding\s*for/.test(source)) return 'total';
  if (!budgetPkr) return 'unknown';
  // Lakh/crore amounts are almost always totals
  if (budgetPkr >= 500000) return 'total';
  // Small amounts with guests often mean per-head
  if (guests && budgetPkr <= 20000) return 'per-head';
  if (guests && budgetPkr > 20000) return 'total';
  return 'ambiguous';
};

const extractGuests = (text) => {
  const source = String(text || '');
  const match = source.match(/([0-9]{2,5})\s*(?:guests|people|persons|pax|heads)/i);
  if (!match) return null;
  const guests = Number(match[1]);
  return Number.isFinite(guests) ? guests : null;
};

const extractArea = (text) => {
  const source = String(text || '').toLowerCase();
  for (const [alias, canonical] of Object.entries(AREA_ALIASES)) {
    if (source.includes(alias)) return canonical;
  }
  return null;
};

const extractEvents = (text) => {
  const source = String(text || '').toLowerCase();
  const found = EVENT_KEYWORDS.filter((evt) => source.includes(evt));
  // Normalize baraat -> barat
  return [...new Set(found.map((e) => (e === 'baraat' ? 'barat' : e)))];
};

const getBudgetShape = (budgetPkr, guests, mode) => {
  if (!budgetPkr) {
    return { totalBudget: null, perHeadBudget: null, mode: 'unknown' };
  }

  if (mode === 'per-head') {
    return {
      totalBudget: guests ? budgetPkr * guests : null,
      perHeadBudget: budgetPkr,
      mode: 'per-head'
    };
  }

  if (mode === 'total' || mode === 'ambiguous') {
    return {
      totalBudget: budgetPkr,
      perHeadBudget: guests ? Math.round(budgetPkr / guests) : null,
      mode: mode === 'ambiguous' ? 'total-assumed' : 'total'
    };
  }

  return {
    totalBudget: budgetPkr,
    perHeadBudget: guests ? Math.round(budgetPkr / guests) : null,
    mode: 'total'
  };
};

const sanitizeHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && typeof m.content === 'string')
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content.trim()
    }))
    .filter((m) => m.content)
    .slice(-10);
};

const historyToGeminiContents = (history) => {
  return history.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }]
  }));
};

const extractGeminiText = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('\n')
    .trim();
};

const extractOpenAIResponsesText = (payload) => {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }
  const output = Array.isArray(payload?.output) ? payload.output : [];
  for (const item of output) {
    if (item?.type === 'message' && Array.isArray(item.content)) {
      const texts = item.content
        .filter((c) => c?.type === 'output_text' && typeof c.text === 'string')
        .map((c) => c.text.trim())
        .filter(Boolean);
      if (texts.length) return texts.join('\n').trim();
    }
  }
  return '';
};

const buildOpenAIResponsesInput = ({ systemPrompt, history, message }) => {
  const historyLines = history.map((h) => `${h.role}: ${h.content}`);
  return [systemPrompt, '', 'Conversation:', ...historyLines, '', `user: ${message}`].join('\n');
};

const mergeReplyWithVerifiedPlan = (llmReply, verifiedMarkdown, hasBudget) => {
  if (!hasBudget || !verifiedMarkdown) return llmReply;
  // Always append catalog numbers so the user sees ground truth even if the model softens wording
  if (llmReply && llmReply.includes('Verified Wedify plan')) return llmReply;
  return `${llmReply || ''}\n\n---\n\n${verifiedMarkdown}`.trim();
};

const callOpenAIResponses = async ({ apiKey, model, input }) => {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input,
      store: true,
      temperature: 0.3
    })
  });

  const payloadText = await response.text();
  let payloadJson = null;
  try {
    payloadJson = JSON.parse(payloadText);
  } catch (_) {
    payloadJson = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: payloadJson?.error?.message || payloadText.slice(0, 300)
    };
  }

  const reply = extractOpenAIResponsesText(payloadJson);
  if (!reply) {
    return { ok: false, status: 502, message: 'OpenAI returned an empty response.' };
  }

  return { ok: true, reply, id: payloadJson?.id };
};

const callGeminiTextModel = async ({ model, apiKey, systemPrompt, history, message }) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.3
        },
        contents: [...historyToGeminiContents(history), { role: 'user', parts: [{ text: message }] }]
      })
    }
  );

  const payloadText = await response.text();
  let payloadJson = null;
  try {
    payloadJson = JSON.parse(payloadText);
  } catch (_) {
    payloadJson = null;
  }

  return { ok: response.ok, status: response.status, payloadText, payloadJson };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const history = sanitizeHistory(req.body?.history);

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const combinedText = `${history.map((h) => h.content).join(' ')} ${message}`;
    const budgetRaw = extractBudgetPkr(combinedText);
    const guests = extractGuests(combinedText);
    const area = extractArea(combinedText);
    const events = extractEvents(combinedText);
    const budgetMode = detectBudgetMode(combinedText, budgetRaw, guests);
    const budgetShape = getBudgetShape(budgetRaw, guests, budgetMode);

    const [marqueesRes, vendorsRes] = await Promise.all([fetchMarquees(), fetchVendors()]);
    const marquees = marqueesRes.items;
    const vendors = vendorsRes.items;

    const eventsCount = events.length > 0 ? Math.min(4, Math.max(1, events.length)) : 3;

    const verifiedPlan =
      budgetShape.totalBudget || guests
        ? buildWeddingPlan({
            budgetPkr: budgetShape.totalBudget,
            guests: guests || 500,
            area,
            eventsCount,
            eventNames: events,
            marquees,
            vendors
          })
        : null;

    const verifiedMarkdown = verifiedPlan ? formatVerifiedPlanMarkdown(verifiedPlan) : '';

    const planningContext = [
      `Parsed inputs: budgetRaw=${budgetRaw || 'unknown'} PKR, guests=${guests || 'unknown'}, area=${area || 'any'}, events=${events.join(', ') || 'default 3'}`,
      `Budget interpretation: mode=${budgetShape.mode}, total=${budgetShape.totalBudget ? formatPrice(budgetShape.totalBudget) : 'unknown'}, perHead=${budgetShape.perHeadBudget ? formatPrice(budgetShape.perHeadBudget) : 'unknown'}`,
      budgetMode === 'ambiguous'
        ? 'NOTE: Budget mode was ambiguous. Confirm with the user whether the amount is TOTAL wedding budget or PER-HEAD.'
        : '',
      verifiedMarkdown
        ? `Verified plan (MUST use these numbers only):\n${verifiedMarkdown}`
        : 'No verified plan yet. Ask for total budget (PKR) and guest count so you can build a full plan.'
    ]
      .filter(Boolean)
      .join('\n\n');

    const fallbackReply = verifiedMarkdown
      ? `Here is a complete plan grounded in our Wedify venue and vendor catalog.\n\n${verifiedMarkdown}`
      : [
          'I can build a full wedding plan once I have a few details.',
          'Please share:',
          '1. Total wedding budget in PKR (e.g. 25 lakh)',
          '2. Guest count',
          '3. Preferred area (Gulberg, DHA, Canal Road, etc.)',
          '4. Events (mehndi / barat / walima)',
          '',
          'I will then recommend real venues from our catalog with a full PKR breakdown. I will not invent prices.'
        ].join('\n');

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasBudget = Boolean(budgetShape.totalBudget);

    if (!openaiKey && !geminiKey) {
      return res.status(200).json({
        reply: fallbackReply,
        plan: verifiedPlan,
        metadata: {
          source: 'local-fallback',
          reason: 'missing-openai-and-gemini-keys'
        }
      });
    }

    const composedSystemPrompt = `${SYSTEM_PROMPT}\n\nPlanning context (trusted):\n${planningContext}`;

    if (openaiKey) {
      const openaiInput = buildOpenAIResponsesInput({
        systemPrompt: composedSystemPrompt,
        history,
        message
      });
      const openaiAttempt = await callOpenAIResponses({
        apiKey: openaiKey,
        model: OPENAI_RESPONSES_MODEL,
        input: openaiInput
      });
      if (openaiAttempt.ok) {
        return res.status(200).json({
          reply: mergeReplyWithVerifiedPlan(openaiAttempt.reply, verifiedMarkdown, hasBudget),
          plan: verifiedPlan,
          metadata: {
            source: 'openai-responses',
            model: OPENAI_RESPONSES_MODEL,
            responseId: openaiAttempt.id
          }
        });
      }
    }

    if (!geminiKey) {
      return res.status(200).json({
        reply: fallbackReply,
        plan: verifiedPlan,
        metadata: {
          source: 'local-fallback',
          reason: 'openai-failed-missing-gemini',
          model: OPENAI_RESPONSES_MODEL
        }
      });
    }

    const candidateModels = Array.from(new Set([GEMINI_TEXT_MODEL, ...GEMINI_TEXT_FALLBACK_MODELS]));

    let completion = null;
    let selectedModel = null;
    let lastFailure = null;

    for (const model of candidateModels) {
      const attempt = await callGeminiTextModel({
        model,
        apiKey: geminiKey,
        systemPrompt: composedSystemPrompt,
        history,
        message
      });

      if (attempt.ok && attempt.payloadJson) {
        completion = attempt.payloadJson;
        selectedModel = model;
        break;
      }

      lastFailure = attempt;

      if (attempt.status === 404) continue;

      if (attempt.status === 429) {
        return res.status(200).json({
          reply: fallbackReply,
          plan: verifiedPlan,
          metadata: {
            source: 'local-fallback',
            reason: 'gemini-quota-exceeded',
            model
          }
        });
      }
    }

    if (!completion) {
      throw new Error(
        `Gemini request failed (${lastFailure?.status || 'unknown'}): ${String(lastFailure?.payloadText || '').slice(0, 300)}`
      );
    }

    const reply = mergeReplyWithVerifiedPlan(extractGeminiText(completion) || fallbackReply, verifiedMarkdown, hasBudget);

    return res.status(200).json({
      reply,
      plan: verifiedPlan,
      metadata: {
        source: 'gemini',
        model: selectedModel || GEMINI_TEXT_MODEL
      }
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({
      error: 'Unable to process chatbot request right now.',
      reply: 'I am having trouble right now. Please retry in a moment, and include your total budget, guest count, and preferred area.'
    });
  }
}
