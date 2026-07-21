import { connectDB, isMongoConfigured } from './mongodb';
import {
  Marquee,
  Vendor,
  Testimonial,
  LivePriceDoc,
} from './models/Catalog';
import {
  marquees as localMarquees,
  additionalServices as localAdditionalServices,
  realVenuePhotos as localRealVenuePhotos,
  formatPrice,
} from '@/data/marquees';
import { getAllVendors as localGetAllVendors, getVendorCategories } from '@/data/vendors';
import { testimonials as localTestimonials } from '@/data/testimonials';

function clean(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  delete obj._id;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
}

async function fromMongo(fn) {
  if (!isMongoConfigured()) return null;
  try {
    await connectDB();
    return await fn();
  } catch (err) {
    console.error('[catalogService] mongo unavailable:', err.message);
    return null;
  }
}

/** @returns {Promise<{ items: any[], source: 'mongodb' | 'local' }>} */
export async function fetchMarquees() {
  const fromDb = await fromMongo(async () => {
    const rows = await Marquee().find({}).sort({ featured: -1, rating: -1 }).lean();
    if (!rows.length) return null;
    return rows.map(clean);
  });

  if (fromDb?.length) {
    return { items: fromDb, source: 'mongodb' };
  }
  return { items: localMarquees, source: 'local' };
}

/** @returns {Promise<{ items: any[], source: 'mongodb' | 'local' }>} */
export async function fetchVendors() {
  const fromDb = await fromMongo(async () => {
    const rows = await Vendor().find({}).sort({ featured: -1, rating: -1 }).lean();
    if (!rows.length) return null;
    return rows.map(clean);
  });

  if (fromDb?.length) {
    return { items: fromDb, source: 'mongodb' };
  }
  return { items: localGetAllVendors(), source: 'local' };
}

/** @returns {Promise<{ items: any[], source: 'mongodb' | 'local' }>} */
export async function fetchTestimonials() {
  const fromDb = await fromMongo(async () => {
    const rows = await Testimonial().find({}).sort({ id: 1 }).lean();
    if (!rows.length) return null;
    return rows.map(clean);
  });

  if (fromDb?.length) {
    return { items: fromDb, source: 'mongodb' };
  }
  return { items: localTestimonials, source: 'local' };
}

export async function fetchLivePriceExtras() {
  const fromDb = await fromMongo(async () => {
    const doc = await LivePriceDoc().findOne({ _key: 'snapshot' }).lean();
    if (!doc) return null;
    return {
      additionalServices: doc.additionalServices || localAdditionalServices,
      realVenuePhotos: doc.realVenuePhotos || localRealVenuePhotos,
    };
  });

  return (
    fromDb || {
      additionalServices: localAdditionalServices,
      realVenuePhotos: localRealVenuePhotos,
    }
  );
}

export function areasFromMarquees(marquees) {
  return [...new Set(marquees.map((m) => m.area).filter(Boolean))];
}

export function featuredMarquees(marquees) {
  return marquees.filter((m) => m.featured);
}

export function featuredVendors(vendors) {
  return vendors.filter((v) => v.featured);
}

export function marqueeBySlug(marquees, slug) {
  return marquees.find((m) => m.slug === slug) || null;
}

export function testimonialsByVenueSlug(testimonials, venueSlug) {
  return testimonials.filter((t) => t.venueSlug === venueSlug);
}

export function venueAverageRating(testimonials, venueSlug) {
  const list = testimonialsByVenueSlug(testimonials, venueSlug);
  if (!list.length) return 0;
  const sum = list.reduce((acc, t) => acc + t.rating, 0);
  return (sum / list.length).toFixed(1);
}

export function featuredTestimonials(testimonials) {
  return testimonials.filter((t) => t.rating === 5).slice(0, 6);
}

export { formatPrice, getVendorCategories };
