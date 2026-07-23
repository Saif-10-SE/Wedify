import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useWedding } from '@/context/WeddingContext';

function calcParts(targetDate) {
  const difference = new Date(targetDate) - new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false
  };
}

/** Slim personalized countdown shown at the top of the site navbar. */
export default function BigDayCountdownBanner() {
  const { weddingDate, coupleName } = useWedding();
  const [parts, setParts] = useState(null);

  useEffect(() => {
    if (!weddingDate) {
      setParts(null);
      return undefined;
    }
    setParts(calcParts(weddingDate));
    const id = setInterval(() => setParts(calcParts(weddingDate)), 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

  if (!weddingDate || !parts) return null;

  const greeting = coupleName ? `Hey ${coupleName}` : 'Hey lovebirds';

  if (parts.expired) {
    return (
      <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-900 py-2 text-center text-xs text-white sm:text-sm">
        <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-gold-400" />
        {greeting}. Your big day is here. Congratulations!
      </div>
    );
  }

  const unit = (value, label) => (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="font-bold tabular-nums text-gold-300">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-wide text-white/70">{label}</span>
    </span>
  );

  return (
    <div className="border-b border-gold-300/30 bg-gradient-to-r from-burgundy-800 via-burgundy-900 to-burgundy-800 py-2 text-center text-xs text-white sm:text-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3">
        <Heart className="hidden h-3.5 w-3.5 text-gold-400 sm:inline" fill="currentColor" />
        <span className="font-medium">
          {greeting}
          <span className="text-white/60"> · </span>
          <span className="text-gold-200">your big day awaits</span>
        </span>
        <span className="inline-flex items-center gap-2 sm:gap-3">
          {unit(parts.days, 'd')}
          {unit(parts.hours, 'h')}
          {unit(parts.minutes, 'm')}
          {unit(parts.seconds, 's')}
        </span>
        <Link href="/checklist" className="underline decoration-gold-400/50 underline-offset-2 hover:text-gold-300">
          Checklist
        </Link>
      </div>
    </div>
  );
}
