import mongoose from 'mongoose';

/** Flexible catalog schemas — store full venue/vendor objects as seeded from JS data files. */

const FlexibleSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);

function modelFor(name) {
  return mongoose.models[name] || mongoose.model(name, FlexibleSchema, name);
}

export const Marquee = () => modelFor('marquees');
export const Vendor = () => modelFor('vendors');
export const Testimonial = () => modelFor('testimonials');
export const InvitationTemplate = () => modelFor('invitation_templates');
export const ChecklistPhase = () => modelFor('checklist_phases');
export const LivePriceDoc = () => modelFor('live_prices');
export const MetaDoc = () => modelFor('meta');
