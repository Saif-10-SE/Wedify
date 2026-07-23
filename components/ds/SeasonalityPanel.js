import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend,
} from 'recharts';
import InsightBanner from '@/components/ds/InsightBanner';
import { formatPrice } from '@/data/marquees';

export default function SeasonalityPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/ds/seasonality')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <p className="text-gray-500">Loading seasonality…</p>;

  const heatMax = Math.max(...data.heatmap.flatMap((row) => data.monthNames.map((_, i) => row[`m${i + 1}`] || 0)), 1);

  return (
    <div>
      <InsightBanner>
        <p className="mb-2">
          Aggregates synthetic inquiry timestamps by month and area. Peak wedding months get higher
          demand and spend. Forecast for the next 3 months uses a <strong>seasonal-naive</strong> model
          scaled by recent demand level.
        </p>
      </InsightBanner>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="theme-card p-4 sm:p-5">
          <h3 className="font-semibold text-burgundy-800 mb-3">Monthly inquiry volume & avg budget</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e4ea" />
                <XAxis dataKey="monthName" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="count" stroke="#7a2846" strokeWidth={2.5} name="Inquiries" />
                <Line yAxisId="right" type="monotone" dataKey="avgBudget" stroke="#b8863c" strokeWidth={2} name="Avg budget" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="theme-card p-4 sm:p-5">
          <h3 className="font-semibold text-burgundy-800 mb-3">Next 3 months forecast</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e4ea" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predictedCount" fill="#7a2846" radius={[6, 6, 0, 0]} name="Predicted inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1">
            {data.forecast.map((f) => (
              <p key={f.month} className="text-xs text-gray-600">
                {f.monthName}: ~{f.predictedCount} inquiries · avg budget {formatPrice(f.predictedAvgBudget)}
                {f.peak ? ' · peak season' : ''}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="theme-card p-4 sm:p-5 mb-6 overflow-x-auto">
        <h3 className="font-semibold text-burgundy-800 mb-3">Area × month demand heatmap</h3>
        <table className="min-w-[720px] w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-2 sticky left-0 bg-white">Area</th>
              {data.monthNames.map((m) => (
                <th key={m} className="p-2 font-medium text-gray-500">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.heatmap.map((row) => (
              <tr key={row.area}>
                <td className="p-2 font-medium sticky left-0 bg-white whitespace-nowrap">{row.area}</td>
                {data.monthNames.map((_, i) => {
                  const v = row[`m${i + 1}`] || 0;
                  const intensity = v / heatMax;
                  return (
                    <td key={i} className="p-1">
                      <div
                        className="rounded-md text-center py-2 font-semibold"
                        style={{
                          backgroundColor: `rgba(122, 40, 70, ${0.12 + intensity * 0.75})`,
                          color: intensity > 0.55 ? '#fff' : '#4a2c34',
                        }}
                      >
                        {v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {data.areaLabels.map((a) => (
          <div key={a.area} className="theme-card p-4">
            <p className="font-semibold text-gray-800">{a.area}</p>
            <p className="text-xs text-gray-500 mt-1">Demand {a.demand} · Avg {formatPrice(a.avgBudget)}</p>
            <span className={`inline-block mt-2 text-[11px] px-2.5 py-1 rounded-full font-medium ${
              a.label.includes('Expensive & Busy') ? 'bg-rose-100 text-rose-800'
                : a.label.includes('Budget-friendly') ? 'bg-emerald-100 text-emerald-800'
                  : a.label.includes('Busy') ? 'bg-amber-100 text-amber-900'
                    : 'bg-sky-100 text-sky-900'
            }`}>
              {a.label}
            </span>
          </div>
        ))}
      </div>

      <div className="theme-card p-5">
        <h3 className="font-semibold text-burgundy-800 mb-2">Insights</h3>
        <ul className="space-y-2 text-sm text-burgundy-800/80">
          {data.insights.map((t) => (
            <li key={t} className="pl-3 border-l-2 border-gold-400">{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
