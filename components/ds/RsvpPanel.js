import { useEffect, useState } from 'react';
import MetricCard from '@/components/ds/MetricCard';
import ConfusionMatrix from '@/components/ds/ConfusionMatrix';
import InsightBanner from '@/components/ds/InsightBanner';

const defaultGuests = [
  { name: 'Ayesha Family', members: 4, leadDays: 30, relationship: 'Close Family', pastRsvpRate: 0.9 },
  { name: 'Office Friends', members: 3, leadDays: 10, relationship: 'Colleague', pastRsvpRate: 0.55 },
  { name: 'College Group', members: 5, leadDays: 21, relationship: 'Friend', pastRsvpRate: 0.7 },
  { name: 'Distant Relatives', members: 6, leadDays: 5, relationship: 'Distant Relative', pastRsvpRate: 0.4 },
];

function displayNum(value) {
  return value === '' || value == null ? '' : value;
}

function parseNumInput(raw) {
  return raw === '' ? '' : Number(raw);
}

export default function RsvpPanel({ initialGuests }) {
  const [guests, setGuests] = useState(initialGuests?.length ? initialGuests : defaultGuests);
  const [result, setResult] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/ds/predict-rsvp')
      .then((r) => r.json())
      .then(setModel)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialGuests?.length) setGuests(initialGuests);
  }, [initialGuests]);

  const updateGuest = (idx, patch) => {
    setGuests((prev) => prev.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  };

  const addGuest = () => {
    setGuests((prev) => [...prev, { name: '', members: '', leadDays: '', relationship: 'Friend', pastRsvpRate: '' }]);
  };

  const run = async () => {
    setLoading(true);
    try {
      const normalized = guests.map((g) => ({
        ...g,
        members: g.members === '' || g.members == null ? 1 : Number(g.members),
        leadDays: g.leadDays === '' || g.leadDays == null ? 14 : Number(g.leadDays),
        pastRsvpRate: g.pastRsvpRate === '' || g.pastRsvpRate == null ? 0.6 : Number(g.pastRsvpRate),
      }));
      const res = await fetch('/api/ds/predict-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: normalized }),
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
          <strong>How it works:</strong> We estimate who is likely to attend based on party size,
          how early you invited them, relationship, and past RSVP habits.
        </p>
        <p>
          Use this to plan headcount and catering with fewer surprises. The scorecards below show how
          reliable these guesses usually are.
        </p>
      </InsightBanner>

      {model?.metrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard
            label="Overall correctness"
            value={`${Math.round(Number(model.metrics.accuracy) * 100)}%`}
            hint="How often the guess matches the outcome"
          />
          <MetricCard
            label="When we say yes"
            value={`${Math.round(Number(model.metrics.precision) * 100)}%`}
            hint="Of predicted attendees, how many really come"
            accent="gold"
          />
          <MetricCard
            label="Guests we catch"
            value={`${Math.round(Number(model.metrics.recall) * 100)}%`}
            hint="Of people who do attend, how many we spotted"
            accent="blush"
          />
          <MetricCard
            label="Balance score"
            value={`${Math.round(Number(model.metrics.f1) * 100)}%`}
            hint="Blend of the two scores above"
          />
        </div>
      ) : null}

      <div className="theme-card p-4 sm:p-5 mb-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-semibold text-burgundy-800">Your guest groups</h3>
          <button type="button" onClick={addGuest} className="text-sm text-gold-700 font-medium hover:underline">+ Add guest</button>
        </div>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-2 font-medium">Name</th>
              <th className="py-2 pr-2 font-medium">Members</th>
              <th className="py-2 pr-2 font-medium">
                How early you invited
                <span className="block text-[10px] font-normal normal-case text-gray-400">days before wedding</span>
              </th>
              <th className="py-2 pr-2 font-medium">Relationship</th>
              <th className="py-2 font-medium">
                Usually attend?
                <span className="block text-[10px] font-normal normal-case text-gray-400">0 to 1</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, idx) => (
              <tr key={idx}>
                <td className="py-2 pr-2">
                  <input className="w-full rounded-lg border border-gray-200 px-2 py-1.5" value={g.name}
                    onChange={(e) => updateGuest(idx, { name: e.target.value })} />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" className="w-20 rounded-lg border border-gray-200 px-2 py-1.5"
                    value={displayNum(g.members)}
                    onChange={(e) => updateGuest(idx, { members: parseNumInput(e.target.value) })} />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" className="w-20 rounded-lg border border-gray-200 px-2 py-1.5"
                    value={displayNum(g.leadDays)}
                    onChange={(e) => updateGuest(idx, { leadDays: parseNumInput(e.target.value) })} />
                </td>
                <td className="py-2 pr-2">
                  <select className="rounded-lg border border-gray-200 px-2 py-1.5 bg-white" value={g.relationship}
                    onChange={(e) => updateGuest(idx, { relationship: e.target.value })}>
                    {['Close Family', 'Family', 'Relative', 'Friend', 'Colleague', 'Distant Relative'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <input type="number" step="0.05" min="0" max="1" className="w-20 rounded-lg border border-gray-200 px-2 py-1.5"
                    value={displayNum(g.pastRsvpRate)}
                    onChange={(e) => updateGuest(idx, { pastRsvpRate: parseNumInput(e.target.value) })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="mt-4 px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Predicting…' : 'Predict attendance'}
        </button>
      </div>

      {result ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 theme-card p-4 sm:p-5 overflow-x-auto">
            <h3 className="font-semibold text-burgundy-800 mb-3">Predictions</h3>
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 font-medium">Guest</th>
                  <th className="py-2 font-medium">P(attend)</th>
                  <th className="py-2 font-medium">Expected headcount</th>
                  <th className="py-2 font-medium">Label</th>
                </tr>
              </thead>
              <tbody>
                {result.predictions.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden max-w-[100px]">
                          <div className="h-full bg-gold-500" style={{ width: `${p.probability * 100}%` }} />
                        </div>
                        <span>{(p.probability * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-2.5">{p.expectedMembers}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.attend ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {p.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-gray-600">
              Expected total headcount: <strong>{result.summary.expectedHeadcount}</strong>
              {' · '}
              Likely attending parties: <strong>{result.summary.likelyAttendingParties}</strong>
            </p>
          </div>
          <div className="theme-card p-4 sm:p-5">
            <ConfusionMatrix matrix={result.metrics?.confusion || model?.metrics?.confusion} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
