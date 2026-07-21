import Head from 'next/head';
import { useState } from 'react';
import {
  fetchMarquees,
  fetchTestimonials,
  featuredTestimonials as pickFeaturedTestimonials,
} from '@/lib/catalogService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialCard from '@/components/TestimonialCard';
import { Star, Quote, Filter, Heart, Users } from 'lucide-react';

export default function Testimonials({
  testimonials = [],
  marquees = [],
  featuredTestimonials = [],
  dataSource = 'local',
}) {
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredTestimonials = testimonials
    .filter(t => selectedVenue === 'all' || t.venueSlug === selectedVenue)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'guests') return b.guests - a.guests;
      return 0; // recent - keep original order
    });

  // Stats
  const averageRating = testimonials.length
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '0';
  const totalGuests = testimonials.reduce((acc, t) => acc + (t.guests || 0), 0);

  return (
    <>
      <Head>
        <title>Real Wedding Stories | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Read real reviews and testimonials from couples who celebrated their weddings at Lahore's finest venues." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-burgundy-800 to-burgundy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Quote className="absolute top-20 left-20 w-64 h-64 text-white" />
          <Quote className="absolute bottom-20 right-20 w-64 h-64 text-white rotate-180" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm mb-6">
            <Heart className="w-4 h-4" />
            <span>Real Love Stories</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            Wedding <span className="text-gold-400">Testimonials</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
            Hear from real couples about their magical wedding experiences at Lahore's most prestigious venues.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-gold-400">
                <Star className="w-8 h-8 fill-current" />
                {averageRating}
              </div>
              <p className="text-white/60 text-sm">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400">{testimonials.length}+</div>
              <p className="text-white/60 text-sm">Happy Couples</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-gold-400">
                <Users className="w-8 h-8" />
                {(totalGuests / 1000).toFixed(0)}K+
              </div>
              <p className="text-white/60 text-sm">Guests Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-gold-50 to-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <Quote className="absolute top-4 right-4 w-32 h-32 text-gold-200" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <img
                src={featuredTestimonials[0]?.image}
                alt={featuredTestimonials[0]?.couple}
                className="w-48 h-48 rounded-full object-cover border-4 border-gold-500 shadow-xl"
              />
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
                  "{featuredTestimonials[0]?.review}"
                </p>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{featuredTestimonials[0]?.couple}</p>
                  <p className="text-gold-600">{featuredTestimonials[0]?.venue}</p>
                  <p className="text-gray-500 text-sm">{featuredTestimonials[0]?.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white"
              >
                <option value="all">All Venues</option>
                {marquees.map(m => (
                  <option key={m.slug} value={m.slug}>{m.name}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="guests">Most Guests</option>
              </select>
            </div>
            <span className="text-gray-500">{filteredTestimonials.length} reviews</span>
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial}
                featured={testimonial.rating === 5}
              />
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No testimonials found for this venue.</p>
            </div>
          )}
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-16 bg-gradient-to-r from-burgundy-700 to-burgundy-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Share Your Wedding Story
          </h2>
          <p className="text-white/80 mb-8">
            Recently got married? We'd love to hear about your experience and feature your story!
          </p>
          <a 
            href="mailto:stories@lahoreeliteweddings.pk?subject=My Wedding Story"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-all"
          >
            <Quote className="w-5 h-5" />
            Submit Your Review
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const [marqueesRes, testimonialsRes] = await Promise.all([
    fetchMarquees(),
    fetchTestimonials(),
  ]);
  return {
    props: {
      marquees: marqueesRes.items,
      testimonials: testimonialsRes.items,
      featuredTestimonials: pickFeaturedTestimonials(testimonialsRes.items),
      dataSource: testimonialsRes.source,
    },
  };
}
