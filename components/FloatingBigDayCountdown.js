import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Minimize2, PartyPopper, X } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';
import WeddingDateModal from '@/components/WeddingDateModal';
import DholIcon from '@/components/DholIcon';

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
    <div className="flex min-w-[3.1rem] flex-1 flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-xl bg-[#2a0a24]/85 px-1 py-2 text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.45)] ring-2 ring-white/25">
        <span className="block font-mono text-2xl font-black tabular-nums leading-none text-[#FFE566] drop-shadow-[0_2px_0_rgba(0,0,0,0.45)] sm:text-[1.65rem]">
          {String(value).padStart(2, '0')}
        </span>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/20" />
      </div>
      <span className="mt-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <div className="mb-5 flex flex-col gap-1.5 self-center px-0.5" aria-hidden>
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFE566] shadow-[0_0_8px_#FFE566]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFE566] shadow-[0_0_8px_#FFE566]" />
    </div>
  );
}

function DholParade() {
  return (
    <div className="relative mt-2 flex items-end justify-center gap-1 pb-1" aria-hidden>
      <div className="absolute inset-x-0 bottom-0 h-8 rounded-[100%] bg-[#1a0618]/55 blur-[1px]" />
      <DholIcon className="relative z-[1] h-12 w-11 animate-dholBounce -rotate-12 drop-shadow-lg" />
      <DholIcon className="relative z-[2] h-16 w-14 animate-dholBounce-delay drop-shadow-xl" />
      <DholIcon className="relative z-[1] h-12 w-11 animate-dholBounce-delay2 rotate-12 drop-shadow-lg" />
    </div>
  );
}

/**
 * Funky floating wedding countdown — high contrast, dhol parade, promo energy.
 */
export default function FloatingBigDayCountdown() {
  const { weddingDate, coupleLabel, brideName, groomName, clearBigDay } = useWedding();
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

  if (!weddingDate || !brideName || !groomName || !parts || hidden) return null;

  const greeting = coupleLabel || 'Lovebirds';

  if (collapsed) {
    return (
      <>
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="fixed bottom-5 right-5 z-[60] flex animate-bigDayBob items-center gap-2 rounded-full border-2 border-white/40 bg-gradient-to-r from-[#c41e5a] via-[#9b1b6a] to-[#6b1b8f] px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_40px_rgba(155,27,106,0.55)]"
          aria-label="Expand wedding countdown"
        >
          <DholIcon className="h-7 w-7" />
          {parts.expired ? (
            <span>Shaadi time!</span>
          ) : (
            <span className="font-mono tabular-nums tracking-wide text-[#FFE566]">
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
        className="fixed bottom-4 right-4 z-[60] w-[min(100vw-1.25rem,21rem)] animate-bigDayBob sm:bottom-5 sm:right-5"
        aria-live="polite"
        aria-label="Wedding countdown"
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border-[3px] border-white/50 bg-gradient-to-b from-[#e91e8c] via-[#9b1b6a] to-[#4a0e6b] p-4 text-white shadow-[0_22px_55px_rgba(120,20,90,0.55)]">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -left-8 top-8 h-28 w-28 rounded-full bg-[#FFE566]/25 blur-2xl" />
          <div className="pointer-events-none absolute -right-6 top-0 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute bottom-16 left-1/2 h-20 w-40 -translate-x-1/2 rounded-full bg-[#ff6bcb]/30 blur-2xl" />

          <div className="relative mb-2 flex items-start justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#FFE566] ring-1 ring-white/30">
              Big day timer
            </p>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="rounded-full bg-black/25 p-1.5 text-white ring-1 ring-white/30 transition hover:bg-black/40"
                aria-label="Minimize countdown"
                title="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  clearBigDay();
                  setHidden(true);
                }}
                className="rounded-full bg-black/25 p-1.5 text-white ring-1 ring-white/30 transition hover:bg-black/40"
                aria-label="Reset and hide countdown"
                title="Reset"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <h3 className="relative text-center font-serif text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            Hey {greeting}
          </h3>
          <p className="relative mt-1 text-center text-sm font-semibold text-[#FFE566]">
            Shaadi vibes loading…
          </p>

          {parts.expired ? (
            <div className="relative mt-4 rounded-2xl bg-black/35 px-3 py-4 text-center ring-2 ring-[#FFE566]/50">
              <PartyPopper className="mx-auto mb-2 h-7 w-7 text-[#FFE566]" />
              <p className="font-serif text-xl font-bold text-[#FFE566]">Mubarak!</p>
              <p className="mt-1 text-sm font-medium text-white">Your special day has arrived.</p>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="mt-3 text-sm font-bold text-white underline underline-offset-2"
              >
                Update wedding date
              </button>
            </div>
          ) : (
            <div className="relative mt-4 rounded-2xl bg-black/40 px-3 py-3 ring-2 ring-white/25 backdrop-blur-sm">
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-white/90">
                Time left until your big day
              </p>
              <div className="flex items-end justify-between gap-1">
                <Digit value={parts.days} label="Days" />
                <Colon />
                <Digit value={parts.hours} label="Hrs" />
                <Colon />
                <Digit value={parts.minutes} label="Min" />
                <Colon />
                <Digit value={parts.seconds} label="Sec" />
              </div>
            </div>
          )}

          <div className="relative mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-bold text-white underline decoration-[#FFE566] underline-offset-4 hover:text-[#FFE566]"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              Edit date
            </button>
            <Link
              href="/checklist"
              className="rounded-full bg-[#FFE566] px-4 py-2 text-sm font-black text-[#4a0e6b] shadow-lg transition hover:scale-105 hover:bg-white"
            >
              Checklist
            </Link>
          </div>

          <DholParade />
        </div>
      </aside>

      <WeddingDateModal isOpen={editOpen} onClose={() => setEditOpen(false)} allowSkip={false} />
    </>
  );
}
