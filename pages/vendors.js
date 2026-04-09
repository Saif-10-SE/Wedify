import Head from 'next/head';
import { useMemo, useState } from 'react';
import { getAllVendors, getFeaturedVendors, getVendorCategories } from '@/data/vendors';
import { formatPrice } from '@/data/marquees';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VendorCard from '@/components/VendorCard';
import { Star, Search, Filter, Grid, List } from 'lucide-react';

export default function Vendors() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  const allVendors = useMemo(() => getAllVendors(), []);
  const categories = getVendorCategories();
  const featuredVendors = getFeaturedVendors();
  const locations = useMemo(() => {
    return [...new Set(
      allVendors
        .map(vendor => vendor.area || vendor.location)
        .filter(Boolean)
    )];
  }, [allVendors]);

  const filteredVendors = allVendors
    .filter(vendor => {
      const matchesCategory = selectedCategory === 'all' || 
        vendor.type.toLowerCase() === selectedCategory.toLowerCase();
      const matchesLocation = selectedLocation === 'all' ||
        vendor.area === selectedLocation ||
        vendor.location === selectedLocation;
      const matchesSearch = searchQuery === '' ||
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (vendor.location && vendor.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (vendor.area && vendor.area.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesLocation && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'price-low') return a.priceRange.min - b.priceRange.min;
      if (sortBy === 'price-high') return b.priceRange.min - a.priceRange.min;
      return 0;
    });

  return (
    <>
      <Head>
        <title>Wedding Vendors | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Find the best wedding vendors in Lahore - photographers, decorators, caterers, makeup artists and more." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-burgundy-800 to-burgundy-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            Wedding <span className="text-gold-400">Vendors</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Discover Lahore's best wedding professionals. From photographers to caterers, find the perfect team for your special day.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors by name, service, or location..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gold-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Vendors
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gold-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      {selectedCategory === 'all' && selectedLocation === 'all' && searchQuery === '' && (
        <section className="py-12 bg-gold-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-gray-800">
                <Star className="inline w-6 h-6 text-gold-500 mr-2" />
                Top Rated Vendors
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVendors.slice(0, 4).map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-4 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <span className="text-gray-500">{filteredVendors.length} vendors found</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-gold-600' : 'text-gray-500'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-gold-600' : 'text-gray-500'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVendors.map(vendor => (
                <div key={vendor.id} className="bg-white rounded-xl shadow-sm p-6 flex gap-6 hover:shadow-md transition-shadow">
                  <img 
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
                        <p className="text-sm text-gray-500">{vendor.type}</p>
                        {vendor.location && <p className="text-xs text-gray-400 mt-1">{vendor.location}</p>}
                      </div>
                      <div className="flex items-center gap-1 text-gold-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-semibold">{vendor.rating}</span>
                        <span className="text-gray-400">({vendor.reviews})</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{vendor.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {vendor.services.slice(0, 4).map((service, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-gold-600 font-bold">
                        Starting from {formatPrice(vendor.priceRange.min)}
                        {vendor.priceType && <span className="text-xs font-normal text-gray-500">/{vendor.priceType}</span>}
                      </p>
                      <a 
                        href={`tel:${vendor.contact.phone}`}
                        className="px-4 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredVendors.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-2">No vendors found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-burgundy-700 to-burgundy-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Are You a Wedding Vendor?
          </h2>
          <p className="text-white/80 mb-8">
            Join Lahore Elite Weddings and connect with thousands of couples planning their dream wedding.
          </p>
          <a 
            href="mailto:vendors@lahoreeliteweddings.pk"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-all"
          >
            List Your Business
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
