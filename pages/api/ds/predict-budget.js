import { predictBudget, getBudgetModelInfo } from '@/lib/ds/budgetModel';

export default function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(getBudgetModelInfo());
    }
    if (req.method === 'POST') {
      return res.status(200).json({
        ...predictBudget(req.body || {}),
        model: getBudgetModelInfo(),
      });
    }
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/ds/predict-budget]', err);
    return res.status(500).json({ error: err.message || 'Budget prediction failed' });
  }
}
