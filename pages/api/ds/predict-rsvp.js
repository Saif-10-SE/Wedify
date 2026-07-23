import { predictRsvpBatch, getRsvpModelInfo } from '@/lib/ds/rsvpModel';

export default function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(getRsvpModelInfo());
    }
    if (req.method === 'POST') {
      const guests = Array.isArray(req.body?.guests) ? req.body.guests : [];
      return res.status(200).json({
        ...predictRsvpBatch(guests),
        model: getRsvpModelInfo(),
      });
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/ds/predict-rsvp]', err);
    return res.status(500).json({ error: err.message || 'RSVP prediction failed' });
  }
}
