/**
 * Synthetic guest RSVP / attendance history for logistic regression.
 */
function mulberry32(a) {
  return function rand() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20263332005);

const RELATIONSHIPS = [
  'Family',
  'Close Family',
  'Relative',
  'Friend',
  'Colleague',
  'Neighbor',
  'College Friend',
  'Distant Relative',
];

function sigmoid(z) {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

function buildRsvpHistory(count = 480) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const members = 1 + Math.floor(rand() * 6);
    const leadDays = 3 + Math.floor(rand() * 60);
    const relationship = RELATIONSHIPS[Math.floor(rand() * RELATIONSHIPS.length)];
    const isFamily = /family|relative/i.test(relationship) ? 1 : 0;
    const pastRsvpRate = Number((0.35 + rand() * 0.55).toFixed(2));
    // Latent probability — family + higher past rate + more lead time ⇒ more likely
    const z =
      -0.4 +
      0.18 * members +
      0.9 * isFamily +
      1.4 * pastRsvpRate +
      0.7 * (leadDays / 30) -
      (leadDays < 7 ? 0.8 : 0) +
      (rand() - 0.5) * 0.6;
    const p = sigmoid(z);
    const attended = rand() < p ? 1 : 0;

    rows.push({
      id: `guest-${i + 1}`,
      name: `Guest ${i + 1}`,
      members,
      leadDays,
      relationship,
      pastRsvpRate,
      attended,
      trueProb: Number(p.toFixed(3)),
    });
  }
  return rows;
}

export const rsvpHistory = buildRsvpHistory(480);
export { RELATIONSHIPS };
