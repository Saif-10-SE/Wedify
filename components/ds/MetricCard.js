export default function MetricCard({ label, value, hint, accent = 'burgundy' }) {
  const accents = {
    burgundy: 'from-burgundy-700 to-burgundy-900 text-gold-300',
    gold: 'from-gold-500 to-gold-700 text-white',
    blush: 'from-rose-100 to-amber-50 text-burgundy-800',
  };
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accents[accent] || accents.burgundy} p-4 sm:p-5 shadow-lg shadow-burgundy-900/10`}>
      <p className="text-xs uppercase tracking-wider opacity-80 mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold font-serif leading-tight">{value}</p>
      {hint ? <p className="text-xs mt-2 opacity-75">{hint}</p> : null}
    </div>
  );
}
