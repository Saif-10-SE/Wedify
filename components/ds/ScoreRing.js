export default function ScoreRing({ score = 0, size = 64 }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (s / 100) * c;
  const color = s >= 75 ? '#16a34a' : s >= 55 ? '#b8863c' : '#7a2846';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#f3e8ee" strokeWidth="5" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-sm font-bold text-gray-800">{Math.round(s)}</span>
    </div>
  );
}
