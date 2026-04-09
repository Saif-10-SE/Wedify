import { livePriceSnapshot, livePricesBySlug } from '@/data/livePrices';

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    updatedAt: livePriceSnapshot.updatedAt,
    currency: livePriceSnapshot.currency,
    areas: livePriceSnapshot.areas,
    bySlug: livePricesBySlug
  });
}
