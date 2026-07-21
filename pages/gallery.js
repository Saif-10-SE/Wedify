import Head from 'next/head';
import { useState } from 'react';
import { realVenuePhotos as localPhotos } from '@/data/marquees';
import { fetchMarquees, fetchLivePriceExtras } from '@/lib/catalogService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import { Camera, Filter, Grid, LayoutGrid } from 'lucide-react';

export default function Gallery({
  marquees = [],
  realVenuePhotos = localPhotos,
  dataSource = 'local',
}) {
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Collect all images
  const getAllImages = () => {
    if (selectedVenue === 'all') {
      return marquees.flatMap(m => 
        (m.gallery || []).map(img => ({ 
          url: img, 
          venue: m.name, 
          slug: m.slug 
        }))
      );
    }
    const venue = marquees.find(m => m.slug === selectedVenue);
    return venue ? (venue.gallery || []).map(img => ({ 
      url: img, 
      venue: venue.name, 
      slug: venue.slug 
    })) : [];
  };

  const images = getAllImages();
  const imageUrls = images.map(img => img.url);

  // Featured gallery images
  const featuredImages = realVenuePhotos.slice(0, 12);

  return (
    <>
      <Head>
        <title>Wedding Gallery | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Browse stunning wedding photos from Lahore's finest venues. Get inspired for your dream wedding." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-burgundy-800 to-burgundy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm mb-6">
            <Camera className="w-4 h-4" />
            <span>Real Wedding Photos</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            Wedding <span className="text-gold-400">Gallery</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Get inspired by real weddings at Lahore's most prestigious venues. 
            Browse stunning photos and envision your dream celebration.
          </p>
        </div>
      </section>

      {/* Gallery Categories */}
      <section className="py-12 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Venue Filter */}
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="all">All Venues</option>
                {marquees.map(m => (
                  <option key={m.slug} value={m.slug}>{m.name}</option>
                ))}
              </select>
              <span className="text-gray-500 text-sm">{imageUrls.length} photos</span>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-gold-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'masonry' ? 'bg-white shadow text-gold-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {selectedVenue === 'all' ? (
            <>
              {/* Featured Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-gray-800 mb-6">
                  Featured <span className="text-gold-600">Moments</span>
                </h2>
                <ImageGallery images={featuredImages} title="Featured Wedding Photos" />
              </div>

              {/* By Venue Sections */}
              {marquees.filter(m => m.gallery.length > 0).map(venue => (
                <div key={venue.slug} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif text-gray-800">
                      {venue.name}
                    </h2>
                    <span className="text-sm text-gray-500">{venue.gallery.length} photos</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {venue.gallery.map((img, index) => (
                      <div 
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
                        onClick={() => setSelectedVenue(venue.slug)}
                      >
                        <img
                          src={img}
                          alt={`${venue.name} photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                            View All
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <ImageGallery images={imageUrls} title={marquees.find(m => m.slug === selectedVenue)?.name} />
          )}
        </div>
      </section>

      {/* Wedding Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif text-gray-800 mb-8 text-center">
            Browse by <span className="text-gold-600">Event Type</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Mehndi', image: realVenuePhotos[5], count: 45 },
              { name: 'Barat', image: realVenuePhotos[0], count: 62 },
              { name: 'Walima', image: realVenuePhotos[2], count: 38 },
              { name: 'Engagement', image: realVenuePhotos[7], count: 24 }
            ].map((category) => (
              <div 
                key={category.name}
                className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-serif text-white">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count} photos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-burgundy-700 to-burgundy-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Want Your Wedding Featured?
          </h2>
          <p className="text-white/80 mb-8">
            Share your beautiful wedding moments with us and inspire other couples
          </p>
          <a 
            href="mailto:gallery@lahoreeliteweddings.pk"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-all"
          >
            <Camera className="w-5 h-5" />
            Submit Your Photos
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const [{ items, source }, extras] = await Promise.all([
    fetchMarquees(),
    fetchLivePriceExtras(),
  ]);
  return {
    props: {
      marquees: items,
      realVenuePhotos: extras.realVenuePhotos || localPhotos,
      dataSource: source,
    },
  };
}
