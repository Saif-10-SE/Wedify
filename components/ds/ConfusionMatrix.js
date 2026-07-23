export default function ConfusionMatrix({ matrix }) {
  if (!matrix) return null;
  const { tp = 0, tn = 0, fp = 0, fn = 0 } = matrix;
  const cell = (label, value, tone) => (
    <div className={`rounded-xl p-3 text-center ${tone}`}>
      <p className="text-[11px] uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
  return (
    <div>
      <p className="text-sm font-semibold text-burgundy-800 mb-3">Confusion Matrix (holdout)</p>
      <div className="grid grid-cols-2 gap-2">
        {cell('True Positive', tp, 'bg-emerald-50 text-emerald-800')}
        {cell('False Positive', fp, 'bg-amber-50 text-amber-900')}
        {cell('False Negative', fn, 'bg-rose-50 text-rose-900')}
        {cell('True Negative', tn, 'bg-sky-50 text-sky-900')}
      </div>
    </div>
  );
}
