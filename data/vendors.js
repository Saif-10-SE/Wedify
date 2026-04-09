import { marquees } from '@/data/marquees';

// Complete Vendors Database for Lahore Weddings
export const vendors = {
  photographers: [
    {
      id: 'photo-1',
      name: 'Irfan Ahson Photography',
      slug: 'irfan-ahson',
      type: 'Photography',
      description: 'Pakistan\'s most sought-after wedding photographer known for cinematic storytelling.',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800',
      rating: 5.0,
      reviews: 234,
      priceRange: { min: 500000, max: 2000000 },
      services: ['Wedding Photography', 'Pre-Wedding Shoots', 'Cinematic Videos', 'Albums'],
      portfolio: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800'
      ],
      contact: { phone: '+92 300 1234567', email: 'info@irfanahson.com', website: 'irfanahson.com' },
      featured: true
    },
    {
      id: 'photo-2',
      name: 'Fatima Tariq Films',
      slug: 'fatima-tariq',
      type: 'Photography',
      description: 'Female-led team specializing in intimate moments and bridal portraits.',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800',
      rating: 4.9,
      reviews: 189,
      priceRange: { min: 300000, max: 1000000 },
      services: ['Bridal Photography', 'Mehndi Coverage', 'Videos', 'Same Day Edits'],
      portfolio: [
        'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800'
      ],
      contact: { phone: '+92 321 9876543', email: 'hello@fatimatariq.pk' },
      featured: true
    },
    {
      id: 'photo-3',
      name: 'Studio Recalls',
      slug: 'studio-recalls',
      type: 'Photography',
      description: 'Contemporary wedding photography with artistic flair and attention to detail.',
      image: 'https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?w=800',
      rating: 4.8,
      reviews: 156,
      priceRange: { min: 200000, max: 600000 },
      services: ['Full Coverage', 'Drone Shots', 'Photo Albums', 'Digital Gallery'],
      portfolio: [],
      contact: { phone: '+92 333 4567890', email: 'book@studiorecalls.pk' },
      featured: false
    }
  ],
  
  decorators: [
    {
      id: 'decor-1',
      name: 'QYT Events',
      slug: 'qyt-events',
      type: 'Decoration',
      description: 'Premier event decoration company creating magical wedding experiences.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      rating: 4.9,
      reviews: 312,
      priceRange: { min: 800000, max: 5000000 },
      services: ['Stage Design', 'Floral Arrangements', 'Lighting', 'Theme Weddings', 'Full Venue Transformation'],
      portfolio: [
        'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'
      ],
      contact: { phone: '+92 300 8765432', email: 'info@qytevents.com' },
      featured: true
    },
    {
      id: 'decor-2',
      name: 'Meraj Din Decor',
      slug: 'meraj-din',
      type: 'Decoration',
      description: 'Traditional and contemporary decor with decades of experience.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      rating: 4.7,
      reviews: 245,
      priceRange: { min: 500000, max: 3000000 },
      services: ['Traditional Decor', 'Modern Themes', 'Floral Design', 'Mandap Setup'],
      portfolio: [],
      contact: { phone: '+92 321 1234567', email: 'merajdindecor@gmail.com' },
      featured: true
    },
    {
      id: 'decor-3',
      name: 'Enchanted Events',
      slug: 'enchanted-events',
      type: 'Decoration',
      description: 'Fairy-tale wedding setups with imported flowers and luxury elements.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      rating: 4.8,
      reviews: 178,
      priceRange: { min: 1000000, max: 8000000 },
      services: ['Luxury Decor', 'Imported Flowers', 'Crystal Installations', 'Custom Themes'],
      portfolio: [],
      contact: { phone: '+92 333 9876543', email: 'hello@enchantedevents.pk' },
      featured: false
    }
  ],
  
  caterers: [
    {
      id: 'cater-1',
      name: 'Gourmet Catering',
      slug: 'gourmet-catering',
      type: 'Catering',
      description: 'Lahore\'s finest caterers known for exceptional taste and presentation.',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      rating: 4.9,
      reviews: 456,
      priceRange: { min: 3000, max: 8000 },
      priceType: 'per head',
      services: ['Pakistani Cuisine', 'Continental', 'Live Counters', 'Dessert Stations'],
      specialties: ['Biryani', 'BBQ', 'Karahi', 'Chinese', 'Continental'],
      contact: { phone: '+92 300 1112233', email: 'orders@gourmetcatering.pk' },
      featured: true
    },
    {
      id: 'cater-2',
      name: 'Royal Kitchen',
      slug: 'royal-kitchen',
      type: 'Catering',
      description: 'Traditional Mughlai cuisine with authentic recipes.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      rating: 4.8,
      reviews: 389,
      priceRange: { min: 2500, max: 6000 },
      priceType: 'per head',
      services: ['Mughlai Food', 'Desi Cuisine', 'BBQ', 'Sweet Dishes'],
      specialties: ['Haleem', 'Nihari', 'Pulao', 'Seekh Kabab'],
      contact: { phone: '+92 321 4445566', email: 'royalkitchenlhr@gmail.com' },
      featured: true
    },
    {
      id: 'cater-3',
      name: 'Fusion Flavors',
      slug: 'fusion-flavors',
      type: 'Catering',
      description: 'Modern fusion cuisine combining Pakistani and international flavors.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      rating: 4.7,
      reviews: 234,
      priceRange: { min: 4000, max: 10000 },
      priceType: 'per head',
      services: ['Fusion Menu', 'International Cuisine', 'Theme Food', 'Chef Table'],
      specialties: ['Sushi', 'Italian', 'Thai', 'Mexican'],
      contact: { phone: '+92 333 7778899', email: 'info@fusionflavors.pk' },
      featured: false
    }
  ],
  
  makeup: [
    {
      id: 'makeup-1',
      name: 'Natasha Salon',
      slug: 'natasha-salon',
      type: 'Makeup',
      description: 'Celebrity makeup artist with signature bridal looks.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
      rating: 4.9,
      reviews: 567,
      priceRange: { min: 150000, max: 500000 },
      services: ['Bridal Makeup', 'Mehndi Look', 'Hair Styling', 'Pre-Wedding Facials'],
      contact: { phone: '+92 300 9998877', email: 'appointments@natashasalon.pk' },
      featured: true
    },
    {
      id: 'makeup-2',
      name: 'Mariam Khawaja Salon',
      slug: 'mariam-khawaja',
      type: 'Makeup',
      description: 'Natural and glamorous bridal transformations.',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
      rating: 4.8,
      reviews: 423,
      priceRange: { min: 100000, max: 350000 },
      services: ['Bridal Package', 'Party Makeup', 'Hair Design', 'Lashes'],
      contact: { phone: '+92 321 6665544', email: 'hello@mariamkhawaja.com' },
      featured: true
    }
  ],
  
  entertainment: [
    {
      id: 'ent-1',
      name: 'Beats & Beyond',
      slug: 'beats-beyond',
      type: 'Entertainment',
      description: 'Premium DJ services with state-of-the-art sound and lighting.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      rating: 4.8,
      reviews: 234,
      priceRange: { min: 80000, max: 300000 },
      services: ['DJ Setup', 'Sound System', 'LED Walls', 'Dhol Players'],
      contact: { phone: '+92 300 1234567', email: 'book@beatsbeyond.pk' },
      featured: true
    },
    {
      id: 'ent-2',
      name: 'Lahore Live Band',
      slug: 'lahore-live-band',
      type: 'Entertainment',
      description: 'Professional live band for wedding celebrations.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      rating: 4.7,
      reviews: 189,
      priceRange: { min: 200000, max: 600000 },
      services: ['Live Music', 'Qawwali', 'Bollywood Songs', 'Western Music'],
      contact: { phone: '+92 333 2223344', email: 'lahoreband@gmail.com' },
      featured: false
    }
  ],
  
  invitation: [
    {
      id: 'inv-1',
      name: 'Card Couture',
      slug: 'card-couture',
      type: 'Invitations',
      description: 'Luxury wedding invitations and bespoke stationery.',
      image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
      rating: 4.9,
      reviews: 345,
      priceRange: { min: 50000, max: 500000 },
      services: ['Luxury Cards', 'Laser Cut', 'Box Invites', 'Digital Invites'],
      contact: { phone: '+92 300 5556677', email: 'orders@cardcouture.pk' },
      featured: true
    }
  ],
  
  jewelry: [
    {
      id: 'jew-1',
      name: 'Hanif Jewellers',
      slug: 'hanif-jewellers',
      type: 'Jewelry',
      description: 'Heritage jeweller crafting exquisite bridal sets.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      rating: 4.9,
      reviews: 567,
      priceRange: { min: 500000, max: 50000000 },
      services: ['Bridal Sets', 'Gold Jewelry', 'Diamond Sets', 'Custom Design'],
      contact: { phone: '+92 42 35761234', email: 'info@hanifjewellers.pk' },
      featured: true
    }
  ],
  
  mehndi: [
    {
      id: 'meh-1',
      name: 'Kashee\'s',
      slug: 'kashees',
      type: 'Mehndi',
      description: 'Signature mehndi designs and bridal services.',
      image: 'https://images.unsplash.com/photo-1560800452-f2d475982b96?w=800',
      rating: 4.9,
      reviews: 678,
      priceRange: { min: 30000, max: 150000 },
      services: ['Bridal Mehndi', 'Arabic Design', 'Traditional', 'Modern Patterns'],
      contact: { phone: '+92 300 8889900', email: 'appointments@kashees.pk' },
      featured: true
    }
  ]
};

const venueVendors = marquees.map((venue) => ({
  id: `venue-${venue.id}`,
  name: venue.name,
  slug: venue.slug,
  type: 'Venue',
  description: venue.description,
  image: venue.image,
  rating: venue.rating,
  reviews: venue.reviews,
  priceRange: {
    min: venue.pricing.perHead.min,
    max: venue.pricing.perHead.max
  },
  priceType: 'per head',
  services: ['Venue Booking', 'Wedding Hall', 'Marquee Events', 'In-house Catering'],
  location: venue.location,
  area: venue.area,
  contact: venue.contact,
  featured: venue.featured
}));

// Get all vendors flat
export const getAllVendors = () => {
  return [...Object.values(vendors).flat(), ...venueVendors];
};

// Get vendors by type
export const getVendorsByType = (type) => {
  const typeMap = {
    photography: vendors.photographers,
    decoration: vendors.decorators,
    catering: vendors.caterers,
    makeup: vendors.makeup,
    entertainment: vendors.entertainment,
    invitations: vendors.invitation,
    jewelry: vendors.jewelry,
    mehndi: vendors.mehndi,
    venue: venueVendors
  };
  return typeMap[type.toLowerCase()] || [];
};

// Get featured vendors
export const getFeaturedVendors = () => {
  return getAllVendors().filter(v => v.featured);
};

// Get vendor by slug
export const getVendorBySlug = (slug) => {
  return getAllVendors().find(v => v.slug === slug);
};

// Get vendor categories
export const getVendorCategories = () => [
  { id: 'photography', name: 'Photography', icon: '📸' },
  { id: 'decoration', name: 'Decoration', icon: '🎨' },
  { id: 'catering', name: 'Catering', icon: '🍽️' },
  { id: 'makeup', name: 'Makeup', icon: '💄' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎵' },
  { id: 'venue', name: 'Venues', icon: '🏛️' },
  { id: 'invitations', name: 'Invitations', icon: '💌' },
  { id: 'jewelry', name: 'Jewelry', icon: '💍' },
  { id: 'mehndi', name: 'Mehndi', icon: '✋' }
];
