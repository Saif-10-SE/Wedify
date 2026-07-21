// Digital wedding invitation card templates for Wedify

export const invitationTemplates = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    description: 'Timeless ivory card with gold foil accents and serif typography.',
    layout: 'classic',
    theme: {
      background: 'linear-gradient(160deg, #fffaf3 0%, #f3e6d0 100%)',
      border: '#c9a227',
      accent: '#8b6914',
      text: '#3d2f1f',
      muted: '#7a6a55',
      panel: 'rgba(201, 162, 39, 0.12)'
    },
    ornament: '✦'
  },
  {
    id: 'royal-burgundy',
    name: 'Royal Burgundy',
    description: 'Rich burgundy backdrop with gold lettering for a regal feel.',
    layout: 'royal',
    theme: {
      background: 'linear-gradient(165deg, #5c1835 0%, #7a2846 55%, #3d1024 100%)',
      border: '#d4af37',
      accent: '#f0d78c',
      text: '#fff8ee',
      muted: '#e8c9a8',
      panel: 'rgba(212, 175, 55, 0.15)'
    },
    ornament: '❖'
  },
  {
    id: 'floral-blush',
    name: 'Floral Blush',
    description: 'Soft blush pink with romantic floral-inspired framing.',
    layout: 'floral',
    theme: {
      background: 'linear-gradient(160deg, #fff5f7 0%, #f8dce3 100%)',
      border: '#c97b8a',
      accent: '#a8485c',
      text: '#4a2c34',
      muted: '#8a5a66',
      panel: 'rgba(201, 123, 138, 0.14)'
    },
    ornament: '❀'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean white layout with sharp typography and subtle lines.',
    layout: 'minimal',
    theme: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f4f4f2 100%)',
      border: '#2c2c2c',
      accent: '#1a1a1a',
      text: '#1a1a1a',
      muted: '#666666',
      panel: 'rgba(0, 0, 0, 0.04)'
    },
    ornament: '—'
  },
  {
    id: 'garden-green',
    name: 'Garden Green',
    description: 'Fresh botanical greens for outdoor and lawn celebrations.',
    layout: 'garden',
    theme: {
      background: 'linear-gradient(160deg, #f4faf5 0%, #d8eadc 100%)',
      border: '#4f7a5a',
      accent: '#2f5d3f',
      text: '#1f3a28',
      muted: '#5a7a64',
      panel: 'rgba(79, 122, 90, 0.12)'
    },
    ornament: '❧'
  },
  {
    id: 'midnight-luxe',
    name: 'Midnight Luxe',
    description: 'Deep midnight navy with champagne highlights for evening walimas.',
    layout: 'midnight',
    theme: {
      background: 'linear-gradient(165deg, #0f1b2d 0%, #1a2f4a 55%, #0b1420 100%)',
      border: '#c8b48a',
      accent: '#e6d5b0',
      text: '#f7f1e6',
      muted: '#b8a88a',
      panel: 'rgba(200, 180, 138, 0.14)'
    },
    ornament: '✧'
  }
];

export const eventTypes = ['Mehndi', 'Barat', 'Walima', 'Nikkah', 'Reception'];

export function getInvitationTemplate(id) {
  return invitationTemplates.find((t) => t.id === id) || invitationTemplates[0];
}

export function formatInvitationDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatMembersLabel(count) {
  const n = Number(count) || 1;
  if (n <= 1) return 'you are warmly invited';
  if (n === 2) return 'you and 1 guest are warmly invited';
  return `you and ${n - 1} accompanying guests are warmly invited`;
}

export function buildInviteShareText({ brideName, groomName, eventType, date, time, venue, guestName, members, message }) {
  const when = [formatInvitationDate(date), time].filter(Boolean).join(' · ');
  const lines = [
    `💐 Wedding Invitation`,
    '',
    `Dear ${guestName || 'Guest'},`,
    '',
    `${brideName || 'Bride'} & ${groomName || 'Groom'} request the pleasure of your company at their ${eventType || 'Wedding'}.`,
    formatMembersLabel(members).replace(/^./, (c) => c.toUpperCase()) + '.',
    '',
    when ? `📅 ${when}` : null,
    venue ? `📍 ${venue}` : null,
    message ? `\n${message}` : null,
    '',
    '— Created with Wedify'
  ].filter((line) => line !== null);

  return lines.join('\n');
}

export const STORAGE_KEY = 'wedify_invitation_designs';

export function loadSavedDesigns() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistSavedDesigns(designs) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
}

export function createEmptyInvitation(templateId = 'classic-gold') {
  return {
    id: `inv_${Date.now()}`,
    templateId,
    brideName: '',
    groomName: '',
    eventType: 'Barat',
    date: '',
    time: '7:00 PM',
    venue: '',
    message: 'Your presence will make our day complete.',
    rsvpNote: 'Please RSVP at your earliest convenience.',
    guests: [{ id: `g_${Date.now()}`, name: '', members: 2 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
