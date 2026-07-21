import { useState, useEffect } from 'react';
import { PartyPopper } from 'lucide-react';

export default function CountdownTimer({ targetDate, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-2xl font-serif text-gold-500 inline-flex items-center gap-2 justify-center"><PartyPopper className="w-6 h-6" />Congratulations!<PartyPopper className="w-6 h-6" /></p>
        <p className="text-gray-600">Your special day has arrived!</p>
      </div>
    );
  }

  const TimeUnit = ({ value, label, className = '' }) => (
    <div className={`text-center ${className}`}>
      <div className="relative">
        <div className="bg-gradient-to-br from-burgundy-700 to-burgundy-900 text-white text-xl sm:text-3xl md:text-5xl font-bold rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2 sm:py-3 min-w-[3rem] sm:min-w-[80px] md:min-w-[100px] shadow-lg">
          {String(value).padStart(2, '0')}
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-1/2 bg-black/10 rounded-b-lg sm:rounded-b-xl"></div>
      </div>
      <p className="text-[10px] sm:text-xs md:text-sm text-white/80 sm:text-gray-600 mt-1.5 sm:mt-2 uppercase tracking-wider">{label}</p>
    </div>
  );

  return (
    <div className={`flex gap-1.5 sm:gap-3 md:gap-6 justify-center ${className}`}>
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-xl sm:text-3xl md:text-5xl text-gold-400 sm:text-gold-500 self-start mt-2 sm:mt-3">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-xl sm:text-3xl md:text-5xl text-gold-400 sm:text-gold-500 self-start mt-2 sm:mt-3">:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="hidden sm:block text-3xl md:text-5xl text-gold-500 self-start mt-3">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" className="hidden sm:block" />
    </div>
  );
}
