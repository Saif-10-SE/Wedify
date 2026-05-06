const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image-preview';
const GEMINI_IMAGE_FALLBACK_MODELS = ['gemini-2.5-flash-image-preview', 'gemini-2.0-flash-exp'];

const extractInlineImage = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  const imagePart = parts.find((part) => part?.inlineData?.data && part?.inlineData?.mimeType);
  if (!imagePart) return null;

  return {
    mimeType: imagePart.inlineData.mimeType,
    base64: imagePart.inlineData.data
  };
};

const extractText = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('\n')
    .trim();
};

const listGeminiModels = async (apiKey) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
  );
  if (!response.ok) return [];

  const payload = await response.json();
  const models = Array.isArray(payload?.models) ? payload.models : [];

  return models
    .filter((model) => Array.isArray(model?.supportedGenerationMethods))
    .filter((model) => model.supportedGenerationMethods.includes('generateContent'))
    .map((model) => String(model?.name || '').replace(/^models\//, ''))
    .filter(Boolean);
};

const findLikelyImageModels = (models) => {
  return models.filter((name) => {
    const lower = name.toLowerCase();
    return (
      lower.includes('image') ||
      lower.includes('imagen') ||
      lower.includes('2.0-flash-exp') ||
      lower.includes('2.5-flash-image')
    );
  });
};

const callGeminiImageModel = async ({ model, apiKey, prompt }) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE']
        }
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
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
    const style = typeof req.body?.style === 'string' ? req.body.style.trim() : '';

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'Gemini image generation is not configured. Missing GEMINI_API_KEY.'
      });
    }

    const decoratedPrompt = [
      'Generate a realistic wedding decor concept image.',
      'Context: Pakistani wedding aesthetics, elegant and premium look.',
      style ? `Style preferences: ${style}` : null,
      `User request: ${prompt}`
    ]
      .filter(Boolean)
      .join('\n');

    const discoveredModels = await listGeminiModels(process.env.GEMINI_API_KEY);
    const discoveredImageCandidates = findLikelyImageModels(discoveredModels);

    const candidateModels = Array.from(
      new Set([GEMINI_IMAGE_MODEL, ...GEMINI_IMAGE_FALLBACK_MODELS, ...discoveredImageCandidates])
    );
    let payload = null;
    let selectedModel = null;
    let lastFailure = null;

    for (const model of candidateModels) {
      const attempt = await callGeminiImageModel({
        model,
        apiKey: process.env.GEMINI_API_KEY,
        prompt: decoratedPrompt
      });

      if (attempt.ok && attempt.payloadJson) {
        payload = attempt.payloadJson;
        selectedModel = model;
        break;
      }

      lastFailure = attempt;
      if (attempt.status === 404) continue;

      if (attempt.status === 429) {
        return res.status(200).json({
          error: 'Gemini image quota is currently exceeded. Please retry shortly.',
          guidance: 'Try again in a few minutes or use a billed Gemini project for higher limits.',
          metadata: {
            source: 'local-fallback',
            reason: 'gemini-quota-exceeded',
            model
          }
        });
      }
    }

    if (!payload) {
      const status = lastFailure?.status || 0;
      const details = String(lastFailure?.payloadText || '').slice(0, 220);

      if (status === 404) {
        return res.status(200).json({
          error: 'No image-capable Gemini model is currently available for this API key/project.',
          guidance:
            'Enable billing and image-generation access for your Gemini project, then retry. Text planning chat will continue working.',
          metadata: {
            source: 'local-fallback',
            reason: 'no-supported-image-model',
            model: candidateModels[candidateModels.length - 1] || GEMINI_IMAGE_MODEL,
            discoveredModels: discoveredImageCandidates.slice(0, 8)
          }
        });
      }

      return res.status(200).json({
        error: 'Image generation is temporarily unavailable. Please retry in a moment.',
        guidance: details || 'No additional diagnostics available.',
        metadata: {
          source: 'local-fallback',
          reason: 'image-generation-unavailable',
          model: candidateModels[candidateModels.length - 1] || GEMINI_IMAGE_MODEL
        }
      });
    }

    const image = extractInlineImage(payload);
    const guidance = extractText(payload);

    if (!image) {
      return res.status(502).json({
        error: 'Image was not returned by Gemini. Please try a more specific decor prompt.',
        guidance
      });
    }

    return res.status(200).json({
      image,
      guidance,
      metadata: {
        source: 'gemini',
        model: selectedModel || GEMINI_IMAGE_MODEL
      }
    });
  } catch (error) {
    console.error('Decor image API error:', error);
    return res.status(500).json({
      error: 'Unable to generate decor image right now. Please retry in a moment.'
    });
  }
}
