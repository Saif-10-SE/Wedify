import { useId } from 'react';

/** Cute stylized South Asian dhol for wedding popups */
export default function DholIcon({ className = 'w-14 h-14', style }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `dholBody-${uid}`;

  return (
    <svg
      viewBox="0 0 80 90"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="40" cy="48" rx="28" ry="34" fill="#7c1d3a" />
      <ellipse cx="40" cy="48" rx="24" ry="30" fill={`url(#${gradId})`} />
      <ellipse cx="40" cy="28" rx="22" ry="8" fill="#f5d76e" stroke="#c9a227" strokeWidth="1.5" />
      <ellipse cx="40" cy="48" rx="23" ry="6" fill="#e8b923" stroke="#c9a227" strokeWidth="1" />
      <ellipse cx="40" cy="68" rx="22" ry="8" fill="#f5d76e" stroke="#c9a227" strokeWidth="1.5" />
      <path
        d="M18 32 Q28 40 18 48 Q28 56 18 64"
        stroke="#ffe9a8"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M62 32 Q52 40 62 48 Q52 56 62 64"
        stroke="#ffe9a8"
        strokeWidth="2"
        fill="none"
      />
      <ellipse cx="40" cy="22" rx="18" ry="6" fill="#fff4d6" opacity="0.9" />
      <ellipse cx="40" cy="20" rx="10" ry="3" fill="#ffffff" opacity="0.5" />
      <rect x="58" y="8" width="4" height="28" rx="2" fill="#5c3317" transform="rotate(25 60 22)" />
      <circle cx="66" cy="10" r="4" fill="#f5d76e" />
      <defs>
        <linearGradient id={gradId} x1="16" y1="18" x2="64" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c41e5a" />
          <stop offset="0.5" stopColor="#8b1538" />
          <stop offset="1" stopColor="#4a0e24" />
        </linearGradient>
      </defs>
    </svg>
  );
}
