import { useState, useEffect } from 'react';

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
        <p className="text-2xl font-serif text-gold-500">🎉 Congratulations! 🎉</p>
        <p className="text-gray-600">Your special day has arrived!</p>
      </div>
    );
  }

  const TimeUnit = ({ value, label }) => (
    <div className="text-center">
      <div className="relative">
        <div className="bg-gradient-to-br from-burgundy-700 to-burgundy-900 text-white text-3xl md:text-5xl font-bold rounded-xl px-4 py-3 min-w-[80px] md:min-w-[100px] shadow-lg">
          {String(value).padStart(2, '0')}
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-1/2 bg-black/10 rounded-b-xl"></div>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mt-2 uppercase tracking-wider">{label}</p>
    </div>
  );

  return (
    <div className={`flex gap-3 md:gap-6 justify-center ${className}`}>
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-3xl md:text-5xl text-gold-500 self-start mt-3">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-3xl md:text-5xl text-gold-500 self-start mt-3">:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="text-3xl md:text-5xl text-gold-500 self-start mt-3">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
