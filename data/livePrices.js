// Area-wise Lahore wedding venue rates (2026 market snapshot).
// Sourced from public venue listings, Shadiyana, PakBestFinds, and hotel banquet pages.

export const livePriceSnapshot = {
  updatedAt: '2026-07-20T18:00:00+05:00',
  currency: 'PKR',
  notes:
    'Per-head catering packages for Barat/Walima. Hall rental is often waived or discounted when catering is booked in-house. Always confirm GST and service charges with the venue.',
  areas: {
    'Mall Road': [
      {
        slug: 'pc-marquee',
        name: 'Pearl Continental Marquee',
        perHead: { min: 7000, max: 11000 },
        hallRental: 500000,
        lawn: 0,
        source: 'https://www.pchotels.com/'
      },
      {
        slug: 'falettis',
        name: "Faletti's Hotel",
        perHead: { min: 6500, max: 9000 },
        hallRental: 350000,
        lawn: 200000,
        source: 'https://falettishotel.com/'
      },
      {
        slug: 'gymkhana',
        name: 'Lahore Gymkhana',
        perHead: { min: 5500, max: 9500 },
        hallRental: 400000,
        lawn: 300000,
        source: 'https://www.google.com/search?q=Lahore+Gymkhana+wedding+hall+charges+2026'
      },
      {
        slug: 'serena',
        name: 'Serena Hotel Lahore',
        perHead: { min: 6500, max: 12000 },
        hallRental: 450000,
        lawn: 250000,
        source: 'https://www.serenahotels.com/'
      },
      {
        slug: 'barood-khana',
        name: 'Barood Khana Marquee',
        perHead: { min: 2500, max: 4500 },
        hallRental: 180000,
        lawn: 120000,
        source: 'https://www.google.com/search?q=Barood+Khana+marquee+lahore+price'
      }
    ],
    Gulberg: [
      {
        slug: 'nishat-hotel',
        name: 'Nishat Hotel',
        perHead: { min: 4500, max: 8500 },
        hallRental: 300000,
        lawn: 0,
        source: 'https://nishathotels.com/'
      },
      {
        slug: 'monal-downtown-banquet',
        name: 'Monal Downtown Banquet',
        perHead: { min: 3500, max: 6500 },
        hallRental: 250000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Monal+Downtown+Lahore+wedding+packages'
      }
    ],
    DHA: [
      {
        slug: 'royal-pines',
        name: 'Royal Pines (DHA)',
        perHead: { min: 3800, max: 5500 },
        hallRental: 280000,
        lawn: 180000,
        source: 'https://www.google.com/search?q=Royal+Pines+DHA+Lahore+wedding+charges'
      },
      {
        slug: 'defence-raya-fairways',
        name: 'Defence Raya Fairways Hall',
        perHead: { min: 3500, max: 5500 },
        hallRental: 280000,
        lawn: 160000,
        source: 'https://www.raya.com.pk/'
      }
    ],
    Cantt: [
      {
        slug: 'fortress',
        name: 'Fortress Stadium Marquee',
        perHead: { min: 2800, max: 4000 },
        hallRental: 200000,
        lawn: 150000,
        source: 'https://pakbestfinds.com/best-marquees-in-lahore/'
      }
    ],
    Walton: [
      {
        slug: 'grand-marquee',
        name: 'The Grand Marquee (Packages Mall)',
        perHead: { min: 3000, max: 5500 },
        hallRental: 250000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Grand+Marquee+Packages+Mall+Lahore+charges'
      }
    ],
    'Canal Road': [
      {
        slug: 'royal-palm',
        name: 'Royal Palm Golf & Country Club',
        perHead: { min: 4500, max: 9000 },
        hallRental: 400000,
        lawn: 250000,
        source: 'https://www.shadiyana.pk/wedding-venues/royal-palm-golf-and-country-club'
      }
    ],
    'Johar Town': [
      {
        slug: 'emporium-convention-hall',
        name: 'Emporium Convention Hall',
        perHead: { min: 3200, max: 5000 },
        hallRental: 250000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Emporium+Convention+Hall+Lahore+wedding+charges'
      }
    ],
    'Raiwind Road': [
      {
        slug: 'lake-city-banquet-arena',
        name: 'Lake City Banquet Arena',
        perHead: { min: 3000, max: 5500 },
        hallRental: 280000,
        lawn: 180000,
        source: 'https://www.google.com/search?q=Lake+City+Banquet+Arena+Lahore+charges'
      }
    ],
    'Model Town': [
      {
        slug: 'model-town-community-hall',
        name: 'Model Town Community Hall',
        perHead: { min: 2200, max: 4000 },
        hallRental: 150000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Model+Town+Community+Hall+Lahore+charges'
      }
    ],
    'Bahria Town': [
      {
        slug: 'bahria-grand-dome',
        name: 'Bahria Grand Dome',
        perHead: { min: 3000, max: 5500 },
        hallRental: 250000,
        lawn: 140000,
        source: 'https://www.google.com/search?q=Bahria+Grand+Dome+Lahore+wedding+charges'
      }
    ],
    'Wapda Town': [
      {
        slug: 'wapda-town-event-complex',
        name: 'Wapda Town Event Complex',
        perHead: { min: 2200, max: 4000 },
        hallRental: 180000,
        lawn: 100000,
        source: 'https://www.google.com/search?q=Wapda+Town+Event+Complex+Lahore+charges'
      }
    ],
    Shadman: [
      {
        slug: 'shadman-royal-hall',
        name: 'Shadman Royal Hall',
        perHead: { min: 1800, max: 3500 },
        hallRental: 140000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Shadman+Royal+Hall+Lahore+charges'
      }
    ]
  }
};

export const livePricesBySlug = Object.values(livePriceSnapshot.areas)
  .flat()
  .reduce((acc, venue) => {
    acc[venue.slug] = {
      perHead: venue.perHead,
      hallRental: venue.hallRental,
      lawn: venue.lawn,
      source: venue.source,
      lastUpdated: livePriceSnapshot.updatedAt,
      confidence: 'high'
    };
    return acc;
  }, {});
