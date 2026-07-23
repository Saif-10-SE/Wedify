import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin } from 'lucide-react';
import ScoreRing from '@/components/ds/ScoreRing';
import InsightBanner from '@/components/ds/InsightBanner';
import { getAreas, formatPrice } from '@/data/marquees';

const STYLE_OPTIONS = ['lawn', 'ac', 'heritage', 'rooftop', 'valet', 'bridal'];

export default function RecommendPanel() {
  const areas = getAreas();
  const [form, setForm] = useState({
    budget: 5000000,
    guests: 500,
    area: areas[0] || '',
    events: 3,
    styleTags: [],
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      styleTags: prev.styleTags.includes(tag)
        ? prev.styleTags.filter((t) => t !== tag)
        : [...prev.styleTags, tag],
    }));
  };

  const run = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        budget: form.budget === '' || form.budget == null ? 5000000 : Number(form.budget),
        guests: form.guests === '' || form.guests == null ? 500 : Number(form.guests),
      };
      const res = await fetch('/api/ds/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <InsightBanner>
        <p className="mb-2">
          <strong>Method:</strong> Content-based recommendation. Each venue gets a weighted score from
          budget fit, guest-capacity fit, area match, rating, and style/amenity overlap.
        </p>
        <p>Scores are explainable so you see why each venue ranked high. No black-box neural net; ideal for viva defense.</p>
      </InsightBanner>

      <form onSubmit={run} className="theme-card p-4 sm:p-6 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <label className="block text-sm">
          <span className="font-medium text-gray-700">Total budget (PKR)</span>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5"
            value={form.budget === '' || form.budget == null ? '' : form.budget}
            onChange={(e) => {
              const raw = e.target.value;
              setForm({ ...form, budget: raw === '' ? '' : Number(raw) });
            }}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-gray-700">Guests</span>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5"
            value={form.guests === '' || form.guests == null ? '' : form.guests}
            onChange={(e) => {
              const raw = e.target.value;
              setForm({ ...form, guests: raw === '' ? '' : Number(raw) });
            }}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-gray-700">Preferred area</span>
          <select
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 bg-white"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          >
            <option value="">Any area</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-gray-700">Events</span>
          <select
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 bg-white"
            value={form.events}
            onChange={(e) => setForm({ ...form, events: Number(e.target.value) })}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Style tags</p>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  form.styleTags.includes(tag)
                    ? 'bg-burgundy-700 text-white border-burgundy-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gold-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Scoring venues…' : 'Get recommendations'}
          </button>
        </div>
      </form>

      {error ? <p className="text-rose-600 mb-4">{error}</p> : null}

      {data?.results?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {data.results.map((v) => (
            <div key={v.slug} className="theme-card p-4 flex gap-4 items-start">
              <img src={v.image} alt={v.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/marquees/${v.slug}`} className="font-serif text-lg font-semibold text-gray-800 hover:text-gold-600">
                      {v.name}
                    </Link>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {v.area} · {v.rating}★
                    </p>
                  </div>
                  <ScoreRing score={v.score} />
                </div>
                <p className="text-sm text-gold-700 font-medium mt-2">
                  {formatPrice(v.priceMin)}+ / head · {v.capacity.min}-{v.capacity.max} guests
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {v.reasons.map((r) => (
                    <span key={r} className="text-[11px] px-2 py-1 rounded-full bg-burgundy-50 text-burgundy-800">{r}</span>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-5 gap-1 text-[10px] text-center text-gray-500">
                  {Object.entries(v.breakdown).map(([k, val]) => (
                    <div key={k} className="bg-gray-50 rounded-lg py-1.5 px-0.5">
                      <div className="font-semibold text-gray-800">{val}</div>
                      <div className="truncate">{k.replace(/([A-Z])/g, ' $1')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
