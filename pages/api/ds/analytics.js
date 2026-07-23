import { buildAnalytics } from '@/lib/ds/analytics';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    return res.status(200).json(buildAnalytics());
  } catch (err) {
    console.error('[api/ds/analytics]', err);
    return res.status(500).json({ error: err.message || 'Analytics failed' });
  }
}
