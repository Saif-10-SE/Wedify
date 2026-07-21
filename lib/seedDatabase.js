import { connectDB, isMongoConfigured } from './mongodb';
import {
  Marquee,
  Vendor,
  Testimonial,
  InvitationTemplate,
  ChecklistPhase,
  LivePriceDoc,
  MetaDoc,
} from './models/Catalog';
import Inquiry from './models/Inquiry';
import Subscriber from './models/Subscriber';
import Invitation from './models/Invitation';
import { marquees, additionalServices, realVenuePhotos } from '@/data/marquees';
import { getAllVendors } from '@/data/vendors';
import { testimonials } from '@/data/testimonials';
import { weddingChecklist } from '@/data/checklist';
import { livePriceSnapshot, livePricesBySlug } from '@/data/livePrices';
import { invitationTemplates } from '@/data/invitationTemplates';
import { createJsonStore } from './jsonStore';

/**
 * Seeds all Wedify static + store data into MongoDB.
 * Safe to re-run: upserts by slug/id.
 */
export async function seedDatabase({ clear = false } = {}) {
  if (!isMongoConfigured()) {
    throw new Error('MONGODB_URI is missing. Add it to .env.local first.');
  }

  await connectDB();

  const results = {};

  if (clear) {
    await Promise.all([
      Marquee().deleteMany({}),
      Vendor().deleteMany({}),
      Testimonial().deleteMany({}),
      InvitationTemplate().deleteMany({}),
      ChecklistPhase().deleteMany({}),
      LivePriceDoc().deleteMany({}),
    ]);
    results.cleared = true;
  }

  // --- Marquees / venues ---
  let marqueeCount = 0;
  for (const venue of marquees) {
    await Marquee().updateOne(
      { slug: venue.slug },
      { $set: { ...venue } },
      { upsert: true }
    );
    marqueeCount += 1;
  }
  results.marquees = marqueeCount;

  // --- Vendors (flat list) ---
  const vendors = getAllVendors();
  let vendorCount = 0;
  for (const vendor of vendors) {
    await Vendor().updateOne(
      { slug: vendor.slug },
      { $set: { ...vendor } },
      { upsert: true }
    );
    vendorCount += 1;
  }
  results.vendors = vendorCount;

  // --- Testimonials ---
  let testimonialCount = 0;
  for (const item of testimonials) {
    await Testimonial().updateOne(
      { id: item.id },
      { $set: { ...item } },
      { upsert: true }
    );
    testimonialCount += 1;
  }
  results.testimonials = testimonialCount;

  // --- Invitation templates ---
  let templateCount = 0;
  for (const tpl of invitationTemplates) {
    await InvitationTemplate().updateOne(
      { id: tpl.id },
      { $set: { ...tpl } },
      { upsert: true }
    );
    templateCount += 1;
  }
  results.invitationTemplates = templateCount;

  // --- Checklist phases ---
  let phaseCount = 0;
  for (const [key, phase] of Object.entries(weddingChecklist)) {
    await ChecklistPhase().updateOne(
      { key },
      { $set: { key, ...phase } },
      { upsert: true }
    );
    phaseCount += 1;
  }
  results.checklistPhases = phaseCount;

  // --- Live prices (single snapshot doc) ---
  await LivePriceDoc().updateOne(
    { _key: 'snapshot' },
    {
      $set: {
        _key: 'snapshot',
        snapshot: livePriceSnapshot,
        bySlug: livePricesBySlug,
        additionalServices,
        realVenuePhotos,
      },
    },
    { upsert: true }
  );
  results.livePrices = 1;

  // --- Migrate local JSON store (inquiries / subscribers / invitations) ---
  const inquiryStore = createJsonStore('inquiries.json');
  const subscriberStore = createJsonStore('subscribers.json');
  const invitationStore = createJsonStore('invitations.json');

  const localInquiries = inquiryStore.read();
  let migratedInquiries = 0;
  for (const row of localInquiries) {
    if (!row?.id) continue;
    await Inquiry.updateOne({ id: row.id }, { $set: row }, { upsert: true });
    migratedInquiries += 1;
  }
  results.migratedInquiries = migratedInquiries;

  const localSubs = subscriberStore.read();
  let migratedSubs = 0;
  for (const row of localSubs) {
    if (!row?.email) continue;
    await Subscriber.updateOne(
      { email: row.email },
      { $set: { id: row.id || `sub_${Date.now()}`, email: row.email } },
      { upsert: true }
    );
    migratedSubs += 1;
  }
  results.migratedSubscribers = migratedSubs;

  const localInvites = invitationStore.read();
  let migratedInvites = 0;
  for (const row of localInvites) {
    if (!row?.id) continue;
    await Invitation.updateOne({ id: row.id }, { $set: row }, { upsert: true });
    migratedInvites += 1;
  }
  results.migratedInvitations = migratedInvites;

  await MetaDoc().updateOne(
    { _key: 'seed' },
    {
      $set: {
        _key: 'seed',
        lastSeededAt: new Date().toISOString(),
        results,
      },
    },
    { upsert: true }
  );

  return {
    success: true,
    message: 'Wedify data seeded into MongoDB.',
    database: 'wedify',
    results,
  };
}
