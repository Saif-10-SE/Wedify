import { connectDB, isMongoConfigured } from '../../lib/mongodb';
import Inquiry from '../../lib/models/Inquiry';
import { createJsonStore } from '../../lib/jsonStore';

const jsonStore = createJsonStore('inquiries.json');

function toClient(doc) {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  delete obj._id;
  delete obj.__v;
  if (obj.createdAt instanceof Date) {
    obj.createdAt = obj.createdAt.toISOString();
  }
  return obj;
}

async function withMongo(fn) {
  if (!isMongoConfigured()) return null;
  try {
    await connectDB();
    return await fn();
  } catch (err) {
    console.error('[api/inquiry] mongo unavailable, using JSON:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const fromMongo = await withMongo(async () => {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
        const mapped = inquiries.map(toClient);
        return { count: mapped.length, inquiries: mapped, storage: 'mongodb' };
      });
      if (fromMongo) return res.status(200).json(fromMongo);

      const inquiries = jsonStore.read();
      return res.status(200).json({ count: inquiries.length, inquiries, storage: 'json' });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
      name,
      email,
      phone,
      eventDate,
      guestCount,
      eventType,
      message,
      preferredTime,
      venueSlug,
      venueName,
    } = req.body || {};

    if (!name || !email || !phone || !eventDate || !guestCount) {
      return res.status(400).json({
        error: 'Name, email, phone, event date, and guest count are required.',
      });
    }

    const inquiry = {
      id: `inq_${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      eventDate,
      guestCount: Number(guestCount),
      eventType: eventType || 'Wedding',
      preferredTime: preferredTime || 'Evening',
      message: message ? String(message).trim() : '',
      venueSlug: venueSlug || null,
      venueName: venueName || null,
      status: 'new',
    };

    const created = await withMongo(async () => Inquiry.create(inquiry));
    if (created) {
      return res.status(201).json({
        success: true,
        message: 'Inquiry received. Our team will contact you within 24 hours.',
        inquiry: toClient(created),
        storage: 'mongodb',
      });
    }

    const inquiries = jsonStore.read();
    const withDate = { ...inquiry, createdAt: new Date().toISOString() };
    inquiries.unshift(withDate);
    jsonStore.write(inquiries);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received. Our team will contact you within 24 hours.',
      inquiry: withDate,
      storage: 'json',
    });
  } catch (err) {
    console.error('[api/inquiry]', err);
    return res.status(500).json({ error: 'Failed to process inquiry.', detail: err.message });
  }
}
