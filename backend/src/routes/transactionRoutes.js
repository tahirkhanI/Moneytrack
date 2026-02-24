import express from 'express';
import {
  createTransaction,
  deleteTransaction,
  exportSummaryPDF,
  exportTransactionsCSV,
  getTransactions,
  transactionFilterValidation,
  transactionValidation,
  updateTransaction
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidation } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', transactionFilterValidation, handleValidation, getTransactions);
router.post('/', transactionValidation, handleValidation, createTransaction);
router.put('/:id', transactionValidation, handleValidation, updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/export/csv', exportTransactionsCSV);
router.get('/export/pdf', exportSummaryPDF);

export default router;
