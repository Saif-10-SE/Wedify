import { livePriceSnapshot, livePricesBySlug } from '@/data/livePrices';
import { connectDB, isMongoConfigured } from '@/lib/mongodb';
import { LivePriceDoc } from '@/lib/models/Catalog';

export default async function handler(req, res) {
  try {
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await LivePriceDoc().findOne({ _key: 'snapshot' }).lean();
      if (doc?.snapshot) {
        return res.status(200).json({
          status: 'ok',
          source: 'mongodb',
          updatedAt: doc.snapshot.updatedAt,
          currency: doc.snapshot.currency,
          areas: doc.snapshot.areas,
          bySlug: doc.bySlug || livePricesBySlug,
        });
      }
    }
  } catch (err) {
    console.error('[api/live-prices] mongo fallback:', err.message);
  }

  return res.status(200).json({
    status: 'ok',
    source: 'local',
    updatedAt: livePriceSnapshot.updatedAt,
    currency: livePriceSnapshot.currency,
    areas: livePriceSnapshot.areas,
    bySlug: livePricesBySlug,
  });
}
