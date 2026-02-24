import Transaction from '../models/Transaction.js';

export const getDashboardAnalytics = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: 1 });

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const byCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const monthlyTrend = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toISOString().slice(0, 7);
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (t.type === 'income') acc[month].income += t.amount;
    else acc[month].expense += t.amount;
    return acc;
  }, {});

  const topSpendingCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  res.json({
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    byCategory,
    monthlyTrend: Object.values(monthlyTrend),
    topSpendingCategory,
    recentTransactions: transactions.slice(-5).reverse()
  });
};
