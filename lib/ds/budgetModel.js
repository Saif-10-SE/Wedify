/**
 * Multiple linear regression for wedding budget prediction (pure JS).
 * Trained on synthetic inquiryHistory with holdout metrics.
 */
import { inquiryHistory } from '@/data/ds/inquiryHistory';
import { AREA_LIST, budgetFeatureVector, areaIndex, TIER_INDEX } from '@/lib/ds/features';
import { regressionMetrics } from '@/lib/ds/metrics';

function matVec(A, x) {
  return A.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
}

function transpose(A) {
  const m = A.length;
  const n = A[0].length;
  const T = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) T[j][i] = A[i][j];
  return T;
}

function matMul(A, B) {
  const m = A.length;
  const n = B[0].length;
  const p = B.length;
  const C = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let k = 0; k < p; k++) {
      const aik = A[i][k];
      for (let j = 0; j < n; j++) C[i][j] += aik * B[k][j];
    }
  }
  return C;
}

/** Gaussian elimination solve Ax=b for small systems */
function solveLinear(Ain, bin) {
  const n = bin.length;
  const A = Ain.map((row, i) => [...row, bin[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    }
    [A[col], A[pivot]] = [A[pivot], A[col]];
    const div = A[col][col] || 1e-12;
    for (let j = col; j <= n; j++) A[col][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = A[r][col];
      for (let j = col; j <= n; j++) A[r][j] -= f * A[col][j];
    }
  }
  return A.map((row) => row[n]);
}

function trainOLS(X, y) {
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  // ridge for stability
  for (let i = 0; i < XtX.length; i++) XtX[i][i] += 1e-4;
  const Xty = matVec(Xt, y);
  return solveLinear(XtX, Xty);
}

function rowFromInquiry(row) {
  return budgetFeatureVector({
    guests: row.guests,
    events: row.events,
    tierIndex: row.tierIndex ?? TIER_INDEX[row.tier] ?? 1,
    areaIdx: areaIndex(row.area),
    priceMin: row.priceMin,
  });
}

function splitTrainTest(rows, testRatio = 0.2) {
  const copy = [...rows];
  // deterministic shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (i * 17 + 13) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const nTest = Math.max(20, Math.floor(copy.length * testRatio));
  return { train: copy.slice(nTest), test: copy.slice(0, nTest) };
}

const { train, test } = splitTrainTest(inquiryHistory);
const Xtrain = train.map(rowFromInquiry);
const ytrain = train.map((r) => r.totalBudget);
const coefficients = trainOLS(Xtrain, ytrain);

const Xtest = test.map(rowFromInquiry);
const ytest = test.map((r) => r.totalBudget);
const yPredTest = Xtest.map((x) => matVec([x], coefficients)[0]);
const holdoutMetrics = regressionMetrics(ytest, yPredTest);

const FEATURE_NAMES = ['intercept', 'guests_scaled', 'events', 'tierIndex', 'areaIndex_scaled', 'priceMin_k'];

export function getBudgetModelInfo() {
  const importance = FEATURE_NAMES.map((name, i) => ({
    feature: name,
    coefficient: Number(coefficients[i].toFixed(2)),
    absImportance: Math.abs(coefficients[i]),
  }))
    .filter((f) => f.feature !== 'intercept')
    .sort((a, b) => b.absImportance - a.absImportance);

  const maxAbs = Math.max(...importance.map((i) => i.absImportance), 1);
  return {
    method: 'Multiple linear regression (OLS + light ridge) on synthetic inquiry history',
    featureNames: FEATURE_NAMES,
    coefficients: coefficients.map((c) => Number(c.toFixed(4))),
    metrics: holdoutMetrics,
    importance: importance.map((i) => ({
      ...i,
      relative: Number(((i.absImportance / maxAbs) * 100).toFixed(1)),
    })),
    trainSize: train.length,
    testSize: test.length,
  };
}

/**
 * @param {{ guests: number, events?: number, area?: string, tier?: string, priceMin?: number }} input
 */
export function predictBudget(input = {}) {
  const guests = Number(input.guests) || 500;
  const events = Number(input.events) || 3;
  const tier = input.tier || 'premium';
  const tierIndex = TIER_INDEX[tier] ?? 2;
  const areaIdx = areaIndex(input.area || AREA_LIST[0]);
  const priceMin = Number(input.priceMin) || (tier === 'luxury' ? 7500 : tier === 'premium' ? 5000 : tier === 'mid' ? 3500 : 2200);

  const x = budgetFeatureVector({ guests, events, tierIndex, areaIdx, priceMin });
  const predicted = matVec([x], coefficients)[0];
  const rmse = holdoutMetrics.rmse || predicted * 0.15;
  return {
    predictedTotal: Math.round(Math.max(0, predicted)),
    low: Math.round(Math.max(0, predicted - rmse)),
    high: Math.round(predicted + rmse),
    perHead: Math.round(Math.max(0, predicted) / Math.max(1, guests)),
    input: { guests, events, area: input.area || AREA_LIST[0], tier, priceMin },
    metrics: holdoutMetrics,
  };
}
