/**
 * Shared feature helpers for Wedify Data Science modules.
 */

export const AREA_LIST = [
  'Canal Road',
  'Mall Road',
  'Gulberg',
  'Walton',
  'Cantt',
  'DHA',
  'Johar Town',
  'Raiwind Road',
  'Model Town',
  'Bahria Town',
  'Wapda Town',
  'Shadman',
];

export const TIER_FROM_PRICE = (perHeadMin) => {
  if (perHeadMin >= 7000) return 'luxury';
  if (perHeadMin >= 4500) return 'premium';
  if (perHeadMin >= 3000) return 'mid';
  return 'value';
};

export const TIER_INDEX = { value: 0, mid: 1, premium: 2, luxury: 3 };

export function areaIndex(area) {
  const i = AREA_LIST.indexOf(area);
  return i >= 0 ? i : 0;
}

export function oneHotArea(area) {
  const idx = areaIndex(area);
  return AREA_LIST.map((_, i) => (i === idx ? 1 : 0));
}

export function venueTier(venue) {
  return TIER_FROM_PRICE(venue?.pricing?.perHead?.min || 3000);
}

export function extractVenueFeatures(venue) {
  const min = venue?.pricing?.perHead?.min || 0;
  const max = venue?.pricing?.perHead?.max || min;
  const amenities = venue?.amenities || [];
  return {
    slug: venue.slug,
    area: venue.area,
    capacityMax: venue?.capacity?.max || 0,
    capacityMin: venue?.capacity?.min || 0,
    priceMin: min,
    priceMax: max,
    priceMid: (min + max) / 2,
    rating: venue?.rating || 0,
    reviews: venue?.reviews || 0,
    amenityCount: amenities.length,
    tier: venueTier(venue),
    tierIndex: TIER_INDEX[venueTier(venue)] ?? 1,
    hasLawn: amenities.some((a) => /lawn|outdoor/i.test(a)) ? 1 : 0,
    hasAc: amenities.some((a) => /ac|air/i.test(a)) ? 1 : 0,
  };
}

/** Budget prediction feature vector: [1, guests, events, tierIndex, areaIndex, priceMin/1000] */
export function budgetFeatureVector({ guests, events, tierIndex, areaIdx, priceMin }) {
  return [1, guests / 500, events, tierIndex, areaIdx / 10, (priceMin || 0) / 1000];
}

/** RSVP feature vector: [1, members, leadDays/30, isFamily, pastRate] */
export function rsvpFeatureVector({ members, leadDays, relationship, pastRsvpRate }) {
  const isFamily = /family|relative|cousin|uncle|aunt/i.test(relationship || '') ? 1 : 0;
  return [1, Number(members) || 1, (Number(leadDays) || 14) / 30, isFamily, Number(pastRsvpRate) || 0.6];
}

export function formatPkr(n) {
  const v = Math.round(Number(n) || 0);
  return `Rs ${v.toLocaleString('en-PK')}`;
}

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
