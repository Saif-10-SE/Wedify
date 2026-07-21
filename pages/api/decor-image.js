import fs from 'fs';
import path from 'path';

const OPENAI_IMAGE_MODELS = (process.env.OPENAI_IMAGE_MODELS || 'gpt-image-1.5,gpt-image-1,dall-e-3')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const GEMINI_IMAGE_MODELS = [
  process.env.GEMINI_IMAGE_MODEL,
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-image-preview',
  'gemini-2.0-flash-preview-image-generation',
  'gemini-2.0-flash-exp-image-generation'
]
  .filter(Boolean)
  .filter((v, i, arr) => arr.indexOf(v) === i);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb'
    }
  }
};

const parseOpenAIError = (payloadJson, payloadText) =>
  payloadJson?.error?.message || payloadText?.slice(0, 280) || 'OpenAI image request failed.';

const fetchUrlAsBase64 = async (url, timeoutMs = 90000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const imageResponse = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'image/*' }
    });
    if (!imageResponse.ok) return null;
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    if (buffer.length < 1000) return null;
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const mimeType = contentType.split(';')[0].trim();
    if (!mimeType.startsWith('image/')) return null;
    return { mimeType, base64: buffer.toString('base64') };
  } finally {
    clearTimeout(timer);
  }
};

const parseDataUrl = (entry) => {
  if (typeof entry !== 'string') return null;
  const match = entry.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], base64: match[2] };
};

const fileFromDataUrl = (entry, filename = 'reference.png') => {
  const parsed = parseDataUrl(entry);
  if (!parsed) return null;
  const ext = parsed.mimeType.split('/')[1] || 'png';
  const bytes = Buffer.from(parsed.base64, 'base64');
  return new File([bytes], `${filename}.${ext}`, { type: parsed.mimeType });
};

/** Build a strong text-to-image prompt so the result matches the user's decor request. */
const buildDecorPrompt = ({ prompt, style, hasReferences }) =>
  [
    'Photorealistic Pakistani wedding decor concept photograph.',
    'Show an indoor or banquet wedding stage / backdrop / floral setup — NOT an exterior building facade, NOT a hotel exterior, NOT a cityscape.',
    'Focus on: mandap or stage backdrop, floral arrangements, drapes, lighting, seating ambience.',
    'Elegant, premium, high-detail interior wedding decoration.',
    style ? `Style notes: ${style}` : null,
    hasReferences ? 'Match the visual style of the attached reference images where possible.' : null,
    `Exact user request: ${prompt}`,
    'Respect the colors, theme, and event type named by the user (e.g. Mughal, violet, cream, walima).'
  ]
    .filter(Boolean)
    .join('\n');

const tryOpenAIImage = async ({ apiKey, model, prompt, references }) => {
  const files = references
    .map((item, idx) => fileFromDataUrl(item, `reference-${idx + 1}`))
    .filter(Boolean)
    .slice(0, 5);

  const hasReferences = files.length > 0;
  let response;

  if (hasReferences && !model.startsWith('dall-e')) {
    const form = new FormData();
    form.append('model', model);
    form.append('prompt', prompt);
    form.append('size', '1024x1024');
    form.append('n', '1');
    files.forEach((file) => form.append('image[]', file));
    response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    });
  } else {
    const body = {
      model,
      prompt,
      n: 1,
      size: '1024x1024'
    };
    // dall-e-3 uses quality; gpt-image models may reject response_format
    if (model.startsWith('dall-e')) {
      body.response_format = 'b64_json';
      body.quality = 'standard';
    }

    response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
  }

  const payloadText = await response.text();
  let payloadJson = null;
  try {
    payloadJson = JSON.parse(payloadText);
  } catch (_) {
    payloadJson = null;
  }

  if (!response.ok || !payloadJson?.data?.[0]) {
    return {
      ok: false,
      status: response.status,
      message: parseOpenAIError(payloadJson, payloadText),
      model
    };
  }

  const data = payloadJson.data[0];
  const image = data?.b64_json
    ? { mimeType: 'image/png', base64: data.b64_json }
    : data?.url
      ? await fetchUrlAsBase64(data.url)
      : null;
  if (!image) return { ok: false, status: 502, message: 'No image in OpenAI response.', model };

  return {
    ok: true,
    image,
    guidance: typeof data?.revised_prompt === 'string' ? data.revised_prompt : '',
    model,
    source: 'openai'
  };
};

const runOpenAIImage = async ({ apiKey, prompt, references }) => {
  let lastError = null;
  for (const model of OPENAI_IMAGE_MODELS) {
    const result = await tryOpenAIImage({ apiKey, model, prompt, references });
    if (result.ok) return result;
    lastError = result;
    if (result.status === 404) continue;
    // billing / auth failures — no point trying every model
    if (
      /billing|quota|insufficient|hard limit|invalid api key/i.test(result.message || '')
    ) {
      break;
    }
  }
  return { ok: false, ...(lastError || { message: 'OpenAI image generation failed.' }) };
};

const extractGeminiImage = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data;
    if (inline?.data) {
      return {
        mimeType: inline.mimeType || inline.mime_type || 'image/png',
        base64: inline.data
      };
    }
  }
  return null;
};

const extractGeminiText = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  return parts
    .map((part) => (typeof part.text === 'string' ? part.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();
};

const runGeminiImage = async ({ apiKey, prompt, references }) => {
  let lastError = null;

  const referenceParts = references
    .map((entry) => parseDataUrl(entry))
    .filter(Boolean)
    .slice(0, 5)
    .map((item) => ({
      inline_data: {
        mime_type: item.mimeType,
        data: item.base64
      }
    }));

  for (const model of GEMINI_IMAGE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }, ...referenceParts]
            }
          ],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
          }
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
        lastError = {
          ok: false,
          message:
            payloadJson?.error?.message ||
            payloadText?.slice(0, 280) ||
            `Gemini request failed (${model})`,
          model
        };
        if (/quota|rate limit|billing/i.test(lastError.message)) break;
        continue;
      }

      const image = extractGeminiImage(payloadJson);
      if (!image) {
        lastError = { ok: false, message: `No image returned from ${model}`, model };
        continue;
      }

      return {
        ok: true,
        image,
        guidance: extractGeminiText(payloadJson),
        model,
        source: 'gemini'
      };
    } catch (error) {
      lastError = {
        ok: false,
        message: error?.message || `Gemini image failed (${model})`,
        model
      };
    }
  }

  return { ok: false, ...(lastError || { message: 'Gemini image generation failed.' }) };
};

/**
 * Prompt-based image generation via Pollinations (Flux).
 * Uses the user's actual prompt — not a stock venue photo.
 */
const runPollinationsImage = async ({ prompt, style }) => {
  const shortPrompt = [
    'Pakistani wedding interior decor, stage backdrop, florals, drapes, lighting',
    'NOT exterior building, NOT hotel facade',
    style || '',
    prompt
  ]
    .filter(Boolean)
    .join(', ')
    .slice(0, 450);

  const seed = Math.floor(Math.random() * 1_000_000);
  const encoded = encodeURIComponent(shortPrompt);
  const urls = [
    `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}&enhance=true`,
    `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${seed}`
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const image = await fetchUrlAsBase64(url, 120000);
      if (image) {
        return {
          ok: true,
          image,
          guidance: `AI-generated decor concept for: “${prompt}”${style ? ` (${style})` : ''}.`,
          model: 'flux-pollinations',
          source: 'pollinations'
        };
      }
      lastError = { message: 'Empty or invalid image from Pollinations.' };
    } catch (error) {
      lastError = { message: error?.message || 'Pollinations request failed.' };
    }
  }

  return { ok: false, message: lastError?.message || 'Pollinations image generation failed.' };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const failures = [];

  try {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
    const style = typeof req.body?.style === 'string' ? req.body.style.trim() : '';
    const references = Array.isArray(req.body?.references) ? req.body.references : [];

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }
    if (references.length > 5) {
      return res.status(400).json({ error: 'Up to 5 reference images are supported.' });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const decoratedPrompt = buildDecorPrompt({
      prompt,
      style,
      hasReferences: references.length > 0
    });

    // 1) OpenAI
    if (openaiKey) {
      try {
        const openaiResult = await runOpenAIImage({
          apiKey: openaiKey,
          prompt: decoratedPrompt,
          references
        });
        if (openaiResult.ok) {
          return res.status(200).json({
            image: openaiResult.image,
            guidance: openaiResult.guidance || `Generated decor concept for: “${prompt}”.`,
            metadata: { source: 'openai', model: openaiResult.model }
          });
        }
        failures.push(`OpenAI: ${openaiResult.message}`);
        console.warn('OpenAI decor image failed:', openaiResult.message);
      } catch (error) {
        failures.push(`OpenAI: ${error?.message || error}`);
        console.warn('OpenAI decor image exception:', error?.message || error);
      }
    } else {
      failures.push('OpenAI: OPENAI_API_KEY not set');
    }

    // 2) Gemini
    if (geminiKey) {
      try {
        const geminiResult = await runGeminiImage({
          apiKey: geminiKey,
          prompt: decoratedPrompt,
          references
        });
        if (geminiResult.ok) {
          return res.status(200).json({
            image: geminiResult.image,
            guidance: geminiResult.guidance || `Generated decor concept for: “${prompt}”.`,
            metadata: { source: 'gemini', model: geminiResult.model }
          });
        }
        failures.push(`Gemini: ${geminiResult.message}`);
        console.warn('Gemini decor image failed:', geminiResult.message);
      } catch (error) {
        failures.push(`Gemini: ${error?.message || error}`);
        console.warn('Gemini decor image exception:', error?.message || error);
      }
    } else {
      failures.push('Gemini: GEMINI_API_KEY not set');
    }

    // 3) Prompt-based AI fallback (never returns unrelated stock venue photos)
    try {
      const pollinationsResult = await runPollinationsImage({ prompt, style });
      if (pollinationsResult.ok) {
        return res.status(200).json({
          image: pollinationsResult.image,
          guidance: pollinationsResult.guidance,
          metadata: {
            source: 'pollinations',
            model: pollinationsResult.model,
            note: 'Generated from your prompt (OpenAI/Gemini unavailable).'
          }
        });
      }
      failures.push(`Pollinations: ${pollinationsResult.message}`);
    } catch (error) {
      failures.push(`Pollinations: ${error?.message || error}`);
    }

    // Do NOT return random local venue photos — that misleads users.
    return res.status(503).json({
      error:
        'Could not generate a decor image that matches your prompt. OpenAI billing and Gemini quota are exhausted, and the backup generator also failed. Add billing to OpenAI or wait for Gemini quota, then retry.',
      details: failures,
      hint: 'Check OPENAI_API_KEY billing and GEMINI_API_KEY quota in .env.local, then restart the server.'
    });
  } catch (error) {
    console.error('Decor image API error:', error);
    return res.status(500).json({
      error: 'Unable to generate decor image right now. Please retry in a moment.',
      details: [...failures, error?.message].filter(Boolean)
    });
  }
}
