import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendPanel from '@/components/ds/RecommendPanel';
import BudgetPredictPanel from '@/components/ds/BudgetPredictPanel';
import AnalyticsPanel from '@/components/ds/AnalyticsPanel';
import SeasonalityPanel from '@/components/ds/SeasonalityPanel';
import RsvpPanel from '@/components/ds/RsvpPanel';
import { BarChart3, Sparkles, LineChart, CalendarRange, Users } from 'lucide-react';

const TABS = [
  { id: 'recommend', label: 'Recommend', icon: Sparkles },
  { id: 'budget', label: 'Budget Estimate', icon: LineChart },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'seasonality', label: 'Seasonality', icon: CalendarRange },
  { id: 'rsvp', label: 'RSVP Predict', icon: Users },
];

export default function InsightsPage() {
  const [tab, setTab] = useState('recommend');

  return (
    <>
      <Head>
        <title>Data Insights | Wedify</title>
        <meta name="description" content="Data Science hub: venue recommendations, budget ML, analytics, seasonality, RSVP prediction." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <section className="pt-24 sm:pt-28 pb-10 bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12), transparent 35%)' }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3">Wedding insights</p>
          <h1 className="text-3xl sm:text-5xl font-serif text-white mb-4 max-w-3xl">
            Insights that turn Lahore wedding data into decisions
          </h1>
          <p className="text-white/75 max-w-2xl text-sm sm:text-base leading-relaxed">
            Find matching venues, estimate your budget, explore market trends, check busy seasons, and
            predict guest attendance with clear, easy-to-read results.
          </p>
        </div>
      </section>

      <div className="sticky top-16 sm:top-20 z-30 border-b border-burgundy-100/70 bg-[#fff8f1]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === id
                    ? 'bg-burgundy-700 text-white shadow-md shadow-burgundy-900/15'
                    : 'text-burgundy-800/70 hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="section-blush py-8 sm:py-12 min-h-screen">
        <div className="relative z-[1] max-w-7xl mx-auto px-4">
          {tab === 'recommend' ? <RecommendPanel /> : null}
          {tab === 'budget' ? <BudgetPredictPanel /> : null}
          {tab === 'analytics' ? <AnalyticsPanel /> : null}
          {tab === 'seasonality' ? <SeasonalityPanel /> : null}
          {tab === 'rsvp' ? <RsvpPanel /> : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
