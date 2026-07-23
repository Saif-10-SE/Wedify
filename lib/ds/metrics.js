/**
 * Evaluation metrics for regression & classification (viva-ready).
 */

export function mae(yTrue, yPred) {
  const n = yTrue.length || 1;
  let s = 0;
  for (let i = 0; i < yTrue.length; i++) s += Math.abs(yTrue[i] - yPred[i]);
  return s / n;
}

export function rmse(yTrue, yPred) {
  const n = yTrue.length || 1;
  let s = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const d = yTrue[i] - yPred[i];
    s += d * d;
  }
  return Math.sqrt(s / n);
}

export function r2Score(yTrue, yPred) {
  const n = yTrue.length || 1;
  const mean = yTrue.reduce((a, b) => a + b, 0) / n;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssTot += (yTrue[i] - mean) ** 2;
    ssRes += (yTrue[i] - yPred[i]) ** 2;
  }
  if (ssTot === 0) return 1;
  return 1 - ssRes / ssTot;
}

export function regressionMetrics(yTrue, yPred) {
  return {
    mae: Math.round(mae(yTrue, yPred)),
    rmse: Math.round(rmse(yTrue, yPred)),
    r2: Number(r2Score(yTrue, yPred).toFixed(3)),
    n: yTrue.length,
  };
}

export function confusionMatrix(yTrue, yPred, threshold = 0.5) {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const pred = yPred[i] >= threshold ? 1 : 0;
    const actual = yTrue[i] >= 0.5 ? 1 : 0;
    if (pred === 1 && actual === 1) tp += 1;
    else if (pred === 0 && actual === 0) tn += 1;
    else if (pred === 1 && actual === 0) fp += 1;
    else fn += 1;
  }
  return { tp, tn, fp, fn };
}

export function classificationMetrics(yTrue, yPred, threshold = 0.5) {
  const { tp, tn, fp, fn } = confusionMatrix(yTrue, yPred, threshold);
  const accuracy = (tp + tn) / Math.max(1, tp + tn + fp + fn);
  const precision = tp / Math.max(1, tp + fp);
  const recall = tp / Math.max(1, tp + fn);
  const f1 = (2 * precision * recall) / Math.max(1e-9, precision + recall);
  return {
    accuracy: Number(accuracy.toFixed(3)),
    precision: Number(precision.toFixed(3)),
    recall: Number(recall.toFixed(3)),
    f1: Number(f1.toFixed(3)),
    confusion: { tp, tn, fp, fn },
    n: yTrue.length,
    threshold,
  };
}
