import { connectDB, isMongoConfigured } from '../../lib/mongodb';
import Invitation from '../../lib/models/Invitation';
import { createJsonStore } from '../../lib/jsonStore';

const jsonStore = createJsonStore('invitations.json');

function toClient(doc) {
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  delete obj._id;
  delete obj.__v;
  if (obj.createdAt instanceof Date) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt instanceof Date) obj.updatedAt = obj.updatedAt.toISOString();
  return obj;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (isMongoConfigured()) {
        await connectDB();
        const invitations = await Invitation.find().sort({ updatedAt: -1 }).lean();
        const mapped = invitations.map(toClient);
        return res.status(200).json({
          count: mapped.length,
          invitations: mapped,
          storage: 'mongodb',
        });
      }
      const invitations = jsonStore.read();
      return res.status(200).json({ count: invitations.length, invitations, storage: 'json' });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body || {};
    const { brideName, groomName, date, guests, templateId } = body;

    if (!brideName || !groomName || !date) {
      return res.status(400).json({
        error: 'Bride name, groom name, and marriage date are required.',
      });
    }

    if (!Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ error: 'At least one guest is required.' });
    }

    const invitation = {
      ...body,
      id: body.id || `inv_${Date.now()}`,
      templateId: templateId || 'classic-gold',
      status: 'saved',
    };

    if (isMongoConfigured()) {
      await connectDB();
      const saved = await Invitation.findOneAndUpdate(
        { id: invitation.id },
        { $set: invitation },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(201).json({
        success: true,
        message: 'Invitation design saved.',
        invitation: toClient(saved),
        storage: 'mongodb',
      });
    }

    const withMeta = {
      ...invitation,
      updatedAt: new Date().toISOString(),
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const invitations = jsonStore.read();
    const idx = invitations.findIndex((item) => item.id === withMeta.id);
    if (idx >= 0) {
      invitations[idx] = withMeta;
    } else {
      invitations.unshift(withMeta);
    }
    jsonStore.write(invitations);

    return res.status(201).json({
      success: true,
      message: 'Invitation design saved.',
      invitation: withMeta,
      storage: 'json',
    });
  } catch (err) {
    console.error('[api/invitations]', err);
    return res.status(500).json({ error: 'Failed to save invitation.', detail: err.message });
  }
}
