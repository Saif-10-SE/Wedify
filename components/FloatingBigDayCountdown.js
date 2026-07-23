import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Minimize2, PartyPopper, Sparkles, X } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';
import WeddingDateModal from '@/components/WeddingDateModal';

function calcParts(targetDate) {
  if (!targetDate) return null;
  const difference = new Date(targetDate).getTime() - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  };
}

function Digit({ value, label }) {
  return (
    <div className="flex min-w-[2.75rem] flex-col items-center sm:min-w-[3.1rem]">
      <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-b from-burgundy-800 to-burgundy-950 px-1.5 py-1.5 text-center shadow-inner ring-1 ring-white/10">
        <span className="font-mono text-lg font-bold tabular-nums leading-none text-gold-300 sm:text-xl">
          {String(value).padStart(2, '0')}
        </span>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/25" />
      </div>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-burgundy-700/70">
        {label}
      </span>
    </div>
  );
}

/**
 * Floating big-day countdown — bottom-right, does not sit in/on the navbar.
 */
export default function FloatingBigDayCountdown() {
  const { weddingDate, coupleName } = useWedding();
  const [parts, setParts] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!weddingDate) {
      setParts(null);
      return undefined;
    }
    setParts(calcParts(weddingDate));
    const id = setInterval(() => setParts(calcParts(weddingDate)), 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

  if (!weddingDate || !parts || hidden) return null;

  const greeting = coupleName ? coupleName.split(',')[0].trim() : 'Lovebirds';

  if (collapsed) {
    return (
      <>
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full border border-gold-300/60 bg-white/95 px-4 py-2.5 text-sm font-semibold text-burgundy-900 shadow-[0_12px_40px_rgba(88,28,48,0.28)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(88,28,48,0.35)]"
          aria-label="Expand wedding countdown"
        >
          <Heart className="h-4 w-4 text-burgundy-700" fill="currentColor" />
          {parts.expired ? (
            <span>Big day!</span>
          ) : (
            <span className="font-mono tabular-nums text-burgundy-900">
              {parts.days}d {String(parts.hours).padStart(2, '0')}:
              {String(parts.minutes).padStart(2, '0')}:
              {String(parts.seconds).padStart(2, '0')}
            </span>
          )}
        </button>
        <WeddingDateModal isOpen={editOpen} onClose={() => setEditOpen(false)} allowSkip={false} />
      </>
    );
  }

  return (
    <>
      <aside
        className="fixed bottom-5 right-5 z-[60] w-[min(100vw-1.5rem,20rem)] origin-bottom-right animate-fadeIn"
        aria-live="polite"
        aria-label="Wedding countdown"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-[#fff8f1] via-white to-[#f8e8ef] p-4 shadow-[0_18px_50px_rgba(88,28,48,0.28)] ring-1 ring-burgundy-900/5 backdrop-blur-xl">
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold-300/25 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-burgundy-400/15 blur-2xl"
            aria-hidden
          />

          <div className="relative mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">
                <Sparkles className="h-3 w-3" />
                Big day timer
              </p>
              <p className="mt-1 truncate font-serif text-base text-burgundy-900">
                Hey {greeting}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="rounded-lg p-1.5 text-burgundy-700/60 transition hover:bg-burgundy-50 hover:text-burgundy-900"
                aria-label="Minimize countdown"
                title="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setHidden(true)}
                className="rounded-lg p-1.5 text-burgundy-700/60 transition hover:bg-burgundy-50 hover:text-burgundy-900"
                aria-label="Hide countdown"
                title="Hide"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {parts.expired ? (
            <div className="relative rounded-xl bg-burgundy-900/95 px-3 py-4 text-center text-white">
              <PartyPopper className="mx-auto mb-2 h-6 w-6 text-gold-400" />
              <p className="font-serif text-lg text-gold-300">Congratulations!</p>
              <p className="mt-1 text-xs text-white/75">Your special day has arrived.</p>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="mt-3 text-xs font-semibold text-gold-300 underline underline-offset-2 hover:text-gold-200"
              >
                Update wedding date
              </button>
            </div>
          ) : (
            <>
              <p className="relative mb-3 text-center text-xs text-burgundy-800/70">
                Time left until your big day
              </p>
              <div className="relative flex items-end justify-between gap-1 px-0.5">
                <Digit value={parts.days} label="Days" />
                <span className="mb-5 text-lg font-bold text-gold-500">:</span>
                <Digit value={parts.hours} label="Hrs" />
                <span className="mb-5 text-lg font-bold text-gold-500">:</span>
                <Digit value={parts.minutes} label="Min" />
                <span className="mb-5 text-lg font-bold text-gold-500">:</span>
                <Digit value={parts.seconds} label="Sec" />
              </div>
            </>
          )}

          <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-burgundy-100 pt-3">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="text-xs font-medium text-burgundy-700/80 hover:text-burgundy-900 hover:underline"
            >
              Edit date
            </button>
            <Link
              href="/checklist"
              className="rounded-full bg-burgundy-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-burgundy-900"
            >
              Checklist
            </Link>
          </div>
        </div>
      </aside>

      <WeddingDateModal isOpen={editOpen} onClose={() => setEditOpen(false)} allowSkip={false} />
    </>
  );
}
