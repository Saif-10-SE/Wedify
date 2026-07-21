import { seedDatabase } from '../../lib/seedDatabase';
import { isMongoConfigured } from '../../lib/mongodb';

/**
 * Seed MongoDB with marquees, vendors, testimonials, checklist, prices, templates.
 * GET or POST /api/seed
 * Optional: ?clear=1 to wipe catalog collections before insert
 */
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isMongoConfigured()) {
    return res.status(400).json({
      error: 'MONGODB_URI is not set in .env.local',
      hint: 'Add your Atlas connection string, restart the server, then call /api/seed again.',
    });
  }

  try {
    const clear =
      req.query.clear === '1' ||
      req.query.clear === 'true' ||
      req.body?.clear === true;

    const result = await seedDatabase({ clear });
    return res.status(200).json(result);
  } catch (err) {
    console.error('[api/seed]', err);
    return res.status(500).json({
      error: 'Seed failed.',
      detail: err.message,
      hint:
        'In Atlas → Network Access, allow 0.0.0.0/0. Confirm username/password in MONGODB_URI.',
    });
  }
}
