import { fetchTestimonials } from '../../lib/catalogService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, source } = await fetchTestimonials();
    const { venueSlug } = req.query;

    const testimonials = venueSlug
      ? items.filter((t) => t.venueSlug === String(venueSlug))
      : items;

    return res.status(200).json({
      count: testimonials.length,
      testimonials,
      source,
    });
  } catch (err) {
    console.error('[api/testimonials]', err);
    return res.status(500).json({ error: 'Failed to load testimonials', detail: err.message });
  }
}
