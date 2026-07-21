import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice, realVenuePhotos as localPhotos } from '@/data/marquees';
import {
  fetchMarquees,
  fetchVendors,
  fetchTestimonials,
  fetchLivePriceExtras,
  featuredMarquees as pickFeaturedMarquees,
  featuredVendors as pickFeaturedVendors,
  featuredTestimonials as pickFeaturedTestimonials,
  areasFromMarquees,
  getVendorCategories,
} from '@/lib/catalogService';
import { useWedding } from '@/context/WeddingContext';
import Navbar from '@/components/Navbar';
import MarqueeCard from '@/components/MarqueeCard';
import TestimonialCard from '@/components/TestimonialCard';
import CountdownTimer from '@/components/CountdownTimer';
import WeddingDateModal from '@/components/WeddingDateModal';
import Footer from '@/components/Footer';
import { Heart, Calendar, Calculator, MapPin, Star, ArrowRight, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';

export default function Home({
  marquees = [],
  featuredMarquees = [],
  featuredVendors = [],
  featuredTestimonials = [],
  vendorCategories = [],
  areas = [],
  realVenuePhotos = localPhotos,
  dataSource = 'local',
}) {
  const { weddingDate, recentlyViewed, favorites } = useWedding();
  const [showDateModal, setShowDateModal] = useState(false);
  
  // Recently viewed venues
  const recentlyViewedVenues = recentlyViewed
    .slice(0, 4)
    .map(s => marquees.find(m => m.slug === s))
    .filter(Boolean);
  
  // Favorite venues
  const favoriteVenues = favorites
    .slice(0, 4)
    .map(s => marquees.find(m => m.slug === s))
    .filter(Boolean);

  const heroImages = featuredMarquees
    .map((venue) => venue.image)
    .filter(Boolean)
    .slice(0, 4);
  const heroImage = heroImages[0] || realVenuePhotos[0];

  return (
    <>
      <Head>
        <title>Wedify | Lahore Wedding Planner & Marquee Finder</title>
        <meta name="description" content="Discover Lahore's finest marquees with real 2026 pricing, budget tools, vendors, and an AI wedding planner — all in one place." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Wedify | Pakistan's First Wedding Planning Platform" />
        <meta property="og:image" content={heroImage} />
      </Head>

      <Navbar />

      {/* Hero stack: bg → overlays → collage → copy */}
      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#2b1f1a] lg:bg-[#fef9f1]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat sm:bg-bottom"
          style={{ backgroundImage: "url('/images/header-bg.jpg')" }}
          aria-hidden
        />

        {/* Mobile: darken photo so white copy stays readable without collage */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/45 to-black/65 lg:hidden"
          aria-hidden
        />

        {/* Desktop soft top veil */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] hidden h-[min(52vh,480px)] bg-gradient-to-b from-[#fef9f1]/92 via-[#fef9f1]/55 to-transparent lg:block"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-16 pt-24 sm:gap-10 sm:pb-14 sm:pt-28 lg:h-full lg:min-h-[100svh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="text-center lg:text-left">
            <div className="relative z-[1] mb-4 inline-flex max-w-full flex-col items-center gap-1 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs text-white shadow-lg backdrop-blur-md sm:mb-6 sm:px-6 sm:py-3 sm:text-sm lg:items-start">
              <span className="font-medium tracking-wide">Pakistan&apos;s first wedding planning platform</span>
            </div>

            <h1 className="relative z-[1] mb-4 font-serif text-[1.85rem] font-semibold leading-[1.15] text-white animate-fadeIn xs:text-[2.15rem] sm:mb-5 sm:text-5xl md:text-6xl lg:text-[4.1rem]">
              Plan Your Dream Wedding
              <span className="mt-2 block font-sans text-sm font-medium uppercase tracking-[0.16em] text-white/85 sm:mt-3 sm:text-base sm:tracking-[0.22em] sm:text-lg">
                Elegance. Simplicity. Complete Control.
              </span>
            </h1>
            <p className="mx-auto mb-6 max-w-xl font-sans text-sm font-medium leading-relaxed text-white/90 animate-slideUp sm:mb-8 sm:text-base md:text-xl lg:mx-0 lg:max-w-xl lg:text-lg">
              Discover venues, compare options, and plan your wedding effortlessly with Wedify.
            </p>
            
            {weddingDate && (
              <div className="mb-6 animate-fadeIn sm:mb-8 lg:max-w-md">
                <CountdownTimer />
              </div>
            )}
            
            <div className="flex w-full flex-col gap-3 animate-slideUp sm:flex-row sm:gap-4 lg:justify-start">
              <Link 
                href="/marquees"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gold-500 px-6 py-3.5 font-semibold text-white shadow-xl shadow-gold-200/50 transition-all hover:bg-gold-600 group sm:w-auto sm:px-8 sm:py-4 sm:hover:scale-105"
              >
                Explore Marquees
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/calculator"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/70 bg-white/85 px-6 py-3.5 font-semibold text-[#2b1f1a] shadow-md backdrop-blur-sm transition-all hover:bg-white sm:w-auto sm:px-8 sm:py-4"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Budget Calculator
              </Link>
            </div>
            
            {!weddingDate && (
              <button
                onClick={() => setShowDateModal(true)}
                className="mt-5 inline-flex items-center gap-2 px-1 py-2 text-sm text-white/90 transition-colors hover:text-white sm:mt-6 sm:text-base"
              >
                <Calendar className="h-5 w-5" />
                Set Your Wedding Date
              </button>
            )}
          </div>

          <div className="relative hidden h-[68vh] min-h-[420px] w-full lg:block">
            <div className="grid h-full grid-cols-2 gap-5 pt-6">
              <div className="relative overflow-hidden rounded-[1.7rem] border-4 border-white/80 shadow-[0_18px_45px_rgba(43,31,26,0.2)]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url('${heroImages[0] || heroImage}')` }} />
              </div>
              <div className="relative mt-10 overflow-hidden rounded-[1.7rem] border-4 border-white/75 shadow-[0_18px_42px_rgba(43,31,26,0.2)]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url('${heroImages[1] || heroImage}')` }} />
              </div>
              <div className="relative -mt-3 overflow-hidden rounded-[1.7rem] border-4 border-white/75 shadow-[0_18px_42px_rgba(43,31,26,0.2)]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url('${heroImages[2] || heroImage}')` }} />
              </div>
              <div className="relative mt-7 overflow-hidden rounded-[1.7rem] border-4 border-white/80 shadow-[0_18px_45px_rgba(43,31,26,0.2)]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url('${heroImages[3] || heroImage}')` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 animate-bounce pointer-events-none sm:block">
          <svg className="w-6 h-6 text-white/70 lg:text-[#6b5a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-16 bg-burgundy-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gold-400 mb-1 sm:mb-2">{marquees.length}</h3>
              <p className="text-white/80 text-xs sm:text-base">Premium Marquees</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gold-400 mb-1 sm:mb-2">{areas.length}+</h3>
              <p className="text-white/80 text-xs sm:text-base">Lahore Areas</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gold-400 mb-1 sm:mb-2">1.8K–12K</h3>
              <p className="text-white/80 text-xs sm:text-base">Per Head (PKR)</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gold-400 mb-1 sm:mb-2">
                {(marquees.reduce((sum, m) => sum + m.rating, 0) / marquees.length).toFixed(1)}★
              </h3>
              <p className="text-white/80 text-xs sm:text-base">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Marquees */}
      <section className="section-blush py-12 sm:py-20">
        <div className="relative z-[1] max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800 mb-3 sm:mb-4">
              Featured <span className="text-gold-600">Venues</span>
            </h2>
            <p className="text-burgundy-800/70 max-w-2xl mx-auto text-sm sm:text-base">
              Handpicked selection of Lahore&apos;s most prestigious wedding destinations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {featuredMarquees.slice(0, 6).map((marquee, index) => (
              <div key={marquee.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <MarqueeCard marquee={marquee} />
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link 
              href="/marquees"
              className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold rounded-lg transition-all group shadow-lg shadow-burgundy-900/15"
            >
              View All Venues
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Area */}
      <section className="section-cream py-12 sm:py-16">
        <div className="relative z-[1] max-w-7xl mx-auto px-4">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 mb-2 sm:mb-3">Browse by <span className="text-gold-600">Location</span></h2>
            <p className="text-burgundy-800/70 text-sm sm:text-base">Find the perfect venue in your preferred area</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {areas.map((area) => (
              <Link 
                key={area}
                href={`/marquees?area=${encodeURIComponent(area)}`}
                className="theme-chip"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2 text-burgundy-500" />
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Vendor Categories */}
      <section className="section-rose py-20">
        <div className="relative z-[1] max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-800 mb-4">
              Wedding <span className="text-gold-600">Services</span>
            </h2>
            <p className="text-burgundy-800/70 max-w-2xl mx-auto">
              Connect with verified vendors to make your wedding perfect
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {vendorCategories.slice(0, 8).map((category) => {
              const categoryImages = {
                photography: realVenuePhotos[1],
                decoration: realVenuePhotos[3],
                catering: realVenuePhotos[5],
                makeup: realVenuePhotos[6],
                entertainment: realVenuePhotos[9],
                venue: realVenuePhotos[0],
                invitations: '/images/categories/invitations.png',
                jewelry: realVenuePhotos[2],
                mehndi: realVenuePhotos[4],
              };
              const imageUrl = categoryImages[category.id] || categoryImages.venue;
              
              return (
                <Link 
                  key={category.id}
                  href={`/vendors?category=${category.id}`}
                  className="theme-card p-3 sm:p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(103,41,63,0.12)] group"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full mx-auto mb-2 sm:mb-4 overflow-hidden ring-2 ring-gold-200 group-hover:ring-gold-400 transition-all bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = categoryImages.venue;
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-gold-600 transition-colors leading-snug">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-burgundy-700/60 mt-1">Vendors</p>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link 
              href="/vendors"
              className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium"
            >
              Browse All Vendors <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-cream py-20">
        <div className="relative z-[1] max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
              How It <span className="text-gold-600">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-100 to-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-md shadow-gold-200/40">
                <span className="text-3xl font-serif text-gold-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Browse Venues</h3>
              <p className="text-burgundy-800/65">Explore our curated list of Lahore's finest marquees with detailed information.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gold-300 to-burgundy-200"></div>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-100 to-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-md shadow-gold-200/40">
                <span className="text-3xl font-serif text-gold-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Compare & Save</h3>
              <p className="text-burgundy-800/65">Add venues to favorites, compare options side by side.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gold-300 to-burgundy-200"></div>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-100 to-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-md shadow-gold-200/40">
                <span className="text-3xl font-serif text-gold-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Calculate Budget</h3>
              <p className="text-burgundy-800/65">Use our smart calculator to estimate costs for every aspect.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gold-300 to-burgundy-200"></div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-100 to-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-gold-200/40">
                <span className="text-3xl font-serif text-gold-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Book & Celebrate</h3>
              <p className="text-burgundy-800/65">Contact venues directly and plan your perfect celebration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-blush py-20">
        <div className="relative z-[1] max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-800 mb-4">
              Real <span className="text-gold-600">Love Stories</span>
            </h2>
            <p className="text-burgundy-800/70 max-w-2xl mx-auto">
              Hear from couples who planned their perfect day with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link 
              href="/testimonials"
              className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium"
            >
              Read More Stories <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewedVenues.length > 0 && (
        <section className="section-cream py-12">
          <div className="relative z-[1] max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-gray-800">Recently Viewed</h2>
              <Link href="/marquees" className="text-gold-600 hover:text-gold-700 text-sm font-medium flex items-center">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewedVenues.map((venue) => (
                <Link key={venue.slug} href={`/marquees/${venue.slug}`} className="group">
                  <div className="theme-card overflow-hidden transition-all hover:shadow-[0_16px_36px_rgba(103,41,63,0.12)]">
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={venue.image} 
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 group-hover:text-gold-600 transition-colors truncate">{venue.name}</h3>
                      <p className="text-sm text-burgundy-700/60">{formatPrice(venue.pricing.perHead.min)}+ /head</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planning Tools */}
      <section className="section-rose py-16">
        <div className="relative z-[1] max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-gray-800 mb-3">Planning <span className="text-burgundy-600">Tools</span></h2>
            <p className="text-burgundy-800/70">Everything you need to plan your perfect wedding</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/calculator" className="theme-card p-8 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(103,41,63,0.12)] group">
              <Calculator className="w-12 h-12 text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Budget Calculator</h3>
              <p className="text-burgundy-800/65 text-sm">Calculate detailed costs for venue, catering, decor, and more.</p>
            </Link>
            <Link href="/compare" className="theme-card p-8 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(103,41,63,0.12)] group">
              <svg className="w-12 h-12 text-burgundy-500 mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Venue Comparison</h3>
              <p className="text-burgundy-800/65 text-sm">Compare venues side by side to find your perfect match.</p>
            </Link>
            <Link href="/checklist" className="theme-card p-8 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(103,41,63,0.12)] group">
              <CheckCircle className="w-12 h-12 text-gold-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Wedding Checklist</h3>
              <p className="text-burgundy-800/65 text-sm">Stay organized with our comprehensive planning checklist.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 gradient-burgundy">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 sm:mb-6">
            Ready to Plan Your Wedding?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8">
            Start calculating your budget and find the perfect venue for your special day
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              href="/calculator"
              className="inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-lg transition-all sm:hover:scale-105 shadow-xl text-base sm:text-lg"
            >
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Start Budget Calculator
            </Link>
            <button
              onClick={() => setShowDateModal(true)}
              className="inline-flex items-center justify-center px-6 sm:px-10 py-4 sm:py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/30 text-base sm:text-lg"
            >
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Set Wedding Date
            </button>
          </div>
        </div>
      </section>

      {/* Wedding Date Modal */}
      {showDateModal && (
        <WeddingDateModal onClose={() => setShowDateModal(false)} />
      )}

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const [marqueesRes, vendorsRes, testimonialsRes, extras] = await Promise.all([
    fetchMarquees(),
    fetchVendors(),
    fetchTestimonials(),
    fetchLivePriceExtras(),
  ]);

  return {
    props: {
      marquees: marqueesRes.items,
      featuredMarquees: pickFeaturedMarquees(marqueesRes.items),
      featuredVendors: pickFeaturedVendors(vendorsRes.items).slice(0, 6),
      featuredTestimonials: pickFeaturedTestimonials(testimonialsRes.items).slice(0, 3),
      vendorCategories: getVendorCategories(),
      areas: areasFromMarquees(marqueesRes.items),
      realVenuePhotos: extras.realVenuePhotos || localPhotos,
      dataSource: marqueesRes.source,
    },
  };
}
