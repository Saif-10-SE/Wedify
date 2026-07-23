import { formatPrice } from '@/data/marquees';

/** Mid-tier extras aligned with the budget calculator defaults. */
export const DEFAULT_EXTRAS = {
  photography: 250000,
  entertainment: 150000,
  transport: 80000,
  invitations: 50000,
};

/**
 * Estimate a full wedding package for a venue using calculator formula:
 * menu×guests + hall×events + decor×events + extras + 5% tax + 10% contingency
 */
export function estimateVenuePackage(venue, { guests = 500, events = 3, menuIndex = 0, decorIndex = 0, extras = DEFAULT_EXTRAS } = {}) {
  const menus = venue.menuPackages || [];
  const decors = venue.decorPackages || [];
  const safeMenuIdx = Math.min(Math.max(0, menuIndex), Math.max(0, menus.length - 1));
  const safeDecorIdx = Math.min(Math.max(0, decorIndex), Math.max(0, decors.length - 1));

  const menuPerHead = menus[safeMenuIdx]?.price ?? venue.pricing?.perHead?.min ?? 0;
  const menuName = menus[safeMenuIdx]?.name || 'Standard';
  const decorCost = decors[safeDecorIdx]?.price ?? 0;
  const decorName = decors[safeDecorIdx]?.name || 'Standard';
  const hallRental = (venue.pricing?.hallRental || 0) * events;

  const menuTotal = menuPerHead * guests;
  const decorTotal = decorCost * events;
  const photoCost = extras.photography || 0;
  const entertainmentCost = extras.entertainment || 0;
  const transportCost = extras.transport || 0;
  const invitationCost = extras.invitations || 0;

  const subtotal =
    menuTotal + hallRental + decorTotal + photoCost + entertainmentCost + transportCost + invitationCost;
  const serviceTax = Math.round(subtotal * 0.05);
  const contingency = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + serviceTax + contingency;

  return {
    slug: venue.slug,
    name: venue.name,
    area: venue.area,
    capacity: venue.capacity,
    rating: venue.rating,
    menuName,
    menuPerHead,
    decorName,
    decorPerEvent: decorCost,
    breakdown: {
      menuTotal,
      hallRental,
      decorTotal,
      photography: photoCost,
      entertainment: entertainmentCost,
      transport: transportCost,
      invitations: invitationCost,
      subtotal,
      serviceTax,
      contingency,
      grandTotal,
      perGuest: guests > 0 ? Math.round(grandTotal / guests) : grandTotal,
    },
  };
}

function pickMenuIndexForBudget(venue, guests, events, totalBudget, extras) {
  const menus = venue.menuPackages || [];
  if (!menus.length || !totalBudget) return 0;

  let best = 0;
  for (let i = 0; i < menus.length; i++) {
    const est = estimateVenuePackage(venue, { guests, events, menuIndex: i, decorIndex: 0, extras });
    if (est.breakdown.grandTotal <= totalBudget) best = i;
    else break;
  }
  return best;
}

function pickVendor(vendors, type, targetSpend) {
  const options = (vendors || [])
    .filter((v) => v.type === type && v.priceRange?.min != null && v.priceRange?.max != null)
    .map((v) => {
      const mid = Math.round((v.priceRange.min + v.priceRange.max) / 2);
      const fits = v.priceRange.min <= targetSpend;
      return { vendor: v, mid, fits, gap: Math.abs(mid - targetSpend) };
    })
    .sort((a, b) => {
      if (a.fits !== b.fits) return a.fits ? -1 : 1;
      return a.gap - b.gap;
    });

  const pick = options[0];
  if (!pick) return null;
  return {
    type,
    name: pick.vendor.name,
    slug: pick.vendor.slug,
    priceMin: pick.vendor.priceRange.min,
    priceMax: pick.vendor.priceRange.max,
    mid: pick.mid,
    fitsBudget: pick.fits,
    targetSpend,
  };
}

/**
 * Build a catalog-grounded wedding plan. Every number comes from marquees/vendors data.
 */
export function buildWeddingPlan({
  budgetPkr,
  guests,
  area,
  eventsCount = 3,
  eventNames = [],
  marquees = [],
  vendors = [],
  extras = DEFAULT_EXTRAS,
} = {}) {
  const guestsSafe = guests && guests > 0 ? guests : 500;
  const events = eventsCount > 0 ? eventsCount : 3;
  const totalBudget = budgetPkr && budgetPkr > 0 ? budgetPkr : null;

  const pool = area ? marquees.filter((m) => m.area === area) : [...marquees];
  const capacityPool = pool.filter((v) => !guests || (v.capacity?.max >= guestsSafe && v.capacity?.min <= guestsSafe * 1.5));
  const searchPool = capacityPool.length ? capacityPool : pool.length ? pool : marquees;

  const scored = searchPool.map((venue) => {
    const menuIndex = pickMenuIndexForBudget(venue, guestsSafe, events, totalBudget, extras);
    const estimate = estimateVenuePackage(venue, {
      guests: guestsSafe,
      events,
      menuIndex,
      decorIndex: 0,
      extras,
    });
    const grand = estimate.breakdown.grandTotal;
    const fitsBudget = totalBudget ? grand <= totalBudget : true;
    const leftover = totalBudget ? totalBudget - grand : null;
    const priceGap = totalBudget ? Math.abs(grand - totalBudget) : 0;
    const score =
      (venue.rating || 4) * 100 +
      (venue.featured ? 25 : 0) +
      (fitsBudget ? 40 : -30) +
      (area && venue.area === area ? 20 : 0) -
      priceGap / 50000;

    return { venue, estimate, fitsBudget, leftover, score, menuIndex };
  }).sort((a, b) => b.score - a.score);

  const inBudget = scored.filter((x) => x.fitsBudget);
  const recommended = (inBudget.length ? inBudget : scored).slice(0, 3);
  const stretch = scored
    .filter((x) => !x.fitsBudget)
    .slice(0, 1);

  const top = recommended[0];
  const topTotal = top?.estimate.breakdown.grandTotal || 0;
  const remaining = totalBudget ? Math.max(0, totalBudget - topTotal) : null;

  const vendorPicks = [
    pickVendor(vendors, 'Photography', totalBudget ? Math.round(totalBudget * 0.12) : 300000),
    pickVendor(vendors, 'Decoration', totalBudget ? Math.round(totalBudget * 0.18) : 800000),
    pickVendor(vendors, 'Makeup', totalBudget ? Math.round(totalBudget * 0.05) : 150000),
  ].filter(Boolean);

  const tradeOffs = [];
  if (totalBudget && inBudget.length === 0) {
    tradeOffs.push('No venue package fully fits this budget at the requested guest count. Consider fewer guests, fewer events, Silver/Classic packages, or a higher budget.');
  }
  if (totalBudget && top && top.leftover != null && top.leftover > 0) {
    tradeOffs.push(`About ${formatPrice(top.leftover)} remains after the top venue package. Use it for a stronger photo package, invitations, or a nicer decor tier.`);
  }
  if (guestsSafe >= 800) {
    tradeOffs.push('Large guest count drives catering cost. Reducing 50–100 guests frees significant PKR for decor and photography.');
  }
  if (events >= 3) {
    tradeOffs.push('Three events multiply hall and decor costs. Hosting mehndi at home or a simpler venue can protect the barat/walima budget.');
  }

  return {
    inputs: {
      totalBudget,
      guests: guestsSafe,
      area: area || null,
      events,
      eventNames: eventNames.length ? eventNames : ['mehndi', 'barat', 'walima'].slice(0, events),
    },
    recommended: recommended.map((r) => ({
      ...r.estimate,
      fitsBudget: r.fitsBudget,
      leftover: r.leftover,
    })),
    stretch: stretch.map((r) => ({
      ...r.estimate,
      fitsBudget: false,
      leftover: r.leftover,
    })),
    vendors: vendorPicks,
    tradeOffs,
    nextActions: [
      'Open /calculator with your chosen venue slug to tweak packages.',
      'Browse /marquees to inquire about shortlisted venues.',
      'Use /image-generation for decor moodboards.',
      'Use /vendors to compare photography and makeup options.',
    ],
  };
}

export function formatVerifiedPlanMarkdown(plan) {
  if (!plan) return '';
  const { inputs, recommended, stretch, vendors, tradeOffs, nextActions } = plan;
  const lines = [];

  lines.push('## Verified Wedify plan (catalog numbers only)');
  lines.push(
    `Inputs: total budget ${inputs.totalBudget ? formatPrice(inputs.totalBudget) : 'not set'}, guests ${inputs.guests}, area ${inputs.area || 'any'}, events ${inputs.events} (${inputs.eventNames.join(', ')}).`
  );
  lines.push('');

  if (recommended.length) {
    lines.push('### Venue shortlist');
    recommended.forEach((v, i) => {
      const b = v.breakdown;
      lines.push(
        `${i + 1}. **${v.name}** (${v.area}), capacity ${v.capacity.min}-${v.capacity.max}, rating ${v.rating}`
      );
      lines.push(
        `   Menu: ${v.menuName} @ ${formatPrice(v.menuPerHead)}/head | Decor: ${v.decorName} @ ${formatPrice(v.decorPerEvent)}/event`
      );
      lines.push(
        `   Breakdown: catering ${formatPrice(b.menuTotal)}, hall ${formatPrice(b.hallRental)}, decor ${formatPrice(b.decorTotal)}, photo ${formatPrice(b.photography)}, entertainment ${formatPrice(b.entertainment)}, transport ${formatPrice(b.transport)}, invites ${formatPrice(b.invitations)}`
      );
      lines.push(
        `   +5% tax ${formatPrice(b.serviceTax)} +10% contingency ${formatPrice(b.contingency)} → **Grand total ${formatPrice(b.grandTotal)}** (~${formatPrice(b.perGuest)}/guest)${v.fitsBudget ? ' (fits budget)' : ' (over budget)'}`
      );
    });
    lines.push('');
  } else {
    lines.push('No venues matched. Ask for a different area, guest count, or higher budget.');
    lines.push('');
  }

  if (stretch.length) {
    lines.push('### Stretch option (slightly over budget)');
    stretch.forEach((v) => {
      lines.push(`- ${v.name} (${v.area}): ${formatPrice(v.breakdown.grandTotal)}`);
    });
    lines.push('');
  }

  if (vendors.length) {
    lines.push('### Vendor picks near budget share');
    vendors.forEach((v) => {
      lines.push(
        `- ${v.type}: ${v.name} (${formatPrice(v.priceMin)}-${formatPrice(v.priceMax)})${v.fitsBudget ? '' : ' (may exceed allocated share)'}`
      );
    });
    lines.push('');
  }

  if (tradeOffs.length) {
    lines.push('### Trade-offs');
    tradeOffs.forEach((t) => lines.push(`- ${t}`));
    lines.push('');
  }

  lines.push('### Next steps');
  nextActions.forEach((a) => lines.push(`- ${a}`));

  return lines.join('\n');
}
