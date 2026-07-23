import { useEffect, useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { Calendar, Heart, Sparkles, X } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function WeddingDateModal({ isOpen, onClose, allowSkip = true }) {
  const {
    weddingDate,
    brideName,
    groomName,
    setWeddingDate,
    setBrideName,
    setGroomName,
    clearBigDay,
    getDaysUntilWedding,
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
      setError('Please enter the bride\'s name.');
      return;
    }
    if (!groomInput.trim()) {
      setError('Please enter the groom\'s name.');
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

  const handleClear = () => {
    clearBigDay();
    setSelectedDate('');
    setBrideInput('');
    setGroomInput('');
  };

  /** Cancel resets the timer and closes; next visit will ask again. */
  const handleCancel = () => {
    clearBigDay();
    setSelectedDate('');
    setBrideInput('');
    setGroomInput('');
    onClose?.({ cancelled: true });
  };

  const daysLeft = getDaysUntilWedding();
  const previewNames = [brideInput.trim(), groomInput.trim()].filter(Boolean).join(' & ');

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={allowSkip ? handleCancel : undefined}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-burgundy-700 to-burgundy-800 p-6 text-white">
          {allowSkip ? (
            <button
              type="button"
              onClick={handleCancel}
              className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Cancel"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
          <Sparkles className="mb-3 h-10 w-10 text-gold-400" />
          <h2 className="font-serif text-2xl">When is your big day?</h2>
          <p className="mt-1 text-sm text-white/80">
            Enter the bride and groom names plus your wedding date to start a live countdown.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <Heart className="mr-2 inline h-4 w-4 text-burgundy-600" />
                Bride&apos;s name
              </label>
              <input
                type="text"
                value={brideInput}
                onChange={(e) => setBrideInput(e.target.value)}
                placeholder="e.g. Fatima"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <Heart className="mr-2 inline h-4 w-4 text-gold-600" />
                Groom&apos;s name
              </label>
              <input
                type="text"
                value={groomInput}
                onChange={(e) => setGroomInput(e.target.value)}
                placeholder="e.g. Azmeer"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Calendar className="mr-2 inline h-4 w-4" />
              Wedding date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {selectedDate ? (
            <div className="mb-5 rounded-xl bg-gray-50 p-5">
              <p className="mb-3 text-center text-sm text-gray-600">
                {previewNames ? `${previewNames}, your countdown starts here` : 'Countdown preview'}
              </p>
              <CountdownTimer targetDate={selectedDate} />
            </div>
          ) : null}

          {daysLeft !== null && daysLeft > 0 && weddingDate ? (
            <div className="mb-5 rounded-xl border border-gold-200 bg-gold-50 p-4 text-center">
              <p className="text-gold-800">
                <span className="text-2xl font-bold">{daysLeft}</span> days until your wedding!
              </p>
            </div>
          ) : null}

          {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            {weddingDate ? (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl border-2 border-gray-300 px-5 py-3 font-semibold text-gray-600 transition-all hover:bg-gray-50"
              >
                Clear
              </button>
            ) : null}
            {allowSkip ? (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border-2 border-gray-200 px-5 py-3 font-semibold text-gray-500 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl bg-gold-500 py-3 font-semibold text-white transition-all hover:bg-gold-600"
            >
              Save & start countdown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
