import { useEffect, useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import WeddingDateModal from '@/components/WeddingDateModal';

/**
 * Opens the big-day popup on every fresh visit when bride, groom, or date is missing.
 * Cancel clears the timer; leaving the site also resets so the form is required again.
 */
export default function BigDayGate() {
  const { weddingDate, brideName, groomName, isWeddingHydrated, clearBigDay } = useWedding();
  const [open, setOpen] = useState(false);
  const [skippedThisVisit, setSkippedThisVisit] = useState(false);

  useEffect(() => {
    if (!isWeddingHydrated) return;
    const incomplete = !weddingDate || !brideName || !groomName;
    if (incomplete && !skippedThisVisit) {
      setOpen(true);
    }
  }, [isWeddingHydrated, weddingDate, brideName, groomName, skippedThisVisit]);

  const handleClose = (meta) => {
    setOpen(false);
    if (meta?.cancelled) {
      clearBigDay();
      setSkippedThisVisit(true);
    }
  };

  return <WeddingDateModal isOpen={open} onClose={handleClose} allowSkip />;
}
