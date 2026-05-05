import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getFeaturedMarquees, formatPrice, getAreas, marquees, realVenuePhotos } from '@/data/marquees';
import { getFeaturedVendors, getVendorCategories } from '@/data/vendors';
import { getFeaturedTestimonials } from '@/data/testimonials';
import { useWedding } from '@/context/WeddingContext';
import Navbar from '@/components/Navbar';
import MarqueeCard from '@/components/MarqueeCard';
import TestimonialCard from '@/components/TestimonialCard';
import CountdownTimer from '@/components/CountdownTimer';
import WeddingDateModal from '@/components/WeddingDateModal';
import Footer from '@/components/Footer';
import { Heart, Calendar, Calculator, MapPin, Users, Star, ArrowRight, CheckCircle, Sparkles, Camera, ChevronRight } from 'lucide-react';

export default function Home() {
  const featuredMarquees = getFeaturedMarquees();
  const featuredVendors = getFeaturedVendors().slice(0, 6);
  const featuredTestimonials = getFeaturedTestimonials().slice(0, 3);
  const vendorCategories = getVendorCategories();
  const areas = getAreas();
  
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
        <title>Lahore Elite Weddings | Premium Marquee & Wedding Planner</title>
        <meta name="description" content="Discover Lahore's most prestigious marquees and calculate your perfect wedding budget. Premium venues, expert planning tools, and trusted vendors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Wedify | Pakistan's First Wedding Planning Platform" />
        <meta property="og:image" content={heroImage} />
      </Head>

      <Navbar />

      {/* Hero stack: bg → top haze → collage → copy (foremost) */}
      <section className="relative isolate h-screen flex items-center justify-center overflow-hidden bg-[#fef9f1]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: "url('/images/header-bg.jpg')" }}
          aria-hidden
        />

        {/* Soft top veil: pulls chroma down so the hero reads calm under the nav / headline */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[min(52vh,480px)] bg-gradient-to-b from-[#fef9f1]/92 via-[#fef9f1]/55 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-24 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="text-center lg:text-left">
            <div className="relative z-[1] mb-6 inline-flex flex-col items-center gap-1 rounded-full border border-white/35 bg-white/15 px-6 py-3 text-sm text-white shadow-lg backdrop-blur-md lg:items-start">
              <span className="font-medium tracking-wide">Pakistan's first wedding planning platform</span>
            </div>

            <h1 className="relative z-[1] mb-5 font-serif text-[2.15rem] font-semibold leading-[1.1] text-white animate-fadeIn sm:text-5xl md:text-6xl lg:text-[4.1rem]">
              Plan Your Dream Wedding
              <span className="mt-3 block font-sans text-base font-medium uppercase tracking-[0.22em] text-white/85 sm:text-lg">
                Elegance. Simplicity. Complete Control.
              </span>
            </h1>
            <p className="mb-8 max-w-2xl font-sans text-base font-medium leading-relaxed text-white/90 animate-slideUp sm:text-lg md:text-xl lg:max-w-xl">
              Discover venues, compare options, and plan your wedding effortlessly with Wedify.
            </p>
            
            {/* Wedding Date Countdown */}
            {weddingDate && (
              <div className="mb-8 animate-fadeIn lg:max-w-md">
                <CountdownTimer />
              </div>
            )}
            
            <div className="flex flex-col gap-4 animate-slideUp sm:flex-row lg:justify-start">
              <Link 
                href="/marquees"
                className="inline-flex items-center justify-center rounded-xl bg-gold-500 px-8 py-4 font-semibold text-white shadow-xl shadow-gold-200/50 transition-all hover:scale-105 hover:bg-gold-600 group"
              >
                Explore Marquees
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/calculator"
                className="inline-flex items-center justify-center rounded-xl border border-white/70 bg-white/70 px-8 py-4 font-semibold text-[#2b1f1a] shadow-md backdrop-blur-sm transition-all hover:bg-white/85"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Budget Calculator
              </Link>
            </div>
            
            {!weddingDate && (
              <button
                onClick={() => setShowDateModal(true)}
                className="mt-6 inline-flex items-center gap-2 px-1 py-2 text-white/85 transition-colors hover:text-white"
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 z-20 transform -translate-x-1/2 animate-bounce pointer-events-none">
          <svg className="w-6 h-6 text-[#6b5a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Quick Access Bar */}
      <section className="py-4 bg-white border-b shadow-sm sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
            <div className="flex items-center gap-6">
              <Link href="/marquees" className="flex items-center gap-2 text-gray-600 hover:text-gold-600 whitespace-nowrap transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Venues</span>
              </Link>
              <Link href="/vendors" className="flex items-center gap-2 text-gray-600 hover:text-gold-600 whitespace-nowrap transition-colors">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Vendors</span>
              </Link>
              <Link href="/gallery" className="flex items-center gap-2 text-gray-600 hover:text-gold-600 whitespace-nowrap transition-colors">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Gallery</span>
              </Link>
              <Link href="/checklist" className="flex items-center gap-2 text-gray-600 hover:text-gold-600 whitespace-nowrap transition-colors">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Checklist</span>
              </Link>
            </div>
            {favorites.length > 0 && (
              <Link href="/favorites" className="flex items-center gap-2 text-burgundy-600 whitespace-nowrap">
                <Heart className="w-4 h-4 fill-burgundy-600" />
                <span className="text-sm font-medium">{favorites.length} Saved</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-burgundy-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-4xl md:text-5xl font-serif text-gold-400 mb-2">10+</h3>
              <p className="text-white/80">Premium Marquees</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-4xl md:text-5xl font-serif text-gold-400 mb-2">500+</h3>
              <p className="text-white/80">Happy Weddings</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-4xl md:text-5xl font-serif text-gold-400 mb-2">50L+</h3>
              <p className="text-white/80">Budget Range</p>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-4xl md:text-5xl font-serif text-gold-400 mb-2">4.8★</h3>
              <p className="text-white/80">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Marquees */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
              Featured <span className="text-gold-600">Venues</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of Lahore's most prestigious wedding destinations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMarquees.slice(0, 6).map((marquee, index) => (
              <div key={marquee.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <MarqueeCard marquee={marquee} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/marquees"
              className="inline-flex items-center px-8 py-4 bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold rounded-lg transition-all group"
            >
              View All Venues
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Area */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-gray-800 mb-3">Browse by <span className="text-gold-600">Location</span></h2>
            <p className="text-gray-600">Find the perfect venue in your preferred area</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {areas.map((area) => (
              <Link 
                key={area}
                href={`/marquees?area=${encodeURIComponent(area)}`}
                className="px-6 py-3 bg-gray-100 hover:bg-gold-100 text-gray-700 hover:text-gold-700 rounded-full transition-colors font-medium"
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Vendor Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-800 mb-4">
              Wedding <span className="text-gold-600">Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with verified vendors to make your wedding perfect
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {vendorCategories.slice(0, 8).map((category) => {
              const categoryImages = {
                photography: realVenuePhotos[1],
                decoration: realVenuePhotos[3],
                catering: realVenuePhotos[6],
                makeup: realVenuePhotos[7],
                entertainment: realVenuePhotos[11],
                venue: realVenuePhotos[0],
                invitations: realVenuePhotos[12],
                jewelry: realVenuePhotos[13],
                mehndi: realVenuePhotos[5]
              };
              const imageUrl = categoryImages[category.id] || categoryImages.venue;
              
              return (
                <Link 
                  key={category.id}
                  href={`/vendors?category=${category.id}`}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all group text-center"
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-gold-100 group-hover:ring-gold-300 transition-all">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-gold-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Vendors</p>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
              How It <span className="text-gold-600">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-3xl font-serif text-gold-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse Venues</h3>
              <p className="text-gray-600">Explore our curated list of Lahore's finest marquees with detailed information.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gold-200"></div>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-3xl font-serif text-gold-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Compare & Save</h3>
              <p className="text-gray-600">Add venues to favorites, compare options side by side.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gold-200"></div>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-3xl font-serif text-gold-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Calculate Budget</h3>
              <p className="text-gray-600">Use our smart calculator to estimate costs for every aspect.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gold-200"></div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-serif text-gold-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Book & Celebrate</h3>
              <p className="text-gray-600">Contact venues directly and plan your perfect celebration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-800 mb-4">
              Real <span className="text-gold-600">Love Stories</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-gray-800">Recently Viewed</h2>
              <Link href="/marquees" className="text-gold-600 hover:text-gold-700 text-sm font-medium flex items-center">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewedVenues.map((venue) => (
                <Link key={venue.slug} href={`/marquees/${venue.slug}`} className="group">
                  <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all">
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={venue.image} 
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 group-hover:text-gold-600 transition-colors truncate">{venue.name}</h3>
                      <p className="text-sm text-gray-500">{formatPrice(venue.pricing.perHead.min)}+ /head</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planning Tools */}
      <section className="py-16 bg-burgundy-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-gray-800 mb-3">Planning <span className="text-burgundy-600">Tools</span></h2>
            <p className="text-gray-600">Everything you need to plan your perfect wedding</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/calculator" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all group">
              <Calculator className="w-12 h-12 text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Budget Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate detailed costs for venue, catering, decor, and more.</p>
            </Link>
            <Link href="/compare" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all group">
              <svg className="w-12 h-12 text-burgundy-500 mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Venue Comparison</h3>
              <p className="text-gray-600 text-sm">Compare venues side by side to find your perfect match.</p>
            </Link>
            <Link href="/checklist" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all group">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Wedding Checklist</h3>
              <p className="text-gray-600 text-sm">Stay organized with our comprehensive planning checklist.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-burgundy">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Ready to Plan Your Wedding?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Start calculating your budget and find the perfect venue for your special day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/calculator"
              className="inline-flex items-center px-10 py-5 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-xl text-lg"
            >
              <Calculator className="w-6 h-6 mr-3" />
              Start Budget Calculator
            </Link>
            <button
              onClick={() => setShowDateModal(true)}
              className="inline-flex items-center px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/30 text-lg"
            >
              <Calendar className="w-6 h-6 mr-3" />
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
