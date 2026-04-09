import Head from 'next/head';
import { useState, useMemo } from 'react';
import { marquees, formatPrice } from '@/data/marquees';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Compare() {
  const [selectedVenues, setSelectedVenues] = useState(['royal-palm', 'pc-marquee', 'falettis']);

  const handleVenueChange = (index, value) => {
    const newSelection = [...selectedVenues];
    newSelection[index] = value;
    setSelectedVenues(newSelection);
  };

  const compareVenues = useMemo(() => {
    return selectedVenues.map(slug => marquees.find(m => m.slug === slug)).filter(Boolean);
  }, [selectedVenues]);

  return (
    <>
      <Head>
        <title>Compare Venues | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-burgundy-800 to-burgundy-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Compare <span className="text-gold-400">Venues</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Side-by-side comparison of Lahore's top marquees to help you make the perfect choice
          </p>
        </div>
      </section>

      {/* Venue Selectors */}
      <section className="py-8 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <select
                key={index}
                value={selectedVenues[index] || ''}
                onChange={(e) => handleVenueChange(index, e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent font-medium"
              >
                <option value="">Select Venue {index + 1}</option>
                {marquees.map(m => (
                  <option key={m.slug} value={m.slug}>{m.name}</option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {compareVenues.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Images Row */}
              <div className="grid grid-cols-3">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-48 object-cover"
                    />
                    {venue.featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Venue Names */}
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-6 text-center border-r last:border-r-0">
                    <h3 className="text-xl font-serif font-semibold text-gray-800">{venue.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{venue.location}</p>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Rating & Reviews</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 text-center border-r last:border-r-0">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-gold-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xl font-bold text-gray-800">{venue.rating}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">({venue.reviews} reviews)</p>
                  </div>
                ))}
              </div>

              {/* Capacity */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Guest Capacity</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 text-center border-r last:border-r-0">
                    <p className="text-lg font-semibold text-gray-800">
                      {venue.capacity.min} - {venue.capacity.max}
                    </p>
                    <p className="text-sm text-gray-500">guests</p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Pricing (Per Head)</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 text-center border-r last:border-r-0">
                    <p className="text-lg font-bold text-gold-600">
                      {formatPrice(venue.pricing.perHead.min)} - {formatPrice(venue.pricing.perHead.max)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hall Rental */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Hall Rental</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 text-center border-r last:border-r-0">
                    <p className="text-lg font-semibold text-gray-800">
                      {venue.pricing.hallRental > 0 ? formatPrice(venue.pricing.hallRental) : 'Included'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Menu Packages */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Menu Packages</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 border-r last:border-r-0">
                    <ul className="space-y-2">
                      {venue.menuPackages.map((pkg, i) => (
                        <li key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{pkg.name}</span>
                          <span className="font-medium text-gray-800">{formatPrice(pkg.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Decor Packages */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Decor Packages</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 border-r last:border-r-0">
                    <ul className="space-y-2">
                      {venue.decorPackages.map((pkg, i) => (
                        <li key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{pkg.name}</span>
                          <span className="font-medium text-gray-800">{formatPrice(pkg.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Amenities</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 border-r last:border-r-0">
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.map((amenity, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="grid grid-cols-3 border-b bg-gray-50">
                <div className="col-span-3 px-6 py-2 bg-gray-100 font-semibold text-gray-700">Contact</div>
              </div>
              <div className="grid grid-cols-3 border-b">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-4 text-center border-r last:border-r-0">
                    <p className="text-sm text-gray-600">{venue.contact.phone}</p>
                    <p className="text-sm text-gray-500 truncate">{venue.contact.email}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3">
                {compareVenues.map((venue, index) => (
                  <div key={index} className="p-6 border-r last:border-r-0 space-y-3">
                    <Link 
                      href={`/marquees/${venue.slug}`}
                      className="block w-full py-3 bg-burgundy-700 hover:bg-burgundy-800 text-white text-center font-semibold rounded-xl transition-all"
                    >
                      View Details
                    </Link>
                    <Link 
                      href={`/calculator?venue=${venue.slug}`}
                      className="block w-full py-3 bg-gold-500 hover:bg-gold-600 text-white text-center font-semibold rounded-xl transition-all"
                    >
                      Calculate Budget
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select venues to compare</h3>
              <p className="text-gray-500">Use the dropdowns above to select up to 3 venues</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
