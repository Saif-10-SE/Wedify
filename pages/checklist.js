import Head from 'next/head';
import { useState, useEffect } from 'react';
import { weddingChecklist, getAllChecklistItems, getTotalTaskCount } from '@/data/checklist';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWedding } from '@/context/WeddingContext';
import CountdownTimer from '@/components/CountdownTimer';
import WeddingDateModal from '@/components/WeddingDateModal';
import { CheckCircle, Circle, Calendar, ChevronDown, ChevronUp, Download, Share2, Sparkles, Clock } from 'lucide-react';

export default function Checklist() {
  const { weddingDate, setWeddingDate, getDaysUntilWedding } = useWedding();
  const [completedTasks, setCompletedTasks] = useState({});
  const [expandedPeriods, setExpandedPeriods] = useState(['12-months', '9-months']);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [notes, setNotes] = useState({});

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('checklist_completed');
      const savedNotes = localStorage.getItem('checklist_notes');
      if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('checklist_completed', JSON.stringify(completedTasks));
    }
  }, [completedTasks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('checklist_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const togglePeriod = (period) => {
    setExpandedPeriods(prev => 
      prev.includes(period) 
        ? prev.filter(p => p !== period) 
        : [...prev, period]
    );
  };

  const totalTasks = getTotalTaskCount();
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / totalTasks) * 100);

  const daysLeft = getDaysUntilWedding();

  const getCompletedInPeriod = (period) => {
    const periodTasks = weddingChecklist[period]?.tasks || [];
    return periodTasks.filter(task => completedTasks[task.id]).length;
  };

  const exportChecklist = () => {
    const data = getAllChecklistItems().map(period => ({
      period: period.title,
      tasks: period.tasks.map(task => ({
        task: task.task,
        completed: completedTasks[task.id] || false,
        note: notes[task.id] || ''
      }))
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-checklist.json';
    a.click();
  };

  return (
    <>
      <Head>
        <title>Wedding Planning Checklist | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Complete wedding planning checklist with timeline. Track your progress and never miss an important task." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-burgundy-800 to-burgundy-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Your Personal Wedding Planner</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            Wedding <span className="text-gold-400">Checklist</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Stay organized and stress-free with our comprehensive wedding planning timeline
          </p>
        </div>
      </section>

      {/* Progress & Countdown */}
      <section className="py-8 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Progress */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-medium">Planning Progress</span>
                <span className="text-gold-600 font-bold">{progressPercentage}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 shimmer"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{completedCount} of {totalTasks} tasks completed</p>
            </div>

            {/* Wedding Date */}
            <div className="flex items-center gap-4">
              {weddingDate ? (
                <div className="flex items-center gap-4 bg-gold-50 px-6 py-3 rounded-xl">
                  <Calendar className="w-5 h-5 text-gold-600" />
                  <div>
                    <p className="text-sm text-gray-600">Your Wedding</p>
                    <p className="font-semibold text-gold-700">
                      {new Date(weddingDate).toLocaleDateString('en-PK', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    {daysLeft && daysLeft > 0 && (
                      <p className="text-xs text-burgundy-600">{daysLeft} days to go!</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsDateModalOpen(true)}
                    className="text-sm text-burgundy-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsDateModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Set Wedding Date
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      {weddingDate && daysLeft && daysLeft > 0 && (
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-center text-lg text-gray-600 mb-4">Counting Down to Your Big Day</h2>
            <CountdownTimer targetDate={weddingDate} />
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <section className="py-4 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={exportChecklist}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {Object.entries(weddingChecklist).map(([period, data]) => {
              const isExpanded = expandedPeriods.includes(period);
              const periodCompleted = getCompletedInPeriod(period);
              const periodTotal = data.tasks.length;
              const periodProgress = Math.round((periodCompleted / periodTotal) * 100);

              return (
                <div 
                  key={period} 
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${
                    periodCompleted === periodTotal ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  {/* Period Header */}
                  <button
                    onClick={() => togglePeriod(period)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{data.icon}</span>
                      <div className="text-left">
                        <h3 className="text-xl font-serif font-semibold text-gray-800">{data.title}</h3>
                        <p className="text-sm text-gray-500">{periodCompleted} of {periodTotal} completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Mini Progress Bar */}
                      <div className="hidden sm:block w-32">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              periodProgress === 100 ? 'bg-green-500' : 'bg-gold-500'
                            }`}
                            style={{ width: `${periodProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Tasks */}
                  {isExpanded && (
                    <div className="border-t">
                      {data.tasks.map((task) => {
                        const isCompleted = completedTasks[task.id];
                        return (
                          <div
                            key={task.id}
                            className={`px-6 py-4 border-b last:border-b-0 transition-colors ${
                              isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => toggleTask(task.id)}
                                className={`flex-shrink-0 mt-0.5 transition-transform hover:scale-110 ${
                                  isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-gold-500'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-6 h-6" />
                                ) : (
                                  <Circle className="w-6 h-6" />
                                )}
                              </button>
                              <div className="flex-1">
                                <p className={`font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                                  {task.task}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                
                                {/* Note input */}
                                <input
                                  type="text"
                                  placeholder="Add a note..."
                                  value={notes[task.id] || ''}
                                  onChange={(e) => setNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
                                  className="mt-2 w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif text-gray-800 mb-8 text-center">
            Planning <span className="text-gold-600">Tips</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📅', title: 'Start Early', tip: 'Begin planning at least 12 months before for popular venues and vendors.' },
              { icon: '💰', title: 'Budget First', tip: 'Set your budget before making any bookings to avoid overspending.' },
              { icon: '📋', title: 'Stay Organized', tip: 'Use this checklist and keep all contracts and receipts in one place.' },
              { icon: '🤝', title: 'Delegate Tasks', tip: "Don't try to do everything yourself. Involve family and consider a planner." },
              { icon: '📸', title: 'Book Photographers Early', tip: 'Top photographers get booked 6-12 months in advance.' },
              { icon: '😌', title: 'Enjoy the Process', tip: "Remember to enjoy your engagement! Don't let stress take over." }
            ].map((tip, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <span className="text-3xl mb-3 block">{tip.icon}</span>
                <h3 className="font-semibold text-gray-800 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Date Modal */}
      <WeddingDateModal 
        isOpen={isDateModalOpen} 
        onClose={() => setIsDateModalOpen(false)} 
      />

      <Footer />
    </>
  );
}
