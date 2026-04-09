import Head from 'next/head';
import Link from 'next/link';
import { useWedding } from '@/context/WeddingContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeCard from '@/components/MarqueeCard';
import { Heart, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export default function Favorites() {
  const { favorites, getFavoriteVenues, toggleFavorite } = useWedding();
  const favoriteVenues = getFavoriteVenues();

  return (
    <>
      <Head>
        <title>My Favorites | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-burgundy-800 to-burgundy-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full text-red-300 text-sm mb-6">
            <Heart className="w-4 h-4 fill-current" />
            <span>Your Saved Venues</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            My <span className="text-gold-400">Favorites</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Keep track of your favorite venues and compare them easily
          </p>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4">
          {favoriteVenues.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  <Heart className="inline w-5 h-5 text-red-500 mr-2 fill-current" />
                  {favoriteVenues.length} venue{favoriteVenues.length !== 1 ? 's' : ''} saved
                </p>
                <Link 
                  href="/compare"
                  className="flex items-center gap-2 px-4 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-lg transition-colors"
                >
                  Compare All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteVenues.map((marquee) => (
                  <div key={marquee.id} className="relative">
                    <MarqueeCard marquee={marquee} />
                    <button
                      onClick={() => toggleFavorite(marquee.slug)}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-serif text-gray-700 mb-3">No favorites yet</h2>
              <p className="text-gray-500 mb-8">
                Start exploring venues and save your favorites by clicking the heart icon
              </p>
              <Link
                href="/marquees"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Browse Venues
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
