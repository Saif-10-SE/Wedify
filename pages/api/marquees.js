import { fetchMarquees, areasFromMarquees, marqueeBySlug } from '../../lib/catalogService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, source } = await fetchMarquees();
    const { slug } = req.query;

    if (slug) {
      const marquee = marqueeBySlug(items, String(slug));
      if (!marquee) {
        return res.status(404).json({ error: 'Marquee not found', source });
      }
      return res.status(200).json({ marquee, source });
    }

    return res.status(200).json({
      count: items.length,
      marquees: items,
      areas: areasFromMarquees(items),
      source,
    });
  } catch (err) {
    console.error('[api/marquees]', err);
    return res.status(500).json({ error: 'Failed to load marquees', detail: err.message });
  }
}
