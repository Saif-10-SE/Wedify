import OpenAI from 'openai';
import { marquees, formatPrice } from '@/data/marquees';
import { getAllVendors } from '@/data/vendors';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SYSTEM_PROMPT = `You are Wedify AI, a friendly and practical Pakistani wedding planning assistant.

Rules:
- Keep tone warm, clear, and concise.
- Focus on Pakistan wedding context (especially Lahore) when relevant.
- Ask clarifying questions when critical inputs are missing (budget, city, guest count, events).
- Give realistic estimates in PKR.
- Prefer practical recommendations over generic advice.
- If user budget is tight, suggest smart trade-offs and phased alternatives.
- Never claim real-time pricing unless explicitly provided in the context.
- When giving options, present a short comparison and a recommendation.`;

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

const EVENT_KEYWORDS = ['mehndi', 'mayun', 'barat', 'baraat', 'walima', 'engagement', 'nikah', 'nikah', 'dholki'];

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
    /([0-9][0-9,.]*)\s*(crore|lakh|lac|k|m|million)\s*(?:budget|for wedding|overall)?/gi
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
  return EVENT_KEYWORDS.filter((evt) => source.includes(evt));
};

const getBudgetShape = (budgetPkr, guests) => {
  if (!budgetPkr) {
    return { totalBudget: null, perHeadBudget: null, mode: 'unknown' };
  }

  if (guests && budgetPkr > 20000) {
    return {
      totalBudget: budgetPkr,
      perHeadBudget: Math.round(budgetPkr / guests),
      mode: 'total'
    };
  }

  return {
    totalBudget: guests ? budgetPkr * guests : null,
    perHeadBudget: budgetPkr,
    mode: 'per-head'
  };
};

const buildVenueRecommendations = ({ budgetPkr, guests, area }) => {
  const { perHeadBudget } = getBudgetShape(budgetPkr, guests);
  const pool = area ? marquees.filter((m) => m.area === area) : [...marquees];

  const scored = pool
    .filter((venue) => {
      if (!guests) return true;
      return venue.capacity.max >= guests;
    })
    .map((venue) => {
      const min = venue.pricing.perHead.min;
      const max = venue.pricing.perHead.max;
      const mid = Math.round((min + max) / 2);
      const priceGap = perHeadBudget ? Math.abs(mid - perHeadBudget) : 0;
      const fitsBudget = perHeadBudget ? min <= perHeadBudget : true;
      const fitsCapacity = guests ? guests >= venue.capacity.min && guests <= venue.capacity.max : true;
      const score =
        venue.rating * 100 +
        (venue.featured ? 20 : 0) +
        (fitsBudget ? 15 : -10) +
        (fitsCapacity ? 15 : 0) -
        (perHeadBudget ? priceGap / 300 : 0);

      return {
        venue,
        score,
        fitsBudget,
        priceGap,
        perHeadMid: mid
      };
    })
    .sort((a, b) => b.score - a.score);

  const recommended = scored.slice(0, 3).map((x) => x.venue);

  const alternatives = perHeadBudget
    ? scored
        .filter((x) => !x.fitsBudget && x.venue.pricing.perHead.min <= perHeadBudget * 1.25)
        .slice(0, 2)
        .map((x) => x.venue)
    : scored.slice(3, 5).map((x) => x.venue);

  return { recommended, alternatives };
};

const buildVendorRecommendations = (totalBudget) => {
  if (!totalBudget) return [];

  const all = getAllVendors().filter((v) => v.type !== 'Venue');

  const targets = [
    { type: 'Photography', fraction: 0.12 },
    { type: 'Decoration', fraction: 0.2 },
    { type: 'Makeup', fraction: 0.05 }
  ];

  return targets
    .map(({ type, fraction }) => {
      const target = Math.round(totalBudget * fraction);
      const options = all
        .filter((v) => v.type === type)
        .filter((v) => v.priceRange?.min && v.priceRange?.max)
        .sort((a, b) => {
          const aGap = Math.abs(((a.priceRange.min + a.priceRange.max) / 2) - target);
          const bGap = Math.abs(((b.priceRange.min + b.priceRange.max) / 2) - target);
          return aGap - bGap;
        });

      return options[0] || null;
    })
    .filter(Boolean);
};

const formatVenueBullet = (venue) => {
  return [
    venue.name,
    `Area: ${venue.area}`,
    `Capacity: ${venue.capacity.min}-${venue.capacity.max}`,
    `Per head: ${formatPrice(venue.pricing.perHead.min)}-${formatPrice(venue.pricing.perHead.max)}`,
    `Hall: ${formatPrice(venue.pricing.hallRental)}`
  ].join(' | ');
};

const formatVendorBullet = (vendor) => {
  return `${vendor.type}: ${vendor.name} | Budget: ${formatPrice(vendor.priceRange.min)}-${formatPrice(vendor.priceRange.max)}`;
};

const buildLocalFallbackReply = ({ budgetPkr, guests, area, events, venues, alternatives }) => {
  const lines = [];
  lines.push('Absolutely, I can help you plan this step by step.');

  if (budgetPkr) lines.push(`Noted budget: ${formatPrice(budgetPkr)}${guests ? ` for ~${guests} guests` : ''}.`);
  if (area) lines.push(`Preferred area: ${area}.`);
  if (events.length) lines.push(`Functions mentioned: ${events.join(', ')}.`);

  if (venues.length) {
    lines.push('Top venue matches right now:');
    venues.forEach((venue, idx) => {
      lines.push(`${idx + 1}. ${venue.name} (${venue.area}) - ${formatPrice(venue.pricing.perHead.min)} to ${formatPrice(venue.pricing.perHead.max)} per head`);
    });
  }

  if (alternatives.length) {
    lines.push('If you can stretch a bit, these are strong alternatives:');
    alternatives.forEach((venue, idx) => {
      lines.push(`${idx + 1}. ${venue.name} (${venue.area})`);
    });
  }

  lines.push('Share city, exact guest count, and whether this budget is total or per-head, and I will give you a detailed PKR breakdown by event (mehndi/barat/walima).');
  return lines.join('\n');
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

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
    const budgetPkr = extractBudgetPkr(combinedText);
    const guests = extractGuests(combinedText);
    const area = extractArea(combinedText);
    const events = extractEvents(combinedText);

    const budgetShape = getBudgetShape(budgetPkr, guests);
    const { recommended, alternatives } = buildVenueRecommendations({ budgetPkr, guests, area });
    const vendorRecommendations = buildVendorRecommendations(budgetShape.totalBudget);

    const planningContext = [
      `Parsed inputs: budget=${budgetPkr || 'unknown'} PKR, guests=${guests || 'unknown'}, area=${area || 'any'}, events=${events.join(', ') || 'not specified'}`,
      `Budget interpretation: mode=${budgetShape.mode}, perHead=${budgetShape.perHeadBudget || 'unknown'}, total=${budgetShape.totalBudget || 'unknown'}`,
      'Top venue recommendations:',
      ...(recommended.length ? recommended.map((v) => `- ${formatVenueBullet(v)}`) : ['- No exact match.']),
      'Alternative venue suggestions:',
      ...(alternatives.length ? alternatives.map((v) => `- ${formatVenueBullet(v)}`) : ['- None in nearby price range.']),
      'Vendor suggestions:',
      ...(vendorRecommendations.length ? vendorRecommendations.map((v) => `- ${formatVendorBullet(v)}`) : ['- Need total budget before vendor recommendations.'])
    ].join('\n');

    const fallbackReply = buildLocalFallbackReply({
      budgetPkr,
      guests,
      area,
      events,
      venues: recommended,
      alternatives
    });

    const client = getClient();
    if (!client) {
      return res.status(200).json({
        reply: fallbackReply,
        metadata: {
          source: 'local-fallback',
          reason: 'missing-openai-api-key'
        }
      });
    }

    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.6,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `Planning context (trusted):\n${planningContext}` },
        ...history,
        { role: 'user', content: message }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || fallbackReply;

    return res.status(200).json({
      reply,
      metadata: {
        source: 'openai',
        model: MODEL
      }
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({
      error: 'Unable to process chatbot request right now.',
      reply: 'I am having trouble right now. Please retry in a moment, and include your city, guest count, and budget so I can give precise recommendations.'
    });
  }
}