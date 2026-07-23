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
    setGuests((prev) => [...prev, { name: '', members: 2, leadDays: 14, relationship: 'Friend', pastRsvpRate: 0.6 }]);
  };

  const run = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ds/predict-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests }),
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
          <strong>Method:</strong> Logistic regression predicts attendance probability from party size,
          invite lead time, family vs friend, and historical RSVP rate.
        </p>
        <p>
          Threshold 0.5 for class labels. Holdout accuracy / precision / recall / F1 and confusion matrix
          support your Data Science viva narrative.
        </p>
      </InsightBanner>

      {model?.metrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard label="Accuracy" value={model.metrics.accuracy} />
          <MetricCard label="Precision" value={model.metrics.precision} accent="gold" />
          <MetricCard label="Recall" value={model.metrics.recall} accent="blush" />
          <MetricCard label="F1" value={model.metrics.f1} />
        </div>
      ) : null}

      <div className="theme-card p-4 sm:p-5 mb-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-semibold text-burgundy-800">Guest list features</h3>
          <button type="button" onClick={addGuest} className="text-sm text-gold-700 font-medium hover:underline">+ Add guest</button>
        </div>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">Members</th>
              <th className="py-2 pr-2">Lead days</th>
              <th className="py-2 pr-2">Relationship</th>
              <th className="py-2">Past RSVP</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, idx) => (
              <tr key={idx} className="border-b border-gray-50">
                <td className="py-2 pr-2">
                  <input className="w-full rounded-lg border px-2 py-1.5" value={g.name}
                    onChange={(e) => updateGuest(idx, { name: e.target.value })} />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" className="w-20 rounded-lg border px-2 py-1.5" value={g.members}
                    onChange={(e) => updateGuest(idx, { members: Number(e.target.value) })} />
                </td>
                <td className="py-2 pr-2">
                  <input type="number" className="w-20 rounded-lg border px-2 py-1.5" value={g.leadDays}
                    onChange={(e) => updateGuest(idx, { leadDays: Number(e.target.value) })} />
                </td>
                <td className="py-2 pr-2">
                  <select className="rounded-lg border px-2 py-1.5 bg-white" value={g.relationship}
                    onChange={(e) => updateGuest(idx, { relationship: e.target.value })}>
                    {['Close Family', 'Family', 'Relative', 'Friend', 'Colleague', 'Distant Relative'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <input type="number" step="0.05" min="0" max="1" className="w-20 rounded-lg border px-2 py-1.5"
                    value={g.pastRsvpRate}
                    onChange={(e) => updateGuest(idx, { pastRsvpRate: Number(e.target.value) })} />
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
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Guest</th>
                  <th className="py-2">P(attend)</th>
                  <th className="py-2">Expected headcount</th>
                  <th className="py-2">Label</th>
                </tr>
              </thead>
              <tbody>
                {result.predictions.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2 font-medium">{p.name}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden max-w-[100px]">
                          <div className="h-full bg-gold-500" style={{ width: `${p.probability * 100}%` }} />
                        </div>
                        <span>{(p.probability * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-2">{p.expectedMembers}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.attend ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {p.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-gray-600">
              Expected total headcount: <strong>{result.summary.expectedHeadcount}</strong> ·
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
