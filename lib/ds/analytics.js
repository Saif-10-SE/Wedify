/**
 * EDA / analytics aggregates over marquees + inquiry history.
 */
import { marquees } from '@/data/marquees';
import { inquiryHistory } from '@/data/ds/inquiryHistory';
import { extractVenueFeatures, formatPkr } from '@/lib/ds/features';

export function buildAnalytics() {
  const venues = marquees.map((v) => {
    const f = extractVenueFeatures(v);
    const valueScore = Number((f.rating / Math.log10(Math.max(10, f.priceMid))).toFixed(3));
    return {
      slug: v.slug,
      name: v.name,
      area: v.area,
      rating: f.rating,
      priceMin: f.priceMin,
      priceMid: f.priceMid,
      capacityMax: f.capacityMax,
      valueScore,
      tier: f.tier,
    };
  });

  const byAreaMap = {};
  for (const v of venues) {
    if (!byAreaMap[v.area]) byAreaMap[v.area] = { area: v.area, count: 0, sumPrice: 0, sumRating: 0, sumCap: 0 };
    const a = byAreaMap[v.area];
    a.count += 1;
    a.sumPrice += v.priceMin;
    a.sumRating += v.rating;
    a.sumCap += v.capacityMax;
  }
  const byArea = Object.values(byAreaMap)
    .map((a) => ({
      area: a.area,
      venues: a.count,
      avgPriceMin: Math.round(a.sumPrice / a.count),
      avgRating: Number((a.sumRating / a.count).toFixed(2)),
      avgCapacity: Math.round(a.sumCap / a.count),
    }))
    .sort((x, y) => y.avgPriceMin - x.avgPriceMin);

  const tierCounts = { value: 0, mid: 0, premium: 0, luxury: 0 };
  for (const v of venues) tierCounts[v.tier] = (tierCounts[v.tier] || 0) + 1;
  const tierPie = Object.entries(tierCounts).map(([name, value]) => ({ name, value }));

  const capacityBuckets = [
    { label: '≤500', min: 0, max: 500, count: 0 },
    { label: '501–1000', min: 501, max: 1000, count: 0 },
    { label: '1001–2000', min: 1001, max: 2000, count: 0 },
    { label: '2000+', min: 2001, max: 1e9, count: 0 },
  ];
  for (const v of venues) {
    const b = capacityBuckets.find((c) => v.capacityMax >= c.min && v.capacityMax <= c.max);
    if (b) b.count += 1;
  }

  const avgPrice = Math.round(venues.reduce((s, v) => s + v.priceMin, 0) / venues.length);
  const avgRating = Number((venues.reduce((s, v) => s + v.rating, 0) / venues.length).toFixed(2));
  const inquiryAvg = Math.round(inquiryHistory.reduce((s, r) => s + r.totalBudget, 0) / inquiryHistory.length);

  // Insights
  const richest = byArea[0];
  const cheapest = byArea[byArea.length - 1];
  const bestValue = [...venues].sort((a, b) => b.valueScore - a.valueScore)[0];
  const insights = [];
  if (richest && cheapest && cheapest.avgPriceMin > 0) {
    const pct = Math.round(((richest.avgPriceMin - cheapest.avgPriceMin) / cheapest.avgPriceMin) * 100);
    insights.push(`${richest.area} averages ${pct}% higher per-head entry pricing than ${cheapest.area}.`);
  }
  if (bestValue) {
    insights.push(`Best value score: ${bestValue.name} (${bestValue.area}), rating vs log(price).`);
  }
  insights.push(`Catalog covers ${venues.length} marquees across ${byArea.length} Lahore areas.`);
  insights.push(`Synthetic planning history mean wedding budget ≈ ${formatPkr(inquiryAvg)}.`);

  return {
    kpis: {
      venueCount: venues.length,
      areaCount: byArea.length,
      avgPriceMin: avgPrice,
      avgRating,
      inquirySamples: inquiryHistory.length,
      avgInquiryBudget: inquiryAvg,
    },
    byArea,
    tierPie,
    capacityBuckets: capacityBuckets.map(({ label, count }) => ({ label, count })),
    scatter: venues.map((v) => ({
      name: v.name,
      area: v.area,
      price: v.priceMin,
      rating: v.rating,
      valueScore: v.valueScore,
    })),
    topValue: [...venues].sort((a, b) => b.valueScore - a.valueScore).slice(0, 5),
    insights,
  };
}
