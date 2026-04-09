import { useWedding } from '@/context/WeddingContext';
import { useState } from 'react';
import { Calendar, X, Sparkles } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function WeddingDateModal({ isOpen, onClose }) {
  const { weddingDate, setWeddingDate, getDaysUntilWedding } = useWedding();
  const [selectedDate, setSelectedDate] = useState(
    weddingDate ? new Date(weddingDate).toISOString().split('T')[0] : ''
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedDate) {
      setWeddingDate(new Date(selectedDate));
      onClose();
    }
  };

  const handleClear = () => {
    setWeddingDate(null);
    setSelectedDate('');
  };

  const daysLeft = getDaysUntilWedding();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <Sparkles className="w-10 h-10 mb-3 text-gold-400" />
          <h2 className="text-2xl font-serif">Your Wedding Date</h2>
          <p className="text-white/80 text-sm mt-1">Set your date to see the countdown</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Select Your Wedding Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Countdown Preview */}
          {selectedDate && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-center text-sm text-gray-600 mb-4">Countdown to your big day</p>
              <CountdownTimer targetDate={selectedDate} />
            </div>
          )}

          {/* Days Left Message */}
          {daysLeft !== null && daysLeft > 0 && (
            <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-gold-800">
                <span className="font-bold text-2xl">{daysLeft}</span> days until your wedding! 
                {daysLeft < 30 && " 🎉 So exciting!"}
                {daysLeft > 365 && " Plenty of time to plan!"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {weddingDate && (
              <button
                onClick={handleClear}
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition-all"
              >
                Clear Date
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!selectedDate}
              className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all"
            >
              Save Wedding Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
