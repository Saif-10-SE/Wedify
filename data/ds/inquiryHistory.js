/**
 * Synthetic inquiry / wedding planning history for DS modules.
 * Deterministic seed so metrics stay stable across deploys.
 */
import { marquees } from '@/data/marquees';
import { AREA_LIST, TIER_INDEX, venueTier } from '@/lib/ds/features';

function mulberry32(a) {
  return function rand() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20263332009);

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/** Peak wedding months in Pakistan (higher demand / spend) */
const PEAK_MONTHS = new Set([2, 3, 10, 11, 12]); // Mar, Apr, Nov, Dec, and Feb shoulder

function buildInquiryHistory(count = 320) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const venue = pick(marquees);
    const month = 1 + Math.floor(rand() * 12);
    const peak = PEAK_MONTHS.has(month);
    const guests = Math.round(clamp(venue.capacity.min + rand() * (venue.capacity.max - venue.capacity.min) * 0.7, 150, venue.capacity.max));
    const events = pick([2, 3, 3, 4]);
    const tier = venueTier(venue);
    const basePerHead = venue.pricing.perHead.min + rand() * (venue.pricing.perHead.max - venue.pricing.perHead.min) * 0.6;
    const seasonLift = peak ? 1.12 + rand() * 0.1 : 0.9 + rand() * 0.08;
    const catering = basePerHead * guests * events * seasonLift;
    const hall = (venue.pricing.hallRental || 150000) * events * (0.85 + rand() * 0.3);
    const decor = (venue.decorPackages?.[1]?.price || 800000) * events * (0.7 + rand() * 0.5);
    const photo = 250000 + rand() * 450000;
    const extras = 150000 + rand() * 400000;
    const noise = 1 + (rand() - 0.5) * 0.12;
    const totalBudget = Math.round((catering + hall + decor + photo + extras) * noise);
    const budgetPerHead = Math.round(totalBudget / Math.max(1, guests));

    rows.push({
      id: `inq-${i + 1}`,
      month,
      year: 2024 + (month > 6 ? 0 : 1),
      area: venue.area,
      venueSlug: venue.slug,
      venueName: venue.name,
      guests,
      events,
      tier,
      tierIndex: TIER_INDEX[tier],
      priceMin: venue.pricing.perHead.min,
      rating: venue.rating,
      totalBudget,
      budgetPerHead,
      peakSeason: peak,
      // proxy label used by some analytics
      converted: rand() > (peak ? 0.35 : 0.45) ? 1 : 0,
    });
  }
  return rows;
}

export const inquiryHistory = buildInquiryHistory(320);

export function inquiriesByMonth() {
  const map = {};
  for (let m = 1; m <= 12; m++) map[m] = { month: m, count: 0, avgBudget: 0, sumBudget: 0 };
  for (const row of inquiryHistory) {
    map[row.month].count += 1;
    map[row.month].sumBudget += row.totalBudget;
  }
  return Object.values(map).map((r) => ({
    month: r.month,
    count: r.count,
    avgBudget: r.count ? Math.round(r.sumBudget / r.count) : 0,
  }));
}

export { AREA_LIST, PEAK_MONTHS };
