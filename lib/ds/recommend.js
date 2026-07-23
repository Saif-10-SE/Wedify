/**
 * Content-based venue recommendation with explainable score breakdown.
 */
import { marquees } from '@/data/marquees';
import { extractVenueFeatures } from '@/lib/ds/features';

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

/**
 * @param {{ budget?: number, guests?: number, area?: string, events?: number, styleTags?: string[] }} prefs
 */
export function recommendVenues(prefs = {}, limit = 6) {
  const budget = Number(prefs.budget) || 3000000;
  const guests = Number(prefs.guests) || 500;
  const area = (prefs.area || '').trim();
  const styleTags = (prefs.styleTags || []).map((t) => String(t).toLowerCase());
  const perHeadBudget = budget / Math.max(1, guests * Math.max(1, Number(prefs.events) || 3));

  const scored = marquees.map((venue) => {
    const f = extractVenueFeatures(venue);
    const breakdown = {};

    // Budget fit: closer per-head price to implied budget is better
    const priceMid = f.priceMid;
    const budgetRatio = priceMid / Math.max(1, perHeadBudget);
    breakdown.budgetFit = clamp01(1 - Math.abs(1 - budgetRatio));
    if (priceMid > perHeadBudget * 1.35) breakdown.budgetFit *= 0.55;

    // Capacity fit
    if (guests < f.capacityMin) breakdown.capacityFit = clamp01(guests / f.capacityMin) * 0.7;
    else if (guests > f.capacityMax) breakdown.capacityFit = clamp01(f.capacityMax / guests) * 0.5;
    else {
      const span = Math.max(1, f.capacityMax - f.capacityMin);
      const sweet = 1 - Math.abs(guests - (f.capacityMin + span * 0.55)) / span;
      breakdown.capacityFit = clamp01(0.75 + sweet * 0.25);
    }

    // Area match
    breakdown.areaMatch = !area ? 0.55 : venue.area === area ? 1 : venue.location?.includes(area) ? 0.7 : 0.25;

    // Rating / social proof
    breakdown.rating = clamp01((f.rating - 3.5) / 1.5);

    // Amenity / style overlap
    const amenityText = (venue.amenities || []).join(' ').toLowerCase();
    if (styleTags.length) {
      const hits = styleTags.filter((t) => amenityText.includes(t) || (venue.description || '').toLowerCase().includes(t));
      breakdown.styleFit = clamp01(hits.length / styleTags.length);
    } else {
      breakdown.styleFit = clamp01(0.4 + f.amenityCount / 20);
    }

    const weights = {
      budgetFit: 0.28,
      capacityFit: 0.24,
      areaMatch: 0.2,
      rating: 0.16,
      styleFit: 0.12,
    };

    const score =
      breakdown.budgetFit * weights.budgetFit +
      breakdown.capacityFit * weights.capacityFit +
      breakdown.areaMatch * weights.areaMatch +
      breakdown.rating * weights.rating +
      breakdown.styleFit * weights.styleFit;

    const reasons = [];
    if (breakdown.budgetFit >= 0.7) reasons.push('Fits your budget band');
    if (breakdown.capacityFit >= 0.75) reasons.push('Strong guest-capacity match');
    if (breakdown.areaMatch >= 0.95) reasons.push(`Located in ${venue.area}`);
    if (breakdown.rating >= 0.75) reasons.push(`High rating (${venue.rating}★)`);
    if (breakdown.styleFit >= 0.6 && styleTags.length) reasons.push('Matches style tags');
    if (!reasons.length) reasons.push('Balanced overall fit');

    return {
      slug: venue.slug,
      name: venue.name,
      area: venue.area,
      image: venue.image,
      rating: venue.rating,
      priceMin: f.priceMin,
      priceMax: f.priceMax,
      capacity: venue.capacity,
      score: Number((score * 100).toFixed(1)),
      breakdown: Object.fromEntries(
        Object.entries(breakdown).map(([k, v]) => [k, Number((v * 100).toFixed(1))])
      ),
      reasons,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return {
    method: 'Content-based ranking (weighted similarity on budget, capacity, area, rating, style)',
    prefs: { budget, guests, area: area || null, events: Number(prefs.events) || 3, styleTags },
    results: scored.slice(0, limit),
  };
}
