import { recommendVenues } from '@/lib/ds/recommend';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const limit = Math.min(12, Number(req.body?.limit) || 6);
    const result = recommendVenues(req.body || {}, limit);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[api/ds/recommend]', err);
    return res.status(500).json({ error: err.message || 'Recommendation failed' });
  }
}
