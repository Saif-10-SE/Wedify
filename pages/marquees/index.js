import Head from 'next/head';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { marquees, getAreas, formatPrice } from '@/data/marquees';
import Navbar from '@/components/Navbar';
import MarqueeCard from '@/components/MarqueeCard';
import Footer from '@/components/Footer';

export default function Marquees() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    area: '',
    minCapacity: '',
    maxBudget: '',
    sortBy: 'rating'
  });

  const areas = getAreas();

  useEffect(() => {
    if (!router.isReady) return;

    const areaFromQuery = typeof router.query.area === 'string' ? router.query.area : '';
    if (areaFromQuery && areas.includes(areaFromQuery)) {
      setFilters((prev) => ({ ...prev, area: areaFromQuery }));
    }
  }, [router.isReady, router.query.area, areas]);

  const filteredMarquees = useMemo(() => {
    let result = [...marquees];

    if (filters.area) {
      result = result.filter(m => m.area === filters.area);
    }

    if (filters.minCapacity) {
      result = result.filter(m => m.capacity.max >= parseInt(filters.minCapacity));
    }

    if (filters.maxBudget) {
      result = result.filter(m => m.pricing.perHead.min <= parseInt(filters.maxBudget));
    }

    // Sort
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.pricing.perHead.min - b.pricing.perHead.min);
        break;
      case 'price-high':
        result.sort((a, b) => b.pricing.perHead.min - a.pricing.perHead.min);
        break;
      case 'capacity':
        result.sort((a, b) => b.capacity.max - a.capacity.max);
        break;
    }

    return result;
  }, [filters]);

  return (
    <>
      <Head>
        <title>All Marquees | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-burgundy-800 to-burgundy-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Discover <span className="text-gold-400">Premium Venues</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Browse through Lahore's most prestigious marquees and find the perfect venue for your dream wedding
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            <select
              value={filters.minCapacity}
              onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">Any Capacity</option>
              <option value="500">500+ Guests</option>
              <option value="1000">1000+ Guests</option>
              <option value="1500">1500+ Guests</option>
              <option value="2000">2000+ Guests</option>
            </select>

            <select
              value={filters.maxBudget}
              onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">Any Budget</option>
              <option value="3500">Up to PKR 3,500/head</option>
              <option value="5000">Up to PKR 5,000/head</option>
              <option value="7000">Up to PKR 7,000/head</option>
              <option value="10000">Up to PKR 10,000/head</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="capacity">Capacity: High to Low</option>
            </select>

            <div className="ml-auto text-gray-600">
              Showing {filteredMarquees.length} venues
            </div>
          </div>
        </div>
      </section>

      {/* Marquees Grid */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMarquees.map((marquee) => (
              <MarqueeCard key={marquee.id} marquee={marquee} />
            ))}
          </div>

          {filteredMarquees.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No venues found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more options</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
