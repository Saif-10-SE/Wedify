import { livePricesBySlug, livePriceSnapshot } from '@/data/livePrices';

export const realVenuePhotos = [
  '/images/venues/falettis-img-4440.jpg',
  '/images/venues/falettis-dsc-0120.jpg',
  '/images/venues/falettis-img-4912.jpg',
  '/images/venues/falettis-dsc-4334.jpg',
  '/images/venues/falettis-dsc-3936.jpg',
  '/images/venues/falettis-dsc-0965.jpg',
  '/images/venues/pc-lahore-eid-package.jpg',
  '/images/venues/pc-hotel-5958.jpg',
  '/images/venues/pc-hotel-5960.jpg',
  '/images/venues/pc-hotel-5959.jpg',
  '/images/venues/pc-bhurban-2.webp',
  '/images/venues/pc-karachi-banner.jpg',
  '/images/venues/falettis-img-8209.jpg',
  '/images/venues/falettis-dsc-0120.jpg',
  '/images/venues/pc-lahore-eid-package.jpg',
  '/images/venues/pc-karachi-banner.jpg'
];

const buildVenuePhotoSet = (venueIndex, galleryLength = 4) => {
  const safeLength = Math.max(3, galleryLength);
  const image = realVenuePhotos[venueIndex % realVenuePhotos.length];
  const gallery = Array.from({ length: safeLength }, (_, idx) => (
    realVenuePhotos[(venueIndex + idx) % realVenuePhotos.length]
  ));

  return { image, gallery };
};

// Lahore Marquees and Event Halls Database
const baseMarquees = [
  {
    id: 1,
    name: "Royal Palm Golf & Country Club",
    slug: "royal-palm",
    location: "Canal Road, Lahore",
    area: "Canal Road",
    description: "The epitome of luxury and elegance, Royal Palm offers world-class facilities with lush green surroundings and impeccable service for the most prestigious weddings in Lahore.",
    capacity: { min: 500, max: 3000 },
    rating: 4.9,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800"
    ],
    amenities: ["Valet Parking", "5-Star Catering", "Bridal Suite", "Prayer Area", "AC Halls", "Outdoor Lawns", "Helipad"],
    pricing: {
      perHead: { min: 4500, max: 9000 },
      hallRental: 400000,
      lawn: 250000
    },
    menuPackages: [
      { name: "Silver", price: 4500, items: ["Main Course (3)", "Starters (4)", "Desserts (3)", "Beverages"] },
      { name: "Gold", price: 6500, items: ["Main Course (5)", "Starters (6)", "Live Stations (2)", "Desserts (5)", "Beverages"] },
      { name: "Platinum", price: 8000, items: ["Main Course (7)", "Starters (8)", "Live Stations (4)", "Desserts (7)", "Premium Beverages", "Imported Items"] },
      { name: "Diamond", price: 9000, items: ["Unlimited Menu", "Live Stations (6)", "International Cuisine", "Premium Everything", "Personal Chef"] }
    ],
    decorPackages: [
      { name: "Classic", price: 800000, includes: ["Stage Setup", "Basic Lighting", "Flower Arrangements", "Entry Gate"] },
      { name: "Premium", price: 1500000, includes: ["Designer Stage", "LED Walls", "Premium Flowers", "Themed Entry", "Ceiling Draping"] },
      { name: "Luxury", price: 2500000, includes: ["Custom Design", "Chandelier Setup", "Imported Flowers", "Full Venue Transformation", "Fountain Display"] },
      { name: "Royal", price: 4000000, includes: ["Celebrity Designer", "International Standards", "Everything Custom", "Fireworks", "Drone Show"] }
    ],
    contact: { phone: "+92 42 111 602 602", email: "events@royalpalm.com.pk" },
    featured: true
  },
  {
    id: 2,
    name: "Pearl Continental Marquee",
    slug: "pc-marquee",
    location: "Shahrah-e-Quaid-e-Azam, Lahore",
    area: "Mall Road",
    description: "Synonymous with luxury hospitality, PC Lahore offers an unmatched wedding experience with their signature 5-star service and central location.",
    capacity: { min: 200, max: 1500 },
    rating: 4.8,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
    ],
    amenities: ["Valet Parking", "5-Star Kitchen", "Bridal Room", "Mosque", "Multiple Halls", "Rooftop Option"],
    pricing: {
      perHead: { min: 7000, max: 11000 },
      hallRental: 500000,
      lawn: 0
    },
    menuPackages: [
      { name: "Classic", price: 7000, items: ["Continental Menu", "Main Course (4)", "Starters (5)", "Desserts (4)"] },
      { name: "Executive", price: 8500, items: ["Mixed Cuisine", "Main Course (6)", "Live BBQ", "Desserts (6)", "Mocktails"] },
      { name: "Presidential", price: 10000, items: ["International Buffet", "Seafood Station", "Live Cooking", "Premium Desserts"] },
      { name: "Imperial", price: 11000, items: ["Unlimited International", "Lobster & Prawns", "Sushi Bar", "Chocolate Fountain"] }
    ],
    decorPackages: [
      { name: "Elegant", price: 600000, includes: ["Stage Design", "Basic Flowers", "Entrance Decor", "Table Setup"] },
      { name: "Grand", price: 1200000, includes: ["Custom Stage", "Premium Florals", "LED Lighting", "Photo Booth"] },
      { name: "Majestic", price: 2000000, includes: ["Themed Decor", "Imported Flowers", "Chandeliers", "Full Transformation"] }
    ],
    contact: { phone: "+92 42 111 505 505", email: "banquets@pchotels.com" },
    featured: true
  },
  {
    id: 3,
    name: "Faletti's Hotel",
    slug: "falettis",
    location: "Egerton Road, Lahore",
    area: "Mall Road",
    description: "A heritage landmark since 1880, Faletti's combines colonial charm with modern luxury for timeless wedding celebrations.",
    capacity: { min: 150, max: 800 },
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
    ],
    amenities: ["Heritage Building", "Gardens", "Bridal Suite", "Valet Parking", "AC Halls"],
    pricing: {
      perHead: { min: 6500, max: 9000 },
      hallRental: 350000,
      lawn: 200000
    },
    menuPackages: [
      { name: "Traditional", price: 6500, items: ["Desi Menu", "Main Course (4)", "Starters (4)", "Desserts (3)"] },
      { name: "Continental", price: 7500, items: ["Mixed Menu", "Main Course (5)", "Starters (6)", "Live Counter"] },
      { name: "Royal", price: 8500, items: ["Premium Buffet", "Main Course (7)", "Live Stations (3)", "Dessert Bar"] },
      { name: "Heritage", price: 9000, items: ["Signature Menu", "Chef's Specials", "Everything Premium"] }
    ],
    decorPackages: [
      { name: "Classic", price: 500000, includes: ["Traditional Stage", "Flower Decor", "Entry Setup"] },
      { name: "Victorian", price: 900000, includes: ["Heritage Theme", "Vintage Decor", "Premium Flowers"] },
      { name: "Royal", price: 1500000, includes: ["Custom Everything", "Luxury Florals", "Full Venue"] }
    ],
    contact: { phone: "+92 42 3631 5333", email: "events@falettis.com" },
    featured: true
  },
  {
    id: 4,
    name: "Nishat Hotel",
    slug: "nishat-hotel",
    location: "Gulberg III, Lahore",
    area: "Gulberg",
    description: "Modern luxury meets traditional hospitality at Nishat Hotel, offering contemporary wedding venues with exceptional cuisine.",
    capacity: { min: 200, max: 1200 },
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800"
    ],
    amenities: ["Modern Halls", "Rooftop Venue", "Valet Parking", "Bridal Room", "Prayer Area"],
    pricing: {
      perHead: { min: 4500, max: 8500 },
      hallRental: 300000,
      lawn: 0
    },
    menuPackages: [
      { name: "Standard", price: 4500, items: ["Desi Menu", "Main Course (3)", "Starters (4)", "Desserts (3)"] },
      { name: "Deluxe", price: 6000, items: ["Mixed Menu", "Main Course (5)", "Live BBQ", "Desserts (4)"] },
      { name: "Premium", price: 7500, items: ["Premium Buffet", "Main Course (6)", "Live Stations (2)", "Dessert Bar"] },
      { name: "Signature", price: 8500, items: ["Chef Special", "International Items", "Premium Everything"] }
    ],
    decorPackages: [
      { name: "Simple", price: 400000, includes: ["Stage Setup", "Basic Decor", "Flowers"] },
      { name: "Elegant", price: 750000, includes: ["Designer Stage", "Premium Flowers", "Lighting"] },
      { name: "Grand", price: 1200000, includes: ["Full Custom", "Imported Items", "Transformation"] }
    ],
    contact: { phone: "+92 42 3577 6677", email: "events@nishathotels.com" },
    featured: false
  },
  {
    id: 5,
    name: "Lahore Gymkhana",
    slug: "gymkhana",
    location: "Upper Mall, Lahore",
    area: "Mall Road",
    description: "Exclusive members-only club offering elegant wedding venues with sprawling lawns and colonial-era architecture.",
    capacity: { min: 300, max: 2000 },
    rating: 4.8,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800"
    ],
    amenities: ["Heritage Venue", "Massive Lawns", "AC Halls", "Parking", "Members Club"],
    pricing: {
      perHead: { min: 5500, max: 9500 },
      hallRental: 400000,
      lawn: 300000
    },
    menuPackages: [
      { name: "Club Standard", price: 5500, items: ["Traditional Menu", "Main Course (4)", "Starters (5)"] },
      { name: "Club Premium", price: 7000, items: ["Mixed Cuisine", "Main Course (5)", "Live Stations (2)"] },
      { name: "Club Signature", price: 8500, items: ["Premium Buffet", "Chef Specials", "Unlimited"] },
      { name: "Presidential", price: 9500, items: ["International Menu", "Everything Premium"] }
    ],
    decorPackages: [
      { name: "Traditional", price: 600000, includes: ["Classic Stage", "Garden Setup", "Flowers"] },
      { name: "Elegant", price: 1000000, includes: ["Designer Decor", "Lighting", "Premium Florals"] },
      { name: "Grand", price: 1800000, includes: ["Full Transformation", "Custom Design", "Premium Everything"] }
    ],
    contact: { phone: "+92 42 3630 4545", email: "events@gymkhana.org.pk" },
    featured: true
  },
  {
    id: 6,
    name: "The Grand Marquee (Packages Mall)",
    slug: "grand-marquee",
    location: "Packages Mall, Walton Road",
    area: "Walton",
    description: "Ultra-modern wedding venue with state-of-the-art facilities, massive capacity, and convenient mall location.",
    capacity: { min: 500, max: 4000 },
    rating: 4.5,
    reviews: 223,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800"
    ],
    amenities: ["Massive Capacity", "Modern Design", "Mall Parking", "Multiple Halls", "AC Throughout"],
    pricing: {
      perHead: { min: 3000, max: 5500 },
      hallRental: 250000,
      lawn: 0
    },
    menuPackages: [
      { name: "Economy", price: 3000, items: ["Basic Menu", "Main Course (3)", "Starters (3)"] },
      { name: "Standard", price: 4000, items: ["Good Menu", "Main Course (4)", "Starters (5)", "Desserts (4)"] },
      { name: "Premium", price: 4800, items: ["Premium Menu", "Main Course (5)", "Live Stations (2)"] },
      { name: "Luxury", price: 5500, items: ["Full Buffet", "Everything Included"] }
    ],
    decorPackages: [
      { name: "Basic", price: 350000, includes: ["Simple Stage", "Basic Decor"] },
      { name: "Standard", price: 600000, includes: ["Good Stage", "Flowers", "Lighting"] },
      { name: "Premium", price: 1000000, includes: ["Custom Stage", "Full Decor", "Premium Setup"] }
    ],
    contact: { phone: "+92 42 3589 3456", email: "info@grandmarquee.pk" },
    featured: false
  },
  {
    id: 7,
    name: "Serena Hotel Lahore",
    slug: "serena",
    location: "Faisal Chowk, Mall Road",
    area: "Mall Road",
    description: "Afghanistan-rooted hospitality brand offering unique blend of cultural elegance and modern luxury for distinguished weddings.",
    capacity: { min: 150, max: 1000 },
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800"
    ],
    amenities: ["Boutique Hotel", "Intimate Setting", "5-Star Service", "Bridal Suite", "Valet"],
    pricing: {
      perHead: { min: 6500, max: 12000 },
      hallRental: 450000,
      lawn: 250000
    },
    menuPackages: [
      { name: "Serena Classic", price: 6500, items: ["Signature Menu", "Main Course (4)", "Appetizers (5)"] },
      { name: "Serena Gold", price: 8500, items: ["Premium Buffet", "Main Course (6)", "Live Stations (2)"] },
      { name: "Serena Platinum", price: 10000, items: ["International Cuisine", "Chef's Table", "Premium All"] },
      { name: "Serena Royal", price: 12000, items: ["Custom Menu", "Everything Bespoke"] }
    ],
    decorPackages: [
      { name: "Elegant", price: 700000, includes: ["Sophisticated Setup", "Quality Flowers", "Tasteful Lighting"] },
      { name: "Luxurious", price: 1300000, includes: ["Designer Decor", "Premium Florals", "Full Ambiance"] },
      { name: "Bespoke", price: 2200000, includes: ["Custom Everything", "International Standards"] }
    ],
    contact: { phone: "+92 42 111 133 133", email: "lahore@serena.com.pk" },
    featured: true
  },
  {
    id: 8,
    name: "Fortress Stadium Marquee",
    slug: "fortress",
    location: "Fortress Stadium, Cantt",
    area: "Cantt",
    description: "Spacious venue in the heart of Cantt with excellent accessibility and professional event management.",
    capacity: { min: 400, max: 2500 },
    rating: 4.4,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800"
    ],
    amenities: ["Large Capacity", "Easy Access", "Ample Parking", "AC Halls", "Open Areas"],
    pricing: {
      perHead: { min: 2800, max: 4000 },
      hallRental: 200000,
      lawn: 150000
    },
    menuPackages: [
      { name: "Basic", price: 2800, items: ["Simple Menu", "Main Course (3)", "Starters (3)"] },
      { name: "Standard", price: 3200, items: ["Good Menu", "Main Course (4)", "Starters (4)", "Desserts"] },
      { name: "Premium", price: 3600, items: ["Better Menu", "Main Course (5)", "Live BBQ"] },
      { name: "Deluxe", price: 4000, items: ["Full Menu", "Everything Good"] }
    ],
    decorPackages: [
      { name: "Simple", price: 300000, includes: ["Basic Stage", "Simple Decor"] },
      { name: "Good", price: 550000, includes: ["Nice Stage", "Flowers", "Lighting"] },
      { name: "Premium", price: 900000, includes: ["Full Setup", "Quality Decor"] }
    ],
    contact: { phone: "+92 42 3667 1234", email: "events@fortressmarquee.com" },
    featured: false
  },
  {
    id: 9,
    name: "Barood Khana Marquee",
    slug: "barood-khana",
    location: "Barood Khana, Mall Road",
    area: "Mall Road",
    description: "Historic location with modern amenities, perfect for those who want tradition meets contemporary elegance.",
    capacity: { min: 300, max: 1800 },
    rating: 4.3,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800"
    ],
    amenities: ["Historic Location", "Good Parking", "Flexible Spaces", "AC Available"],
    pricing: {
      perHead: { min: 2500, max: 4500 },
      hallRental: 180000,
      lawn: 120000
    },
    menuPackages: [
      { name: "Economy", price: 2500, items: ["Basic Desi", "Main Course (3)", "Starters (3)"] },
      { name: "Standard", price: 3200, items: ["Good Menu", "Main Course (4)", "Starters (4)"] },
      { name: "Premium", price: 3900, items: ["Nice Menu", "Main Course (5)", "Live Counter"] },
      { name: "Special", price: 4500, items: ["Best Menu", "Good Selection"] }
    ],
    decorPackages: [
      { name: "Basic", price: 250000, includes: ["Simple Setup", "Basic Flowers"] },
      { name: "Standard", price: 450000, includes: ["Good Stage", "Nice Decor"] },
      { name: "Premium", price: 750000, includes: ["Full Decor", "Good Setup"] }
    ],
    contact: { phone: "+92 42 3765 4321", email: "info@baroodkhana.pk" },
    featured: false
  },
  {
    id: 10,
    name: "Royal Pines (DHA)",
    slug: "royal-pines",
    location: "DHA Phase 6, Lahore",
    area: "DHA",
    description: "Modern marquee in the upscale DHA area with contemporary design and excellent catering services.",
    capacity: { min: 300, max: 1500 },
    rating: 4.6,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"
    ],
    amenities: ["DHA Location", "Modern Design", "Good Parking", "AC Throughout", "Prayer Area"],
    pricing: {
      perHead: { min: 3800, max: 5500 },
      hallRental: 280000,
      lawn: 180000
    },
    menuPackages: [
      { name: "Standard", price: 3800, items: ["Good Menu", "Main Course (4)", "Starters (4)"] },
      { name: "Deluxe", price: 4500, items: ["Better Menu", "Main Course (5)", "Live Stations"] },
      { name: "Premium", price: 5000, items: ["Premium Menu", "Main Course (6)", "Dessert Bar"] },
      { name: "Elite", price: 5500, items: ["Best Menu", "Everything Premium"] }
    ],
    decorPackages: [
      { name: "Modern", price: 450000, includes: ["Contemporary Stage", "Modern Decor"] },
      { name: "Elegant", price: 800000, includes: ["Designer Setup", "Premium Flowers", "Lighting"] },
      { name: "Luxurious", price: 1400000, includes: ["Full Custom", "Best Everything"] }
    ],
    contact: { phone: "+92 42 3569 1234", email: "events@royalpines.pk" },
    featured: true
  },
  {
    id: 11,
    name: "Defence Raya Fairways Hall",
    slug: "defence-raya-fairways",
    location: "DHA Phase 6, Lahore",
    area: "DHA",
    description: "Contemporary event hall with golf-course views, popular for barat and walima events.",
    capacity: { min: 250, max: 1200 },
    rating: 4.2,
    reviews: 121,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
    ],
    amenities: ["Indoor Hall", "Dedicated Parking", "Bridal Lounge", "Central AC", "Prayer Area"],
    pricing: {
      perHead: { min: 3500, max: 5500 },
      hallRental: 280000,
      lawn: 160000
    },
    menuPackages: [
      { name: "Classic", price: 3500, items: ["Main Course (3)", "Starters (3)", "Dessert"] },
      { name: "Premium", price: 4200, items: ["Main Course (5)", "Live BBQ", "Desserts (4)"] },
      { name: "Signature", price: 4900, items: ["Main Course (6)", "Live Stations (2)", "Premium Desserts"] }
    ],
    decorPackages: [
      { name: "Basic", price: 350000, includes: ["Stage", "Entry Decor", "Basic Floral"] },
      { name: "Elegant", price: 700000, includes: ["Designer Stage", "Lighting", "Premium Florals"] },
      { name: "Luxury", price: 1200000, includes: ["Custom Theme", "Imported Florals", "Complete Styling"] }
    ],
    contact: { phone: "+92 42 111 729 111", email: "events@raya.com.pk" },
    featured: false
  },
  {
    id: 12,
    name: "Monal Downtown Banquet",
    slug: "monal-downtown-banquet",
    location: "Gulberg III, Lahore",
    area: "Gulberg",
    description: "Urban banquet space for intimate to mid-size events with in-house management support.",
    capacity: { min: 150, max: 900 },
    rating: 4.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800"
    ],
    amenities: ["Indoor Hall", "Valet", "Sound System", "Generator Backup", "Prayer Room"],
    pricing: {
      perHead: { min: 3500, max: 6500 },
      hallRental: 250000,
      lawn: 0
    },
    menuPackages: [
      { name: "Standard", price: 3500, items: ["Desi Buffet", "Main Course (3)", "Dessert"] },
      { name: "Deluxe", price: 4500, items: ["Main Course (5)", "BBQ", "Desserts (3)"] },
      { name: "Executive", price: 5500, items: ["Main Course (6)", "Live Stations", "Premium Desserts"] }
    ],
    decorPackages: [
      { name: "Simple", price: 300000, includes: ["Stage", "Lighting", "Fresh Flowers"] },
      { name: "Modern", price: 600000, includes: ["Custom Stage", "LED Backdrop", "Premium Flowers"] },
      { name: "Grand", price: 950000, includes: ["Themed Decor", "Walkway Styling", "Full Hall Styling"] }
    ],
    contact: { phone: "+92 42 3578 2444", email: "events@monaldowntown.pk" },
    featured: false
  },
  {
    id: 13,
    name: "Emporium Convention Hall",
    slug: "emporium-convention-hall",
    location: "Johar Town, Lahore",
    area: "Johar Town",
    description: "Large-capacity convention-style hall near Emporium for high-volume wedding functions.",
    capacity: { min: 400, max: 2600 },
    rating: 3.9,
    reviews: 143,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
    ],
    amenities: ["Large Hall", "Mall Parking Access", "Central AC", "VIP Lounge", "Stage Lighting"],
    pricing: {
      perHead: { min: 3200, max: 5000 },
      hallRental: 250000,
      lawn: 0
    },
    menuPackages: [
      { name: "Economy", price: 3200, items: ["Main Course (3)", "Starters (3)", "Sweet Dish"] },
      { name: "Plus", price: 3800, items: ["Main Course (4)", "BBQ", "Desserts (3)"] },
      { name: "Premium", price: 4400, items: ["Main Course (5)", "Live Stations (2)", "Dessert Bar"] }
    ],
    decorPackages: [
      { name: "Value", price: 280000, includes: ["Basic Stage", "Entrance Decor", "Table Styling"] },
      { name: "Signature", price: 560000, includes: ["Designer Stage", "LED Setup", "Florals"] },
      { name: "Royal", price: 980000, includes: ["Custom Theme", "Grand Entry", "Complete Styling"] }
    ],
    contact: { phone: "+92 42 111 367 467", email: "events@emporiumhall.pk" },
    featured: false
  },
  {
    id: 14,
    name: "Lake City Banquet Arena",
    slug: "lake-city-banquet-arena",
    location: "Raiwind Road, Lahore",
    area: "Raiwind Road",
    description: "Purpose-built banquet arena for big gatherings with easy access from ring road.",
    capacity: { min: 500, max: 3000 },
    rating: 4.1,
    reviews: 101,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800"
    ],
    amenities: ["Mega Hall", "Wide Parking", "Bridal Suite", "Generator", "Catering Kitchen"],
    pricing: {
      perHead: { min: 3000, max: 5500 },
      hallRental: 280000,
      lawn: 180000
    },
    menuPackages: [
      { name: "Starter", price: 3000, items: ["Main Course (3)", "Starters (3)", "Dessert"] },
      { name: "Classic", price: 3800, items: ["Main Course (5)", "Live BBQ", "Desserts (4)"] },
      { name: "Prime", price: 4600, items: ["Main Course (6)", "Live Stations", "Premium Desserts"] }
    ],
    decorPackages: [
      { name: "Basic", price: 320000, includes: ["Stage", "Entry Gate", "Basic Lighting"] },
      { name: "Premium", price: 640000, includes: ["Designer Stage", "Floral Styling", "Ambient Lights"] },
      { name: "Elite", price: 1100000, includes: ["Custom Decor", "Ceiling Drapes", "Full Arena Styling"] }
    ],
    contact: { phone: "+92 42 111 525 324", email: "events@lakecityarena.pk" },
    featured: false
  },
  {
    id: 15,
    name: "Model Town Community Hall",
    slug: "model-town-community-hall",
    location: "Model Town, Lahore",
    area: "Model Town",
    description: "Budget-friendly hall in central Lahore, preferred for mehndi and daytime events.",
    capacity: { min: 120, max: 700 },
    rating: 3.6,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
    ],
    amenities: ["Indoor Hall", "Economical Packages", "Parking", "Stage", "Generator"],
    pricing: {
      perHead: { min: 2200, max: 4000 },
      hallRental: 150000,
      lawn: 0
    },
    menuPackages: [
      { name: "Budget", price: 2200, items: ["Main Course (2)", "Starters (2)", "Dessert"] },
      { name: "Regular", price: 2800, items: ["Main Course (4)", "BBQ", "Desserts (2)"] },
      { name: "Value Plus", price: 3400, items: ["Main Course (5)", "Live Counter", "Dessert Bar"] }
    ],
    decorPackages: [
      { name: "Starter", price: 180000, includes: ["Basic Stage", "Entry Decor", "Simple Lighting"] },
      { name: "Enhanced", price: 350000, includes: ["Designer Stage", "Fresh Flowers", "Theme Lights"] },
      { name: "Premium", price: 620000, includes: ["Custom Theme", "Bridal Walkway", "Full Styling"] }
    ],
    contact: { phone: "+92 42 3591 3210", email: "bookings@modeltownhall.pk" },
    featured: false
  },
  {
    id: 16,
    name: "Bahria Grand Dome",
    slug: "bahria-grand-dome",
    location: "Bahria Town, Lahore",
    area: "Bahria Town",
    description: "New event hall cluster in Bahria Town with modern interiors and bundled decor options.",
    capacity: { min: 300, max: 1800 },
    rating: 4.1,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"
    ],
    amenities: ["Modern Hall", "Gated Community", "Parking", "Bridal Lounge", "Prayer Space"],
    pricing: {
      perHead: { min: 3000, max: 5500 },
      hallRental: 250000,
      lawn: 140000
    },
    menuPackages: [
      { name: "Smart", price: 3000, items: ["Main Course (3)", "Starters (3)", "Dessert"] },
      { name: "Choice", price: 3800, items: ["Main Course (4)", "Live BBQ", "Desserts (3)"] },
      { name: "Royal", price: 4600, items: ["Main Course (6)", "Live Stations", "Premium Desserts"] }
    ],
    decorPackages: [
      { name: "Essential", price: 260000, includes: ["Stage", "Centerpieces", "Entry Setup"] },
      { name: "Elegant", price: 520000, includes: ["Designer Stage", "Floral Arches", "Lighting"] },
      { name: "Ultimate", price: 900000, includes: ["Custom Decor", "Imported Florals", "Full Hall Styling"] }
    ],
    contact: { phone: "+92 42 3534 1541", email: "events@bahriagranddome.pk" },
    featured: false
  },
  {
    id: 17,
    name: "Wapda Town Event Complex",
    slug: "wapda-town-event-complex",
    location: "Wapda Town, Lahore",
    area: "Wapda Town",
    description: "Multi-hall event complex with flexible packages for medium-budget weddings.",
    capacity: { min: 200, max: 1400 },
    rating: 3.8,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
    ],
    amenities: ["Two Banquet Halls", "Generator Backup", "Parking", "Family Lounge", "In-house Sound"],
    pricing: {
      perHead: { min: 2200, max: 4000 },
      hallRental: 180000,
      lawn: 100000
    },
    menuPackages: [
      { name: "Basic", price: 2200, items: ["Main Course (3)", "Starters (2)", "Dessert"] },
      { name: "Standard", price: 2800, items: ["Main Course (4)", "BBQ", "Desserts (3)"] },
      { name: "Plus", price: 3400, items: ["Main Course (5)", "Live Station", "Premium Desserts"] }
    ],
    decorPackages: [
      { name: "Starter", price: 220000, includes: ["Basic Stage", "Entrance Decor", "Simple Lighting"] },
      { name: "Deluxe", price: 430000, includes: ["Enhanced Stage", "Floral Styling", "Mood Lighting"] },
      { name: "Signature", price: 760000, includes: ["Custom Theme", "Walkway Decor", "Full Styling"] }
    ],
    contact: { phone: "+92 42 3529 0044", email: "bookings@wapdatownevents.pk" },
    featured: false
  },
  {
    id: 18,
    name: "Shadman Royal Hall",
    slug: "shadman-royal-hall",
    location: "Shadman, Lahore",
    area: "Shadman",
    description: "Established city-center event hall offering practical packages regardless of rating tier.",
    capacity: { min: 180, max: 1000 },
    rating: 3.4,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800"
    ],
    amenities: ["Central Location", "AC Hall", "Parking", "Stage", "Basic Audio"],
    pricing: {
      perHead: { min: 1800, max: 3500 },
      hallRental: 140000,
      lawn: 0
    },
    menuPackages: [
      { name: "Saver", price: 1800, items: ["Main Course (2)", "Starters (2)", "Dessert"] },
      { name: "Classic", price: 2300, items: ["Main Course (4)", "BBQ", "Desserts (2)"] },
      { name: "Preferred", price: 2900, items: ["Main Course (5)", "Live Counter", "Dessert Bar"] }
    ],
    decorPackages: [
      { name: "Essential", price: 170000, includes: ["Simple Stage", "Entrance Arch", "Lighting"] },
      { name: "Modern", price: 340000, includes: ["Designer Stage", "Floral Work", "Ambient Lights"] },
      { name: "Premium", price: 620000, includes: ["Custom Setup", "Theme Styling", "Full Hall Decor"] }
    ],
    contact: { phone: "+92 42 3624 5077", email: "events@shadmanroyalhall.pk" },
    featured: false
  }
];

export const marquees = baseMarquees.map((venue, venueIndex) => {
  const photoSet = buildVenuePhotoSet(venueIndex, venue.gallery?.length || 4);
  const venueWithRealPhotos = {
    ...venue,
    image: photoSet.image,
    gallery: photoSet.gallery,
    photoSource: {
      provider: 'Pakistani venue sites',
      type: 'real-photography',
      note: 'Real venue/event-hall photos (non-AI) sourced from Pakistani venue and hotel sites.'
    }
  };
  const live = livePricesBySlug[venue.slug];

  if (!live) {
    return {
      ...venueWithRealPhotos,
      priceMeta: {
        mode: 'fallback-static',
        lastUpdated: null,
        source: null,
        snapshotUpdatedAt: livePriceSnapshot.updatedAt
      }
    };
  }

  return {
    ...venueWithRealPhotos,
    pricing: {
      ...venueWithRealPhotos.pricing,
      perHead: {
        min: live.perHead.min,
        max: live.perHead.max
      },
      hallRental: live.hallRental,
      lawn: live.lawn
    },
    priceMeta: {
      mode: 'live-snapshot',
      lastUpdated: live.lastUpdated,
      source: live.source,
      confidence: live.confidence,
      snapshotUpdatedAt: livePriceSnapshot.updatedAt
    }
  };
});

// Additional services pricing
export const additionalServices = {
  photography: [
    { name: "Basic Package", price: 150000, includes: ["1 Photographer", "Digital Album", "300 Edited Photos"] },
    { name: "Standard Package", price: 300000, includes: ["2 Photographers", "Cinematic Video", "500 Photos", "Highlights Reel"] },
    { name: "Premium Package", price: 500000, includes: ["3 Photographers", "Drone Coverage", "Full Video", "800 Photos", "Same Day Edit"] },
    { name: "Luxury Package", price: 800000, includes: ["Full Team", "Multiple Drones", "Documentary Style", "Unlimited Photos", "Instagram Reels"] }
  ],
  entertainment: [
    { name: "DJ Only", price: 80000, includes: ["Professional DJ", "Sound System", "Basic Lights"] },
    { name: "DJ + Dhol", price: 150000, includes: ["DJ", "Dhol Players (4)", "LED Setup"] },
    { name: "Live Band", price: 350000, includes: ["6-Piece Band", "Professional Sound", "Full Lighting"] },
    { name: "Celebrity Singer", price: 1500000, includes: ["Local Celebrity", "Full Band", "Premium Setup"] }
  ],
  transport: [
    { name: "Basic", price: 50000, includes: ["Decorated Car for Couple"] },
    { name: "Standard", price: 150000, includes: ["Luxury Car", "2 Escort Vehicles"] },
    { name: "Premium", price: 300000, includes: ["Vintage/Luxury Fleet", "Full Escort", "Driver in Uniform"] },
    { name: "Royal", price: 500000, includes: ["Rolls Royce/Bentley", "Police Protocol Look", "Full Convoy"] }
  ],
  invitations: [
    { name: "Digital Only", price: 25000, includes: ["Video Invitation", "WhatsApp Friendly"] },
    { name: "Standard Cards", price: 75000, includes: ["200 Premium Cards", "Envelopes", "Box Packing"] },
    { name: "Luxury Cards", price: 150000, includes: ["200 Designer Cards", "Laser Cut", "Gift Box"] },
    { name: "Bespoke", price: 300000, includes: ["Custom Design", "Premium Materials", "Hand Delivery"] }
  ]
};

// Helper function to format price in PKR
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Get marquee by slug
export const getMarqueeBySlug = (slug) => {
  return marquees.find(m => m.slug === slug);
};

// Get featured marquees
export const getFeaturedMarquees = () => {
  return marquees.filter(m => m.featured);
};

// Filter marquees by criteria
export const filterMarquees = (filters) => {
  let filtered = [...marquees];
  
  if (filters.area) {
    filtered = filtered.filter(m => m.area === filters.area);
  }
  
  if (filters.minCapacity) {
    filtered = filtered.filter(m => m.capacity.max >= filters.minCapacity);
  }
  
  if (filters.maxBudget) {
    filtered = filtered.filter(m => m.pricing.perHead.min <= filters.maxBudget);
  }
  
  if (filters.minRating) {
    filtered = filtered.filter(m => m.rating >= filters.minRating);
  }
  
  return filtered;
};

// Get all areas
export const getAreas = () => {
  return [...new Set(marquees.map(m => m.area))];
};
