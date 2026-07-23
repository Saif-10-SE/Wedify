import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

export default function InsightBanner({ title = 'How this works', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="theme-card overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/60 transition-colors"
      >
        <span className="inline-flex items-center gap-2 font-semibold text-burgundy-800">
          <Info className="w-4 h-4 text-gold-600" />
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className="px-4 pb-4 text-sm text-burgundy-800/80 leading-relaxed border-t border-burgundy-50 pt-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
