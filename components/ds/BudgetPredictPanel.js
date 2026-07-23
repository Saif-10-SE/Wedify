import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import MetricCard from '@/components/ds/MetricCard';
import InsightBanner from '@/components/ds/InsightBanner';
import { getAreas, formatPrice } from '@/data/marquees';

export default function BudgetPredictPanel() {
  const areas = getAreas();
  const [form, setForm] = useState({
    guests: 500,
    events: 3,
    area: areas[0] || 'Gulberg',
    tier: 'premium',
  });
  const [result, setResult] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/ds/predict-budget')
      .then((r) => r.json())
      .then(setModel)
      .catch(() => {});
  }, []);

  const run = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        guests: form.guests === '' || form.guests == null ? 500 : Number(form.guests),
      };
      const res = await fetch('/api/ds/predict-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setResult(json);
      if (json.model) setModel(json.model);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <InsightBanner>
        <p className="mb-2">
          <strong>How it works:</strong> Enter your guest count, events, area, and venue style.
          We estimate a realistic total wedding budget from Lahore venue patterns.
        </p>
        <p>
          The cards below show how close our past estimates usually were, so you know this is a guide,
          not a final quote from a venue.
        </p>
      </InsightBanner>

      {model?.metrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard
            label="Typical miss"
            value={formatPrice(model.metrics.mae)}
            hint="Average amount estimates were off by"
          />
          <MetricCard
            label="Biggest swings"
            value={formatPrice(model.metrics.rmse)}
            hint="When a few predictions miss by a wider margin"
            accent="gold"
          />
          <MetricCard
            label="How well it fits"
            value={`${Math.round(Number(model.metrics.r2) * 100)}%`}
            hint="Share of cost differences we can explain"
            accent="blush"
          />
          <MetricCard
            label="Examples checked"
            value={model.metrics.n}
            hint={`Learned from ${model.trainSize} past-style weddings`}
          />
        </div>
      ) : null}

      <form onSubmit={run} className="theme-card p-4 sm:p-6 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <label className="text-sm">
          <span className="font-medium text-gray-700">Guests</span>
          <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2.5"
            value={form.guests === '' || form.guests == null ? '' : form.guests}
            onChange={(e) => {
              const raw = e.target.value;
              setForm({ ...form, guests: raw === '' ? '' : Number(raw) });
            }} />
        </label>
        <label className="text-sm">
          <span className="font-medium text-gray-700">Events</span>
          <select className="mt-1 w-full rounded-xl border px-3 py-2.5 bg-white" value={form.events}
            onChange={(e) => setForm({ ...form, events: Number(e.target.value) })}>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium text-gray-700">Area</span>
          <select className="mt-1 w-full rounded-xl border px-3 py-2.5 bg-white" value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium text-gray-700">Venue tier</span>
          <select className="mt-1 w-full rounded-xl border px-3 py-2.5 bg-white" value={form.tier}
            onChange={(e) => setForm({ ...form, tier: e.target.value })}>
            <option value="value">Value</option>
            <option value="mid">Mid</option>
            <option value="premium">Premium</option>
            <option value="luxury">Luxury</option>
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold disabled:opacity-60">
            {loading ? 'Predicting…' : 'Predict budget'}
          </button>
        </div>
      </form>

      {result ? (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="theme-card p-6 bg-gradient-to-br from-burgundy-800 to-burgundy-950 text-white">
            <p className="text-sm text-white/70 uppercase tracking-wider">Predicted wedding total</p>
            <p className="text-4xl font-serif font-bold text-gold-400 mt-2">{formatPrice(result.predictedTotal)}</p>
            <p className="mt-3 text-white/80 text-sm">
              Range {formatPrice(result.low)} to {formatPrice(result.high)} · about {formatPrice(result.perHead)} / guest
            </p>
          </div>
          <div className="theme-card p-4 sm:p-6">
            <p className="font-semibold text-burgundy-800 mb-3">What affects your estimate most</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={model?.importance || []} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e4ea" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="feature" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="relative" fill="#7a2846" radius={[0, 6, 6, 0]} name="Impact %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
