import { connectDB, isMongoConfigured } from '../../lib/mongodb';
import Subscriber from '../../lib/models/Subscriber';
import { createJsonStore } from '../../lib/jsonStore';

const jsonStore = createJsonStore('subscribers.json');

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (isMongoConfigured()) {
      await connectDB();
      const existing = await Subscriber.findOne({ email }).lean();
      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to Wedify updates.',
          storage: 'mongodb',
        });
      }

      await Subscriber.create({
        id: `sub_${Date.now()}`,
        email,
      });

      return res.status(201).json({
        success: true,
        message: 'Subscribed successfully! Wedding tips will land in your inbox.',
        storage: 'mongodb',
      });
    }

    const subscribers = jsonStore.read();
    if (subscribers.find((s) => s.email === email)) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to Wedify updates.',
        storage: 'json',
      });
    }

    subscribers.unshift({
      id: `sub_${Date.now()}`,
      email,
      createdAt: new Date().toISOString(),
    });
    jsonStore.write(subscribers);

    return res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Wedding tips will land in your inbox.',
      storage: 'json',
    });
  } catch (err) {
    console.error('[api/subscribe]', err);
    return res.status(500).json({ error: 'Failed to subscribe.', detail: err.message });
  }
}
