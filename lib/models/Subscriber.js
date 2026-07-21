import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Subscriber ||
  mongoose.model('Subscriber', SubscriberSchema);
