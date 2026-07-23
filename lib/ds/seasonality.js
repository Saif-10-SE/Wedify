/**
 * Demand / seasonality analytics + naive seasonal forecast.
 */
import { inquiryHistory, inquiriesByMonth, PEAK_MONTHS } from '@/data/ds/inquiryHistory';
import { AREA_LIST, MONTH_NAMES } from '@/lib/ds/features';

export function buildSeasonality() {
  const monthly = inquiriesByMonth().map((m) => ({
    ...m,
    monthName: MONTH_NAMES[m.month - 1],
    peak: PEAK_MONTHS.has(m.month),
  }));

  // area x month heatmap: inquiry counts
  const heat = AREA_LIST.map((area) => {
    const row = { area };
    for (let m = 1; m <= 12; m++) {
      row[`m${m}`] = inquiryHistory.filter((r) => r.area === area && r.month === m).length;
    }
    const counts = Array.from({ length: 12 }, (_, i) => row[`m${i + 1}`]);
    row.total = counts.reduce((a, b) => a + b, 0);
    row.avgBudget = (() => {
      const subset = inquiryHistory.filter((r) => r.area === area);
      if (!subset.length) return 0;
      return Math.round(subset.reduce((s, r) => s + r.totalBudget, 0) / subset.length);
    })();
    return row;
  }).sort((a, b) => b.total - a.total);

  // Busy vs budget-friendly labels per area
  const maxDemand = Math.max(...heat.map((h) => h.total), 1);
  const budgets = heat.map((h) => h.avgBudget).filter(Boolean);
  const medBudget = budgets.sort((a, b) => a - b)[Math.floor(budgets.length / 2)] || 1;

  const areaLabels = heat.map((h) => {
    const busy = h.total >= maxDemand * 0.65;
    const expensive = h.avgBudget >= medBudget * 1.05;
    let label = 'Balanced';
    if (busy && expensive) label = 'Expensive & Busy';
    else if (busy && !expensive) label = 'Busy · Budget-friendlier';
    else if (!busy && expensive) label = 'Premium · Quieter';
    else label = 'Budget-friendly';
    return {
      area: h.area,
      demand: h.total,
      avgBudget: h.avgBudget,
      label,
      busy,
      expensive,
    };
  });

  // Naive seasonal forecast: next 3 months = avg of same month last cycle * recent level
  const avgCount = monthly.reduce((s, m) => s + m.count, 0) / 12;
  const last3Avg = monthly.slice(-3).reduce((s, m) => s + m.count, 0) / 3;
  const level = last3Avg / Math.max(1, avgCount);
  const currentMonth = new Date().getMonth() + 1;
  const forecast = [];
  for (let i = 1; i <= 3; i++) {
    const m = ((currentMonth - 1 + i) % 12) + 1;
    const hist = monthly.find((x) => x.month === m);
    const predictedCount = Math.round((hist?.count || avgCount) * level);
    const predictedBudget = Math.round((hist?.avgBudget || 0) * (PEAK_MONTHS.has(m) ? 1.05 : 0.98));
    forecast.push({
      month: m,
      monthName: MONTH_NAMES[m - 1],
      predictedCount,
      predictedAvgBudget: predictedBudget,
      peak: PEAK_MONTHS.has(m),
    });
  }

  const insights = [
    `Peak inquiry months in synthetic history: ${[...PEAK_MONTHS].map((m) => MONTH_NAMES[m - 1]).join(', ')}.`,
    `${areaLabels.filter((a) => a.label === 'Expensive & Busy').map((a) => a.area).slice(0, 3).join(', ') || 'N/A'} skew expensive & busy.`,
    `Next-3-month forecast uses seasonal naive model × recent demand level (${level.toFixed(2)}×).`,
  ];

  return {
    method: 'Time-style aggregation + seasonal-naive forecast on synthetic inquiry timestamps',
    monthly,
    heatmap: heat,
    areaLabels,
    forecast,
    insights,
    monthNames: MONTH_NAMES,
  };
}
