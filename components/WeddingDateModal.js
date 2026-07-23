import { useEffect, useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { Calendar, Heart, X } from 'lucide-react';
import DholIcon from '@/components/DholIcon';

export default function WeddingDateModal({ isOpen, onClose, allowSkip = true }) {
  const {
    weddingDate,
    brideName,
    groomName,
    setWeddingDate,
    setBrideName,
    setGroomName,
    clearBigDay,
  } = useWedding();
  const [selectedDate, setSelectedDate] = useState('');
  const [brideInput, setBrideInput] = useState('');
  const [groomInput, setGroomInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSelectedDate(weddingDate ? new Date(weddingDate).toISOString().split('T')[0] : '');
    setBrideInput(brideName || '');
    setGroomInput(groomName || '');
    setError('');
  }, [isOpen, weddingDate, brideName, groomName]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!brideInput.trim()) {
      setError("Please enter the bride's name.");
      return;
    }
    if (!groomInput.trim()) {
      setError("Please enter the groom's name.");
      return;
    }
    if (!selectedDate) {
      setError('Please select your wedding date.');
      return;
    }
    setBrideName(brideInput.trim());
    setGroomName(groomInput.trim());
    setWeddingDate(new Date(selectedDate));
    onClose?.();
  };

  const handleCancel = () => {
    clearBigDay();
    setSelectedDate('');
    setBrideInput('');
    setGroomInput('');
    onClose?.({ cancelled: true });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2a0a24]/70 p-4 backdrop-blur-md"
      onClick={allowSkip ? handleCancel : undefined}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border-[3px] border-white/45 bg-gradient-to-b from-[#ff4da6] via-[#b01a7a] to-[#4a0e6b] text-white shadow-[0_28px_80px_rgba(90,10,70,0.55)] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -left-10 top-10 h-36 w-36 rounded-full bg-[#FFE566]/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 top-0 h-28 w-28 rounded-full bg-white/25 blur-2xl" />

        {allowSkip ? (
          <button
            type="button"
            onClick={handleCancel}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-2 text-white ring-2 ring-white/40 transition hover:bg-black/50"
            aria-label="Cancel"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        <div className="relative px-5 pb-2 pt-7 text-center sm:px-7">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#FFE566] drop-shadow">
            Wedify Shaadi Alert
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:text-4xl">
            When is your
            <span className="block text-[#FFE566]">BIG DAY?</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-sm font-semibold text-white/95">
            Drop bride & groom names + date. We will start a loud, live countdown with dhol energy.
          </p>
        </div>

        <div className="relative mx-4 mb-3 rounded-2xl bg-black/35 p-4 ring-2 ring-white/25 backdrop-blur-sm sm:mx-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFE566]">
                <Heart className="h-3.5 w-3.5 fill-current" />
                Bride name
              </span>
              <input
                type="text"
                value={brideInput}
                onChange={(e) => setBrideInput(e.target.value)}
                placeholder="Fatima"
                className="w-full rounded-xl border-2 border-white/40 bg-white/15 px-3 py-3 text-base font-bold text-white placeholder:font-medium placeholder:text-white/55 outline-none focus:border-[#FFE566] focus:bg-white/25"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFE566]">
                <Heart className="h-3.5 w-3.5 fill-current" />
                Groom name
              </span>
              <input
                type="text"
                value={groomInput}
                onChange={(e) => setGroomInput(e.target.value)}
                placeholder="Azmeer"
                className="w-full rounded-xl border-2 border-white/40 bg-white/15 px-3 py-3 text-base font-bold text-white placeholder:font-medium placeholder:text-white/55 outline-none focus:border-[#FFE566] focus:bg-white/25"
              />
            </label>
          </div>

          <label className="mt-3 block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFE566]">
              <Calendar className="h-3.5 w-3.5" />
              Wedding date
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl border-2 border-white/40 bg-white/15 px-3 py-3 text-base font-bold text-white outline-none focus:border-[#FFE566] focus:bg-white/25 [color-scheme:dark]"
            />
          </label>

          {error ? (
            <p className="mt-3 rounded-lg bg-[#FFE566] px-3 py-2 text-sm font-bold text-[#4a0e6b]">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {allowSkip ? (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border-2 border-white/40 bg-transparent px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl bg-[#FFE566] py-3.5 text-base font-black text-[#4a0e6b] shadow-[0_8px_24px_rgba(255,229,102,0.35)] transition hover:scale-[1.02] hover:bg-white"
            >
              Start the dhol countdown
            </button>
          </div>
        </div>

        <div className="relative flex items-end justify-center gap-1 pb-3 pt-1" aria-hidden>
          <div className="absolute inset-x-0 bottom-0 h-10 rounded-t-[50%] bg-[#1a0618]/50" />
          <DholIcon className="relative z-[1] h-14 w-12 animate-dholBounce -rotate-12 drop-shadow-lg" />
          <DholIcon className="relative z-[2] h-[4.5rem] w-16 animate-dholBounce-delay drop-shadow-xl" />
          <DholIcon className="relative z-[1] h-14 w-12 animate-dholBounce-delay2 rotate-12 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}
