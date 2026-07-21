import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { formatPrice } from '@/data/marquees';
import {
  fetchMarquees,
  fetchLivePriceExtras,
  marqueeBySlug,
} from '@/lib/catalogService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Camera, Music2, Car, Mail } from 'lucide-react';

export default function Calculator({
  marquees = [],
  additionalServices = {},
  dataSource = 'local',
}) {
  const router = useRouter();
  const { venue: venueSlug } = router.query;

  // Form State
  const [selectedVenue, setSelectedVenue] = useState('');
  const [guestCount, setGuestCount] = useState(500);
  const [selectedMenuPackage, setSelectedMenuPackage] = useState(0);
  const [selectedDecorPackage, setSelectedDecorPackage] = useState(0);
  const [selectedPhotoPackage, setSelectedPhotoPackage] = useState(1);
  const [selectedEntertainment, setSelectedEntertainment] = useState(1);
  const [selectedTransport, setSelectedTransport] = useState(1);
  const [selectedInvitations, setSelectedInvitations] = useState(1);
  const [includeHallRental, setIncludeHallRental] = useState(true);
  const [numberOfEvents, setNumberOfEvents] = useState(3); // Mehndi, Barat, Walima
  const [additionalBudget, setAdditionalBudget] = useState(0);

  // Set venue from URL
  useEffect(() => {
    if (venueSlug) {
      const venue = marqueeBySlug(marquees, venueSlug);
      if (venue) {
        setSelectedVenue(venue.slug);
      }
    }
  }, [venueSlug, marquees]);

  const currentVenue = useMemo(() => {
    return marquees.find(m => m.slug === selectedVenue) || marquees[0];
  }, [selectedVenue, marquees]);

  // Calculate totals
  const calculations = useMemo(() => {
    const venue = currentVenue;
    const menuPerHead = venue.menuPackages[selectedMenuPackage]?.price || 0;
    const decorCost = venue.decorPackages[selectedDecorPackage]?.price || 0;
    const photoCost = additionalServices.photography[selectedPhotoPackage]?.price || 0;
    const entertainmentCost = additionalServices.entertainment[selectedEntertainment]?.price || 0;
    const transportCost = additionalServices.transport[selectedTransport]?.price || 0;
    const invitationCost = additionalServices.invitations[selectedInvitations]?.price || 0;

    const menuTotal = menuPerHead * guestCount;
    const venueRental = includeHallRental ? (venue.pricing.hallRental * numberOfEvents) : 0;
    const decorTotal = decorCost * numberOfEvents;
    
    const subtotal = menuTotal + venueRental + decorTotal + photoCost + entertainmentCost + transportCost + invitationCost;
    const serviceTax = subtotal * 0.05; // 5% service tax
    const contingency = subtotal * 0.10; // 10% contingency
    const grandTotal = subtotal + serviceTax + contingency + parseInt(additionalBudget || 0);

    return {
      menuPerHead,
      menuTotal,
      venueRental,
      decorTotal,
      decorCost,
      photoCost,
      entertainmentCost,
      transportCost,
      invitationCost,
      subtotal,
      serviceTax,
      contingency,
      grandTotal,
      perGuest: Math.round(grandTotal / guestCount)
    };
  }, [currentVenue, selectedMenuPackage, selectedDecorPackage, selectedPhotoPackage, selectedEntertainment, selectedTransport, selectedInvitations, guestCount, includeHallRental, numberOfEvents, additionalBudget]);

  return (
    <>
      <Head>
        <title>Budget Calculator | Lahore Elite Weddings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-burgundy-800 to-burgundy-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Wedding <span className="text-gold-400">Budget Calculator</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Plan your dream wedding with our comprehensive calculator. Get accurate estimates for venues, catering, decor, and more.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Venue Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                  Select Venue
                </h2>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent text-lg"
                >
                  {marquees.map(m => (
                    <option key={m.slug} value={m.slug}>
                      {m.name} - {m.area} (from {formatPrice(m.pricing.perHead.min)}/head)
                    </option>
                  ))}
                </select>

                {currentVenue && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <img 
                        src={currentVenue.image} 
                        alt={currentVenue.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{currentVenue.name}</h3>
                        <p className="text-sm text-gray-500">{currentVenue.location}</p>
                        <p className="text-sm text-gold-600 mt-1">
                          Capacity: {currentVenue.capacity.min} - {currentVenue.capacity.max} guests
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Count */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
                  Guest Count & Events
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests: <span className="text-gold-600 font-bold text-lg">{guestCount}</span>
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="50"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-500"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>100</span>
                      <span>1000</span>
                      <span>2000</span>
                      <span>3000</span>
                      <span>4000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Events</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => setNumberOfEvents(num)}
                          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                            numberOfEvents === num 
                              ? 'bg-gold-500 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num} {num === 1 ? 'Event' : 'Events'}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Typical: Mehndi, Barat, Walima (3 events)
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hallRental"
                      checked={includeHallRental}
                      onChange={(e) => setIncludeHallRental(e.target.checked)}
                      className="w-5 h-5 text-gold-500 rounded focus:ring-gold-500"
                    />
                    <label htmlFor="hallRental" className="ml-3 text-gray-700">
                      Include Hall/Venue Rental ({formatPrice(currentVenue?.pricing?.hallRental || 0)} per event)
                    </label>
                  </div>
                </div>
              </div>

              {/* Menu Package */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
                  Menu Package
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentVenue?.menuPackages.map((pkg, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedMenuPackage(index)}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        selectedMenuPackage === index 
                          ? 'border-gold-500 bg-gold-50' 
                          : 'border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
                        <span className="text-lg font-bold text-gold-600">{formatPrice(pkg.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Per Head</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pkg.items.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                        {pkg.items.length > 3 && (
                          <li className="text-gold-600 text-xs">+{pkg.items.length - 3} more items</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decor Package */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</span>
                  Decor Package
                </h2>
                <div className="space-y-3">
                  {currentVenue?.decorPackages.map((pkg, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDecorPackage(index)}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        selectedDecorPackage === index 
                          ? 'border-burgundy-500 bg-burgundy-50' 
                          : 'border-gray-200 hover:border-burgundy-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{pkg.name} Package</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pkg.includes.slice(0, 4).map((item, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xl font-bold text-burgundy-600">{formatPrice(pkg.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">5</span>
                  Additional Services
                </h2>

                {/* Photography */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Camera className="w-4 h-4 text-gold-600" />Photography & Videography</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {additionalServices.photography.map((pkg, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedPhotoPackage(index)}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                          selectedPhotoPackage === index 
                            ? 'border-gold-500 bg-gold-50' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        <p className="font-semibold text-sm text-gray-800">{pkg.name}</p>
                        <p className="text-gold-600 font-bold mt-1">{formatPrice(pkg.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entertainment */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Music2 className="w-4 h-4 text-gold-600" />Entertainment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {additionalServices.entertainment.map((pkg, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedEntertainment(index)}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                          selectedEntertainment === index 
                            ? 'border-gold-500 bg-gold-50' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        <p className="font-semibold text-sm text-gray-800">{pkg.name}</p>
                        <p className="text-gold-600 font-bold mt-1">{formatPrice(pkg.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transport */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Car className="w-4 h-4 text-gold-600" />Bridal Transport</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {additionalServices.transport.map((pkg, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedTransport(index)}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                          selectedTransport === index 
                            ? 'border-gold-500 bg-gold-50' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        <p className="font-semibold text-sm text-gray-800">{pkg.name}</p>
                        <p className="text-gold-600 font-bold mt-1">{formatPrice(pkg.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invitations */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Mail className="w-4 h-4 text-gold-600" />Wedding Invitations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {additionalServices.invitations.map((pkg, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedInvitations(index)}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                          selectedInvitations === index 
                            ? 'border-gold-500 bg-gold-50' 
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        <p className="font-semibold text-sm text-gray-800">{pkg.name}</p>
                        <p className="text-gold-600 font-bold mt-1">{formatPrice(pkg.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Budget */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">6</span>
                  Additional Budget (Optional)
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Add extra budget for jewelry, outfits, honeymoon, or other expenses
                </p>
                <input
                  type="number"
                  value={additionalBudget}
                  onChange={(e) => setAdditionalBudget(e.target.value)}
                  placeholder="Enter additional amount in PKR"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Results Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-28">
                <h2 className="text-2xl font-serif text-gray-800 mb-6 text-center">
                  Budget <span className="text-gold-600">Summary</span>
                </h2>

                {/* Venue Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-800">{currentVenue?.name}</h3>
                  <p className="text-sm text-gray-500">{guestCount} guests × {numberOfEvents} events</p>
                </div>

                {/* Line Items */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Menu ({currentVenue?.menuPackages[selectedMenuPackage]?.name})</span>
                    <span className="font-medium">{formatPrice(calculations.menuTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Per head: {formatPrice(calculations.menuPerHead)} × {guestCount}
                    </span>
                  </div>
                  
                  {includeHallRental && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Venue Rental (×{numberOfEvents})</span>
                      <span className="font-medium">{formatPrice(calculations.venueRental)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Decor ({currentVenue?.decorPackages[selectedDecorPackage]?.name} ×{numberOfEvents})</span>
                    <span className="font-medium">{formatPrice(calculations.decorTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Photography</span>
                    <span className="font-medium">{formatPrice(calculations.photoCost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entertainment</span>
                    <span className="font-medium">{formatPrice(calculations.entertainmentCost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transport</span>
                    <span className="font-medium">{formatPrice(calculations.transportCost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Invitations</span>
                    <span className="font-medium">{formatPrice(calculations.invitationCost)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(calculations.subtotal)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Tax (5%)</span>
                    <span className="font-medium">{formatPrice(calculations.serviceTax)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Contingency (10%)</span>
                    <span className="font-medium">{formatPrice(calculations.contingency)}</span>
                  </div>

                  {parseInt(additionalBudget) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Additional Budget</span>
                      <span className="font-medium">{formatPrice(additionalBudget)}</span>
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 rounded-xl p-6 text-white mb-6">
                  <p className="text-sm text-white/80 mb-1">Estimated Total</p>
                  <p className="text-3xl font-bold">{formatPrice(calculations.grandTotal)}</p>
                  <p className="text-sm text-gold-300 mt-2">
                    ~{formatPrice(calculations.perGuest)} per guest
                  </p>
                </div>

                {/* Budget Breakdown */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Budget Breakdown</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Food & Beverage</span>
                        <span>{Math.round((calculations.menuTotal / calculations.subtotal) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold-500 rounded-full"
                          style={{ width: `${(calculations.menuTotal / calculations.subtotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Decor</span>
                        <span>{Math.round((calculations.decorTotal / calculations.subtotal) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-burgundy-500 rounded-full"
                          style={{ width: `${(calculations.decorTotal / calculations.subtotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Venue & Services</span>
                        <span>{Math.round(((calculations.venueRental + calculations.photoCost + calculations.entertainmentCost + calculations.transportCost + calculations.invitationCost) / calculations.subtotal) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${((calculations.venueRental + calculations.photoCost + calculations.entertainmentCost + calculations.transportCost + calculations.invitationCost) / calculations.subtotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button 
                    onClick={() => window.print()}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Save / Print Estimate
                  </button>
                  <a 
                    href={`tel:${currentVenue?.contact?.phone}`}
                    className="block w-full py-3 border-2 border-burgundy-600 text-burgundy-600 hover:bg-burgundy-50 font-semibold rounded-xl transition-all text-center"
                  >
                    Contact {currentVenue?.name?.split(' ')[0]}
                  </a>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                  * Prices are estimates and may vary. Contact venue for exact quotes.
                </p>
              </div>
            </div>
          </div>
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
      additionalServices: extras.additionalServices || {},
      dataSource: source,
    },
  };
}
