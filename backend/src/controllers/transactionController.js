import { body, query } from 'express-validator';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import Transaction from '../models/Transaction.js';

export const transactionValidation = [
  body('type').isIn(['income', 'expense']),
  body('amount').isFloat({ min: 0.01 }),
  body('category').notEmpty(),
  body('date').isISO8601()
];

export const transactionFilterValidation = [
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601()
];

export const createTransaction = async (req, res) => {
  const transaction = await Transaction.create({ ...req.body, user: req.user._id });
  res.status(201).json(transaction);
};

export const getTransactions = async (req, res) => {
  const { from, to, category, search, type } = req.query;
  const filters = { user: req.user._id };

  if (type) filters.type = type;
  if (category) filters.category = category;
  if (from || to) {
    filters.date = {};
    if (from) filters.date.$gte = new Date(from);
    if (to) filters.date.$lte = new Date(to);
  }
  if (search) {
    filters.$or = [
      { category: { $regex: search, $options: 'i' } },
      { source: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } }
    ];
  }

  const transactions = await Transaction.find(filters).sort({ date: -1 });
  res.json(transactions);
};

export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ message: 'Deleted successfully' });
};

export const exportTransactionsCSV = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).lean();
  const parser = new Parser({ fields: ['type', 'amount', 'source', 'category', 'paymentMethod', 'date', 'notes'] });
  const csv = parser.parse(transactions);

  res.header('Content-Type', 'text/csv');
  res.attachment('transactions.csv');
  res.send(csv);
};

export const exportSummaryPDF = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });
  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=summary.pdf');
  doc.pipe(res);

  doc.fontSize(20).text('Student Finance Summary', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Total Income: $${income.toFixed(2)}`);
  doc.text(`Total Expenses: $${expenses.toFixed(2)}`);
  doc.text(`Net Balance: $${(income - expenses).toFixed(2)}`);
  doc.end();
};
