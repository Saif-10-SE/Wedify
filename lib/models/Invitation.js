import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    members: { type: Number, default: 1 },
  },
  { _id: false }
);

const InvitationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    templateId: { type: String, default: 'classic-gold' },
    brideName: { type: String, required: true },
    groomName: { type: String, required: true },
    date: { type: String, required: true },
    time: String,
    venue: String,
    address: String,
    message: String,
    guests: { type: [GuestSchema], default: [] },
    status: { type: String, default: 'saved' },
  },
  { timestamps: true, strict: false }
);

export default mongoose.models.Invitation ||
  mongoose.model('Invitation', InvitationSchema);
