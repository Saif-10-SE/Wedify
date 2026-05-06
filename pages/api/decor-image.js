const OPENAI_IMAGE_MODELS = (process.env.OPENAI_IMAGE_MODELS || 'gpt-image-1.5,gpt-image-1')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb'
    }
  }
};

const parseOpenAIError = (payloadJson, payloadText) =>
  payloadJson?.error?.message || payloadText?.slice(0, 280) || 'OpenAI image request failed.';

const fetchUrlAsBase64 = async (url) => {
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) return null;
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  const contentType = imageResponse.headers.get('content-type') || 'image/png';
  return {
    mimeType: contentType.split(';')[0].trim(),
    base64: buffer.toString('base64')
  };
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

const tryOpenAIImage = async ({ apiKey, model, prompt, references }) => {
  const files = references
    .map((item, idx) => fileFromDataUrl(item, `reference-${idx + 1}`))
    .filter(Boolean)
    .slice(0, 5);

  const hasReferences = files.length > 0;
  let response;
  if (hasReferences) {
    const form = new FormData();
    form.append('model', model);
    form.append('prompt', prompt);
    form.append('size', '1024x1024');
    form.append('n', '1');
    files.forEach((file) => form.append('image[]', file));
    response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: form
    });
  } else {
    response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size: '1024x1024'
      })
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
    model
  };
};

const runOpenAIImage = async ({ apiKey, prompt, references }) => {
  let lastError = null;
  for (const model of OPENAI_IMAGE_MODELS) {
    const result = await tryOpenAIImage({
      apiKey,
      model,
      prompt,
      references
    });
    if (result.ok) return result;
    lastError = result;
    if (result.status === 404) continue;
  }
  return { ok: false, ...lastError };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    if (!openaiKey) {
      return res.status(400).json({
        error: 'OPENAI_API_KEY is required for multi-turn image editing.'
      });
    }

    const decoratedPrompt = [
      'Generate a realistic wedding decor concept image.',
      'Context: Pakistani wedding aesthetics, elegant and premium look.',
      style ? `Style preferences: ${style}` : null,
      references.length ? `Use ${references.length} reference image(s) for style consistency.` : null,
      `User request: ${prompt}`,
      'If this is a follow-up turn, refine the previous concept while preserving relevant style.'
    ]
      .filter(Boolean)
      .join('\n');

    const openaiResult = await runOpenAIImage({
      apiKey: openaiKey,
      prompt: decoratedPrompt,
      references
    });

    if (!openaiResult.ok) {
      return res.status(200).json({
        error: openaiResult?.message || 'OpenAI image generation failed.',
        guidance:
          'Check API key permissions/billing for GPT Image models and retry. You can continue iterating once generation succeeds.',
        metadata: {
          source: 'openai',
          reason: 'openai-failed',
          modelsTried: OPENAI_IMAGE_MODELS
        }
      });
    }

    return res.status(200).json({
      image: openaiResult.image,
      guidance: openaiResult.guidance,
      metadata: {
        source: 'openai',
        model: openaiResult.model
      }
    });
  } catch (error) {
    console.error('Decor image API error:', error);
    return res.status(500).json({
      error: 'Unable to generate decor image right now. Please retry in a moment.'
    });
  }
}
