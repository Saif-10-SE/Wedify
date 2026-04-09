// Testimonials and Reviews Database
export const testimonials = [
  {
    id: 1,
    couple: 'Ahmed & Fatima',
    venue: 'Royal Palm Golf & Country Club',
    venueSlug: 'royal-palm',
    date: 'December 2025',
    rating: 5,
    review: 'Our wedding at Royal Palm was absolutely magical! The venue exceeded all expectations with its stunning lawns and impeccable service. The team made sure every detail was perfect. We couldn\'t have asked for a better experience.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    guests: 1200,
    budget: 'PKR 85 Lac',
    highlights: ['Beautiful Lawns', 'Excellent Catering', 'Professional Staff']
  },
  {
    id: 2,
    couple: 'Hassan & Aisha',
    venue: 'Pearl Continental Marquee',
    venueSlug: 'pc-marquee',
    date: 'November 2025',
    rating: 5,
    review: 'PC Lahore gave us the wedding of our dreams! The 5-star service, exquisite food, and elegant ambiance made our special day unforgettable. Every guest commented on how beautiful everything was.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    guests: 800,
    budget: 'PKR 65 Lac',
    highlights: ['5-Star Service', 'Central Location', 'Multiple Halls']
  },
  {
    id: 3,
    couple: 'Omar & Sara',
    venue: 'Faletti\'s Hotel',
    venueSlug: 'falettis',
    date: 'October 2025',
    rating: 5,
    review: 'We wanted a venue with character and history, and Faletti\'s delivered beautifully. The heritage charm combined with modern amenities created the perfect backdrop for our wedding.',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
    guests: 500,
    budget: 'PKR 45 Lac',
    highlights: ['Heritage Venue', 'Intimate Setting', 'Colonial Charm']
  },
  {
    id: 4,
    couple: 'Ali & Zara',
    venue: 'Lahore Gymkhana',
    venueSlug: 'gymkhana',
    date: 'September 2025',
    rating: 5,
    review: 'The sprawling lawns of Gymkhana gave us the outdoor wedding we always dreamed of. The sunset ceremony was breathtaking, and the staff handled everything with utmost professionalism.',
    image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
    guests: 1500,
    budget: 'PKR 75 Lac',
    highlights: ['Massive Lawns', 'Sunset Ceremony', 'Heritage Architecture']
  },
  {
    id: 5,
    couple: 'Bilal & Mariam',
    venue: 'Serena Hotel Lahore',
    venueSlug: 'serena',
    date: 'August 2025',
    rating: 5,
    review: 'Serena\'s boutique feel and personalized service made our intimate wedding incredibly special. The food was exceptional, and the attention to detail was remarkable.',
    image: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800',
    guests: 350,
    budget: 'PKR 55 Lac',
    highlights: ['Boutique Experience', 'Exceptional Food', 'Personalized Service']
  },
  {
    id: 6,
    couple: 'Usman & Hira',
    venue: 'The Grand Marquee',
    venueSlug: 'grand-marquee',
    date: 'July 2025',
    rating: 4,
    review: 'Grand Marquee was perfect for our large wedding. The modern facilities accommodated all our guests comfortably, and the value for money was excellent.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    guests: 2500,
    budget: 'PKR 50 Lac',
    highlights: ['Large Capacity', 'Modern Facilities', 'Great Value']
  },
  {
    id: 7,
    couple: 'Faisal & Ayesha',
    venue: 'Royal Pines',
    venueSlug: 'royal-pines',
    date: 'June 2025',
    rating: 5,
    review: 'Royal Pines in DHA was the perfect choice for our modern wedding. The contemporary design and excellent catering impressed all our guests.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    guests: 700,
    budget: 'PKR 48 Lac',
    highlights: ['DHA Location', 'Modern Design', 'Excellent Catering']
  },
  {
    id: 8,
    couple: 'Tariq & Nadia',
    venue: 'Nishat Hotel',
    venueSlug: 'nishat-hotel',
    date: 'May 2025',
    rating: 4,
    review: 'Nishat Hotel offered a great balance of quality and affordability. The rooftop venue was stunning and our Walima was picture-perfect.',
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
    guests: 600,
    budget: 'PKR 38 Lac',
    highlights: ['Rooftop Venue', 'Gulberg Location', 'Good Value']
  }
];

// Get testimonials by venue
export const getTestimonialsByVenue = (venueSlug) => {
  return testimonials.filter(t => t.venueSlug === venueSlug);
};

// Get featured testimonials
export const getFeaturedTestimonials = () => {
  return testimonials.filter(t => t.rating === 5).slice(0, 6);
};

// Get average rating for venue
export const getVenueAverageRating = (venueSlug) => {
  const venueTestimonials = getTestimonialsByVenue(venueSlug);
  if (venueTestimonials.length === 0) return 0;
  const sum = venueTestimonials.reduce((acc, t) => acc + t.rating, 0);
  return (sum / venueTestimonials.length).toFixed(1);
};
