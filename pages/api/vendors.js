import { fetchVendors, getVendorCategories } from '../../lib/catalogService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, source } = await fetchVendors();
    const { slug, featured } = req.query;

    if (slug) {
      const vendor = items.find((v) => v.slug === String(slug));
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found', source });
      }
      return res.status(200).json({ vendor, source });
    }

    let vendors = items;
    if (featured === '1' || featured === 'true') {
      vendors = items.filter((v) => v.featured);
    }

    return res.status(200).json({
      count: vendors.length,
      vendors,
      categories: getVendorCategories(),
      source,
    });
  } catch (err) {
    console.error('[api/vendors]', err);
    return res.status(500).json({ error: 'Failed to load vendors', detail: err.message });
  }
}
