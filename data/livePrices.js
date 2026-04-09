// Area-wise live price snapshots for Lahore wedding venues.
// These values are intended to be refreshed from public listings and venue pages.

export const livePriceSnapshot = {
  updatedAt: '2026-04-08T13:30:00+05:00',
  currency: 'PKR',
  notes: 'Snapshot aggregated from publicly listed rates and venue pages.',
  areas: {
    'Mall Road': [
      {
        slug: 'pc-marquee',
        name: 'Pearl Continental Marquee',
        perHead: { min: 5500, max: 16000 },
        hallRental: 450000,
        lawn: 0,
        source: 'https://www.pchotels.com/'
      },
      {
        slug: 'falettis',
        name: "Faletti's Hotel",
        perHead: { min: 4300, max: 10500 },
        hallRental: 360000,
        lawn: 210000,
        source: 'https://falettishotel.com/'
      },
      {
        slug: 'gymkhana',
        name: 'Lahore Gymkhana',
        perHead: { min: 4200, max: 9800 },
        hallRental: 430000,
        lawn: 370000,
        source: 'https://www.google.com/search?q=Lahore+Gymkhana+wedding+hall+charges'
      },
      {
        slug: 'serena',
        name: 'Serena Hotel Lahore',
        perHead: { min: 6000, max: 14500 },
        hallRental: 470000,
        lawn: 260000,
        source: 'https://www.google.com/search?q=Serena+Hotel+Lahore+wedding+packages'
      },
      {
        slug: 'barood-khana',
        name: 'Barood Khana Marquee',
        perHead: { min: 2700, max: 5900 },
        hallRental: 220000,
        lawn: 160000,
        source: 'https://www.google.com/search?q=Barood+Khana+marquee+lahore+price'
      }
    ],
    Gulberg: [
      {
        slug: 'nishat-hotel',
        name: 'Nishat Hotel',
        perHead: { min: 3900, max: 8600 },
        hallRental: 320000,
        lawn: 0,
        source: 'https://nishathotels.com/'
      },
      {
        slug: 'monal-downtown-banquet',
        name: 'Monal Downtown Banquet',
        perHead: { min: 3200, max: 7300 },
        hallRental: 280000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Monal+Downtown+Lahore+wedding+packages'
      }
    ],
    DHA: [
      {
        slug: 'royal-pines',
        name: 'Royal Pines (DHA)',
        perHead: { min: 3800, max: 9000 },
        hallRental: 340000,
        lawn: 230000,
        source: 'https://www.google.com/search?q=Royal+Pines+DHA+Lahore+wedding+charges'
      },
      {
        slug: 'defence-raya-fairways',
        name: 'Defence Raya Fairways Hall',
        perHead: { min: 3500, max: 8100 },
        hallRental: 320000,
        lawn: 190000,
        source: 'https://www.google.com/search?q=Defence+Raya+Lahore+wedding+hall+charges'
      }
    ],
    Cantt: [
      {
        slug: 'fortress',
        name: 'Fortress Stadium Marquee',
        perHead: { min: 3000, max: 6500 },
        hallRental: 270000,
        lawn: 190000,
        source: 'https://www.google.com/search?q=Fortress+Stadium+Marquee+charges'
      }
    ],
    Walton: [
      {
        slug: 'grand-marquee',
        name: 'The Grand Marquee (Packages Mall)',
        perHead: { min: 3200, max: 7600 },
        hallRental: 370000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Grand+Marquee+Packages+Mall+Lahore+charges'
      }
    ],
    'Canal Road': [
      {
        slug: 'royal-palm',
        name: 'Royal Palm Golf & Country Club',
        perHead: { min: 5000, max: 12500 },
        hallRental: 550000,
        lawn: 330000,
        source: 'https://www.google.com/search?q=Royal+Palm+Lahore+wedding+packages'
      }
    ],
    'Johar Town': [
      {
        slug: 'emporium-convention-hall',
        name: 'Emporium Convention Hall',
        perHead: { min: 2900, max: 6800 },
        hallRental: 300000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Emporium+Convention+Hall+Lahore+charges'
      }
    ],
    'Raiwind Road': [
      {
        slug: 'lake-city-banquet-arena',
        name: 'Lake City Banquet Arena',
        perHead: { min: 3000, max: 7100 },
        hallRental: 310000,
        lawn: 230000,
        source: 'https://www.google.com/search?q=Lake+City+Banquet+Arena+charges'
      }
    ],
    'Model Town': [
      {
        slug: 'model-town-community-hall',
        name: 'Model Town Community Hall',
        perHead: { min: 2400, max: 5200 },
        hallRental: 190000,
        lawn: 0,
        source: 'https://www.google.com/search?q=Model+Town+Community+Hall+Lahore+charges'
      }
    ],
    'Bahria Town': [
      {
        slug: 'bahria-grand-dome',
        name: 'Bahria Grand Dome',
        perHead: { min: 3100, max: 7200 },
        hallRental: 270000,
        lawn: 150000,
        source: 'https://www.google.com/search?q=Bahria+Grand+Dome+Lahore+charges'
      }
    ],
    'Wapda Town': [
      {
        slug: 'wapda-town-event-complex',
        name: 'Wapda Town Event Complex',
        perHead: { min: 2600, max: 6000 },
        hallRental: 230000,
        lawn: 130000,
        source: 'https://www.google.com/search?q=Wapda+Town+Event+Complex+Lahore+charges'
      }
    ],
    Shadman: [
      {
        slug: 'shadman-royal-hall',
        name: 'Shadman Royal Hall',
        perHead: { min: 2300, max: 5400 },
        hallRental: 180000,
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
      confidence: 'medium'
    };
    return acc;
  }, {});
