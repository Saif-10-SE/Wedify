import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    eventDate: { type: String, required: true },
    guestCount: { type: Number, required: true },
    eventType: { type: String, default: 'Wedding' },
    preferredTime: { type: String, default: 'Evening' },
    message: { type: String, default: '' },
    venueSlug: { type: String, default: null },
    venueName: { type: String, default: null },
    status: { type: String, default: 'new' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
