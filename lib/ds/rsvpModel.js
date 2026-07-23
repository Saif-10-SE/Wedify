/**
 * Logistic regression for guest attendance / RSVP prediction.
 */
import { rsvpHistory } from '@/data/ds/rsvpHistory';
import { rsvpFeatureVector } from '@/lib/ds/features';
import { classificationMetrics } from '@/lib/ds/metrics';

function sigmoid(z) {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

function dot(a, b) {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

function trainLogistic(X, y, { lr = 0.15, epochs = 400 } = {}) {
  const nFeatures = X[0].length;
  const w = Array(nFeatures).fill(0);
  for (let e = 0; e < epochs; e++) {
    const grad = Array(nFeatures).fill(0);
    for (let i = 0; i < X.length; i++) {
      const p = sigmoid(dot(w, X[i]));
      const err = p - y[i];
      for (let j = 0; j < nFeatures; j++) grad[j] += err * X[i][j];
    }
    for (let j = 0; j < nFeatures; j++) w[j] -= (lr * grad[j]) / X.length;
  }
  return w;
}

function split(rows, testRatio = 0.2) {
  const copy = [...rows];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (i * 31 + 7) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const nTest = Math.max(40, Math.floor(copy.length * testRatio));
  return { train: copy.slice(nTest), test: copy.slice(0, nTest) };
}

function toXY(rows) {
  const X = rows.map((r) =>
    rsvpFeatureVector({
      members: r.members,
      leadDays: r.leadDays,
      relationship: r.relationship,
      pastRsvpRate: r.pastRsvpRate,
    })
  );
  const y = rows.map((r) => r.attended);
  return { X, y };
}

const { train, test } = split(rsvpHistory);
const { X: Xtrain, y: ytrain } = toXY(train);
const weights = trainLogistic(Xtrain, ytrain);

const { X: Xtest, y: ytest } = toXY(test);
const probsTest = Xtest.map((x) => sigmoid(dot(weights, x)));
const holdoutMetrics = classificationMetrics(ytest, probsTest, 0.5);

const FEATURE_NAMES = ['intercept', 'members', 'leadDays_scaled', 'isFamily', 'pastRsvpRate'];

export function getRsvpModelInfo() {
  return {
    method: 'Binary logistic regression (gradient descent) on synthetic RSVP history',
    featureNames: FEATURE_NAMES,
    weights: weights.map((w) => Number(w.toFixed(4))),
    metrics: holdoutMetrics,
    trainSize: train.length,
    testSize: test.length,
  };
}

/**
 * @param {Array<{ name?: string, members?: number, leadDays?: number, relationship?: string, pastRsvpRate?: number }>} guests
 */
export function predictRsvpBatch(guests = []) {
  const predictions = guests.map((g, idx) => {
    const members = Number(g.members) || 1;
    const leadDays = Number(g.leadDays) || 21;
    const relationship = g.relationship || 'Friend';
    const pastRsvpRate = g.pastRsvpRate != null ? Number(g.pastRsvpRate) : 0.65;
    const x = rsvpFeatureVector({ members, leadDays, relationship, pastRsvpRate });
    const probability = sigmoid(dot(weights, x));
    const attend = probability >= 0.5 ? 1 : 0;
    const expectedMembers = Number((probability * members).toFixed(2));
    return {
      id: g.id || `row-${idx + 1}`,
      name: g.name || `Guest ${idx + 1}`,
      members,
      leadDays,
      relationship,
      pastRsvpRate,
      probability: Number(probability.toFixed(3)),
      attend,
      expectedMembers,
      label: attend ? 'Likely attending' : 'At risk / unlikely',
    };
  });

  const expectedHeadcount = Number(predictions.reduce((s, p) => s + p.expectedMembers, 0).toFixed(1));
  const likelyGuests = predictions.filter((p) => p.attend).length;

  return {
    predictions,
    summary: {
      guests: predictions.length,
      likelyAttendingParties: likelyGuests,
      expectedHeadcount,
      avgProbability: predictions.length
        ? Number((predictions.reduce((s, p) => s + p.probability, 0) / predictions.length).toFixed(3))
        : 0,
    },
    metrics: holdoutMetrics,
  };
}
