import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { marquees, formatPrice } from '@/data/marquees';
import { getTestimonialsByVenue, getVenueAverageRating } from '@/data/testimonials';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import CompareButton from '@/components/CompareButton';
import ImageGallery from '@/components/ImageGallery';
import InquiryForm from '@/components/InquiryForm';
import { useWedding } from '@/context/WeddingContext';
import { Share2, MapPin, Phone, Mail, Calendar, Users, Star, Clock, ChevronRight, ExternalLink, Check, Play, Maximize2, Copy, CheckCircle } from 'lucide-react';

export default function MarqueeDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToRecentlyViewed, recentlyViewed, showNotification } = useWedding();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showGallery, setShowGallery] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const marquee = marquees.find(m => m.slug === slug);
  const venueTestimonials = marquee ? getTestimonialsByVenue(marquee.name) : [];
  const avgRating = marquee ? getVenueAverageRating(marquee.name) : marquee?.rating;
  
  // Get related venues
  const relatedVenues = marquees.filter(m => 
    m.slug !== slug && m.location === marquee?.location
  ).slice(0, 3);
  
  // Recently viewed (excluding current)
  const recentlyViewedVenues = recentlyViewed
    .filter(s => s !== slug)
    .slice(0, 4)
    .map(s => marquees.find(m => m.slug === s))
    .filter(Boolean);

  useEffect(() => {
    if (slug && marquee) {
      addToRecentlyViewed(slug);
    }
  }, [slug, marquee]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: marquee.name,
          text: `Check out ${marquee.name} for your wedding!`,
          url
        });
      } catch (err) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showNotification('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!marquee) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center animate-fadeIn">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Venue not found</h1>
            <p className="text-gray-600 mb-6">The venue you're looking for doesn't exist or has been removed.</p>
            <Link href="/marquees" className="inline-flex items-center px-6 py-3 bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-colors">
              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
              Back to all venues
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const galleryImages = marquee.gallery?.length
    ? marquee.gallery
    : [marquee.image];

  return (
    <>
      <Head>
        <title>{marquee.name} | Lahore Elite Weddings</title>
        <meta name="description" content={marquee.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${marquee.name} | Lahore Elite Weddings`} />
        <meta property="og:description" content={marquee.description} />
        <meta property="og:image" content={marquee.image} />
      </Head>

      <Navbar />

      {/* Breadcrumbs */}
      <div className="pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/marquees" className="hover:text-gold-600 transition-colors">Venues</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-800 font-medium">{marquee.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[500px] rounded-2xl overflow-hidden">
            {/* Main Image */}
            <div 
              className="col-span-2 row-span-2 relative group cursor-pointer"
              onClick={() => setShowGallery(true)}
            >
              <img 
                src={marquee.image}
                alt={marquee.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {/* Secondary Images */}
            {galleryImages.slice(1, 5).map((img, idx) => (
              <div 
                key={idx} 
                className="relative group cursor-pointer"
                onClick={() => setShowGallery(true)}
              >
                <img 
                  src={img}
                  alt={`${marquee.name} gallery ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                {idx === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">+{galleryImages.length - 5} photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Venue Header */}
          <div className="flex flex-wrap items-start justify-between mt-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {marquee.featured && (
                  <span className="px-3 py-1 bg-gold-500 text-white text-sm font-semibold rounded-full animate-pulse">
                    ⭐ Featured Venue
                  </span>
                )}
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Verified
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-2">{marquee.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gold-500" />
                  {marquee.location}
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-gold-500 fill-gold-500" />
                  {avgRating || marquee.rating} ({marquee.reviews + venueTestimonials.length} reviews)
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gold-500" />
                  {marquee.capacity.min} - {marquee.capacity.max} guests
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <FavoriteButton slug={marquee.slug} size="lg" showLabel />
              <CompareButton slug={marquee.slug} size="lg" showLabel />
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-20 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {['overview', 'packages', 'amenities', 'reviews', 'location'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-gold-500 text-gold-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div id="overview" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-32">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">About This Venue</h2>
                <p className="text-gray-600 leading-relaxed">{marquee.description}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center p-4 bg-gold-50 rounded-xl">
                    <p className="text-2xl font-bold text-gold-600">{marquee.capacity.min}-{marquee.capacity.max}</p>
                    <p className="text-sm text-gray-600">Guest Capacity</p>
                  </div>
                  <div className="text-center p-4 bg-burgundy-50 rounded-xl">
                    <p className="text-2xl font-bold text-burgundy-600">{formatPrice(marquee.pricing.perHead.min)}+</p>
                    <p className="text-sm text-gray-600">Per Head</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">{marquee.rating}★</p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">{marquee.reviews}</p>
                    <p className="text-sm text-gray-600">Reviews</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div id="amenities" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-32">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">Amenities & Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {marquee.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors group">
                      <Check className="w-5 h-5 text-gold-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Packages */}
              <div id="packages" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-32">
                <h2 className="text-2xl font-serif text-gray-800 mb-6">Menu Packages</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {marquee.menuPackages.map((pkg, index) => (
                    <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:border-gold-300 hover:shadow-lg transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gold-600 transition-colors">{pkg.name}</h3>
                        <span className="text-xl font-bold text-gold-600">{formatPrice(pkg.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Per Head</p>
                      <ul className="space-y-2">
                        {pkg.items.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decor Packages */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-gray-800 mb-6">Decor Packages</h2>
                <div className="space-y-4">
                  {marquee.decorPackages.map((pkg, index) => (
                    <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:border-burgundy-300 hover:shadow-lg transition-all group">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-burgundy-600 transition-colors">{pkg.name} Package</h3>
                        <span className="text-xl font-bold text-burgundy-600">{formatPrice(pkg.price)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pkg.includes.map((item, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full group-hover:bg-burgundy-50 transition-colors">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div id="reviews" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif text-gray-800">Reviews</h2>
                  <Link href="/testimonials" className="text-gold-600 hover:text-gold-700 text-sm font-medium flex items-center">
                    View all reviews <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {venueTestimonials.length > 0 ? (
                  <div className="space-y-6">
                    {venueTestimonials.slice(0, 3).map((testimonial, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-burgundy-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {testimonial.couple.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{testimonial.couple}</p>
                              <p className="text-sm text-gray-500">{testimonial.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < testimonial.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 italic">"{testimonial.review}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No reviews yet for this venue</p>
                    <p className="text-sm">Be the first to leave a review!</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div id="location" className="bg-white rounded-2xl p-8 shadow-sm scroll-mt-32">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">Location</h2>
                <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center mb-4 overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(marquee.name + ', ' + marquee.location)}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="rounded-xl"
                  ></iframe>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-gold-500" />
                  <span>{marquee.location}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(marquee.name + ', ' + marquee.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-gold-600 hover:text-gold-700 font-medium"
                >
                  Get Directions <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
                <h3 className="text-xl font-serif text-gray-800 mb-4">Quick Pricing</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Per Head (Starting)</span>
                    <span className="font-semibold text-gold-600">{formatPrice(marquee.pricing.perHead.min)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Per Head (Premium)</span>
                    <span className="font-semibold text-gold-600">{formatPrice(marquee.pricing.perHead.max)}</span>
                  </div>
                  {marquee.pricing.hallRental > 0 && (
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Hall Rental</span>
                      <span className="font-semibold">{formatPrice(marquee.pricing.hallRental)}</span>
                    </div>
                  )}
                  {marquee.pricing.lawn > 0 && (
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Lawn Rental</span>
                      <span className="font-semibold">{formatPrice(marquee.pricing.lawn)}</span>
                    </div>
                  )}
                </div>

                {marquee.priceMeta?.lastUpdated && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-800 font-medium">
                      Price feed updated: {new Date(marquee.priceMeta.lastUpdated).toLocaleDateString('en-PK')}
                    </p>
                    {marquee.priceMeta?.source && (
                      <a
                        href={marquee.priceMeta.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-700 hover:text-blue-900 underline"
                      >
                        Source listing
                      </a>
                    )}
                  </div>
                )}

                <Link 
                  href={`/calculator?venue=${marquee.slug}`}
                  className="block w-full mt-6 px-6 py-4 bg-gold-500 hover:bg-gold-600 text-white text-center font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Calculate Full Budget
                </Link>
                
                <button
                  onClick={() => setShowInquiry(true)}
                  className="block w-full mt-3 px-6 py-4 bg-burgundy-700 hover:bg-burgundy-800 text-white text-center font-semibold rounded-xl transition-all"
                >
                  Send Inquiry
                </button>

                {/* Contact */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3">Contact Venue</h4>
                  <a 
                    href={`tel:${marquee.contact.phone}`}
                    className="flex items-center p-3 bg-green-50 rounded-lg mb-2 hover:bg-green-100 transition-colors group"
                  >
                    <Phone className="w-5 h-5 text-green-600 mr-3 group-hover:animate-bounce" />
                    <span className="text-green-700">{marquee.contact.phone}</span>
                  </a>
                  <a 
                    href={`mailto:${marquee.contact.email}`}
                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-blue-700 text-sm">{marquee.contact.email}</span>
                  </a>
                </div>
                
                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-3">
                  <Link 
                    href="/compare"
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    <svg className="w-6 h-6 text-gray-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs text-gray-600">Compare</span>
                  </Link>
                  <Link 
                    href="/checklist"
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    <svg className="w-6 h-6 text-gray-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="text-xs text-gray-600">Checklist</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Venues */}
          {relatedVenues.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-serif text-gray-800 mb-6">Similar Venues in {marquee.location}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedVenues.map((venue) => (
                  <Link key={venue.slug} href={`/marquees/${venue.slug}`} className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={venue.image} 
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-gold-600 transition-colors">{venue.name}</h3>
                        <p className="text-sm text-gray-500">{formatPrice(venue.pricing.perHead.min)}+ per head</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Recently Viewed */}
          {recentlyViewedVenues.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-serif text-gray-800 mb-6">Recently Viewed</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentlyViewedVenues.map((venue) => (
                  <Link key={venue.slug} href={`/marquees/${venue.slug}`} className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={venue.image} 
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm text-gray-800 group-hover:text-gold-600 transition-colors truncate">{venue.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery 
          images={galleryImages}
          onClose={() => setShowGallery(false)}
          initialIndex={0}
        />
      )}

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-serif text-gray-800">Send Inquiry to {marquee.name}</h2>
              <button 
                onClick={() => setShowInquiry(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <InquiryForm venue={marquee} onClose={() => setShowInquiry(false)} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
