import { useEffect, useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import WeddingDateModal, { SESSION_DISMISS_KEY } from '@/components/WeddingDateModal';

/**
 * Opens the big-day popup once context has hydrated if name or date is missing
 * (unless dismissed for this browser session).
 */
export default function BigDayGate() {
  const { weddingDate, coupleName, isWeddingHydrated } = useWedding();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isWeddingHydrated) return;
    const dismissed =
      typeof window !== 'undefined' && sessionStorage.getItem(SESSION_DISMISS_KEY) === '1';
    if ((!weddingDate || !coupleName) && !dismissed) {
      setOpen(true);
    }
  }, [isWeddingHydrated, weddingDate, coupleName]);

  return <WeddingDateModal isOpen={open} onClose={() => setOpen(false)} allowSkip />;
}
