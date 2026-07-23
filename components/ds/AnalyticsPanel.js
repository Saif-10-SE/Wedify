import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell, Legend,
} from 'recharts';
import MetricCard from '@/components/ds/MetricCard';
import InsightBanner from '@/components/ds/InsightBanner';
import { formatPrice } from '@/data/marquees';

const PIE_COLORS = ['#b8863c', '#7a2846', '#c54c79', '#d4a574'];

export default function AnalyticsPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/ds/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-rose-600">{error}</p>;
  if (!data) return <p className="text-gray-500">Loading analytics…</p>;

  return (
    <div>
      <InsightBanner>
        <p>
          Exploratory data analysis over the live marquee catalog plus synthetic inquiry history:
          average PKR/head by area, rating-vs-price scatter, capacity bands, tier mix, and value score
          (rating / log(price)).
        </p>
      </InsightBanner>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Venues" value={data.kpis.venueCount} />
        <MetricCard label="Areas" value={data.kpis.areaCount} accent="gold" />
        <MetricCard label="Avg entry price" value={formatPrice(data.kpis.avgPriceMin)} accent="blush" />
        <MetricCard label="Avg rating" value={`${data.kpis.avgRating}★`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="theme-card p-4 sm:p-5">
          <h3 className="font-semibold text-burgundy-800 mb-3">Avg per-head price by area</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byArea}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e4ea" />
                <XAxis dataKey="area" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatPrice(v)} />
                <Bar dataKey="avgPriceMin" fill="#7a2846" radius={[6, 6, 0, 0]} name="Avg PKR/head" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="theme-card p-4 sm:p-5">
          <h3 className="font-semibold text-burgundy-800 mb-3">Rating vs price (scatter)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e4ea" />
                <XAxis type="number" dataKey="price" name="Price" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="rating" name="Rating" domain={[4, 5]} tick={{ fontSize: 11 }} />
                <ZAxis type="number" dataKey="valueScore" range={[40, 160]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={data.scatter} fill="#b8863c" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="theme-card p-4 sm:p-5">
          <h3 className="font-semibold text-burgundy-800 mb-3">Venue tier mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.tierPie} dataKey="value" nameKey="name" outerRadius={90} label>
                  {data.tierPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="theme-card p-4 sm:p-5">
          <h3 className="font-semibold text-burgundy-800 mb-3">Capacity distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.capacityBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e4ea" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#c54c79" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="theme-card p-5 mb-4">
        <h3 className="font-semibold text-burgundy-800 mb-3">Key insights</h3>
        <ul className="space-y-2">
          {data.insights.map((t) => (
            <li key={t} className="text-sm text-burgundy-800/80 pl-3 border-l-2 border-gold-400">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
