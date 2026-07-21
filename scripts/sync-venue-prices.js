const fs = require('fs');
const file = 'data/marquees.js';
let src = fs.readFileSync(file, 'utf8');

const updates = {
  'royal-palm': {
    perHead: { min: 4500, max: 9000 },
    hallRental: 400000,
    lawn: 250000,
    menus: [4500, 6500, 8000, 9000],
    phone: '+92 42 111 602 602',
    email: 'events@royalpalm.com.pk'
  },
  'pc-marquee': {
    perHead: { min: 7000, max: 11000 },
    hallRental: 500000,
    lawn: 0,
    menus: [7000, 8500, 10000, 11000],
    phone: '+92 42 111 505 505',
    email: 'banquets@pchotels.com'
  },
  falettis: {
    perHead: { min: 6500, max: 9000 },
    hallRental: 350000,
    lawn: 200000,
    menus: [6500, 7500, 8500, 9000],
    phone: '+92 42 3631 5333',
    email: 'events@falettis.com'
  },
  'nishat-hotel': {
    perHead: { min: 4500, max: 8500 },
    hallRental: 300000,
    lawn: 0,
    menus: [4500, 6000, 7500, 8500],
    phone: '+92 42 3577 6677',
    email: 'events@nishathotels.com'
  },
  gymkhana: {
    perHead: { min: 5500, max: 9500 },
    hallRental: 400000,
    lawn: 300000,
    menus: [5500, 7000, 8500, 9500],
    phone: '+92 42 3630 4545',
    email: 'events@gymkhana.org.pk'
  },
  'grand-marquee': {
    perHead: { min: 3000, max: 5500 },
    hallRental: 250000,
    lawn: 0,
    menus: [3000, 4000, 4800, 5500],
    phone: '+92 42 3589 3456',
    email: 'info@grandmarquee.pk'
  },
  serena: {
    perHead: { min: 6500, max: 12000 },
    hallRental: 450000,
    lawn: 250000,
    menus: [6500, 8500, 10000, 12000],
    phone: '+92 42 111 133 133',
    email: 'lahore@serena.com.pk'
  },
  fortress: {
    perHead: { min: 2800, max: 4000 },
    hallRental: 200000,
    lawn: 150000,
    menus: [2800, 3200, 3600, 4000],
    phone: '+92 42 3667 1234',
    email: 'events@fortressmarquee.com'
  },
  'barood-khana': {
    perHead: { min: 2500, max: 4500 },
    hallRental: 180000,
    lawn: 120000,
    menus: [2500, 3200, 3900, 4500],
    phone: '+92 42 3765 4321',
    email: 'info@baroodkhana.pk'
  },
  'royal-pines': {
    perHead: { min: 3800, max: 5500 },
    hallRental: 280000,
    lawn: 180000,
    menus: [3800, 4500, 5000, 5500],
    phone: '+92 42 3569 1234',
    email: 'events@royalpines.pk'
  },
  'defence-raya-fairways': {
    perHead: { min: 3500, max: 5500 },
    hallRental: 280000,
    lawn: 160000,
    menus: [3500, 4200, 4900, 5500],
    phone: '+92 42 111 729 111',
    email: 'events@raya.com.pk'
  },
  'monal-downtown-banquet': {
    perHead: { min: 3500, max: 6500 },
    hallRental: 250000,
    lawn: 0,
    menus: [3500, 4500, 5500, 6500],
    phone: '+92 42 3578 2444',
    email: 'events@monaldowntown.pk'
  },
  'emporium-convention-hall': {
    perHead: { min: 3200, max: 5000 },
    hallRental: 250000,
    lawn: 0,
    menus: [3200, 3800, 4400, 5000],
    phone: '+92 42 111 367 467',
    email: 'events@emporiumhall.pk'
  },
  'lake-city-banquet-arena': {
    perHead: { min: 3000, max: 5500 },
    hallRental: 280000,
    lawn: 180000,
    menus: [3000, 3800, 4600, 5500],
    phone: '+92 42 111 525 324',
    email: 'events@lakecityarena.pk'
  },
  'model-town-community-hall': {
    perHead: { min: 2200, max: 4000 },
    hallRental: 150000,
    lawn: 0,
    menus: [2200, 2800, 3400, 4000],
    phone: '+92 42 3591 3210',
    email: 'bookings@modeltownhall.pk'
  },
  'bahria-grand-dome': {
    perHead: { min: 3000, max: 5500 },
    hallRental: 250000,
    lawn: 140000,
    menus: [3000, 3800, 4600, 5500],
    phone: '+92 42 3534 1541',
    email: 'events@bahriagranddome.pk'
  },
  'wapda-town-event-complex': {
    perHead: { min: 2200, max: 4000 },
    hallRental: 180000,
    lawn: 100000,
    menus: [2200, 2800, 3400, 4000],
    phone: '+92 42 3529 0044',
    email: 'bookings@wapdatownevents.pk'
  },
  'shadman-royal-hall': {
    perHead: { min: 1800, max: 3500 },
    hallRental: 140000,
    lawn: 0,
    menus: [1800, 2300, 2900, 3500],
    phone: '+92 42 3624 5077',
    email: 'events@shadmanroyalhall.pk'
  }
};

for (const [slug, u] of Object.entries(updates)) {
  const slugIdx = src.indexOf(`slug: "${slug}"`);
  if (slugIdx < 0) {
    console.log('missing', slug);
    continue;
  }

  const pricingIdx = src.indexOf('pricing: {', slugIdx);
  const lawnIdx = src.indexOf('lawn:', pricingIdx);
  const pricingEnd = src.indexOf('},', lawnIdx) + 2;
  const newPricing = `pricing: {
      perHead: { min: ${u.perHead.min}, max: ${u.perHead.max} },
      hallRental: ${u.hallRental},
      lawn: ${u.lawn}
    },`;
  src = src.slice(0, pricingIdx) + newPricing + src.slice(pricingEnd);

  const contactIdx = src.indexOf('contact: {', slugIdx);
  const contactEnd = src.indexOf('},', contactIdx) + 2;
  const newContact = `contact: { phone: "${u.phone}", email: "${u.email}" },`;
  src = src.slice(0, contactIdx) + newContact + src.slice(contactEnd);

  const menuIdx = src.indexOf('menuPackages: [', slugIdx);
  const menuEnd = src.indexOf('],', menuIdx);
  let menuBlock = src.slice(menuIdx, menuEnd);
  let priceI = 0;
  menuBlock = menuBlock.replace(/price: \d+/g, () => {
    const p = u.menus[priceI] != null ? u.menus[priceI] : u.perHead.max;
    priceI += 1;
    return `price: ${p}`;
  });
  src = src.slice(0, menuIdx) + menuBlock + src.slice(menuEnd);
  console.log('updated', slug);
}

fs.writeFileSync(file, src);
console.log('done');
