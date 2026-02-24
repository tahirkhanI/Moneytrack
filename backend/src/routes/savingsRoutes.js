import express from 'express';
import {
  contributeToGoal,
  createGoal,
  deleteGoal,
  getGoals,
  goalValidation
} from '../controllers/savingsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidation } from '../middleware/validateMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.use(protect);
router.get('/', getGoals);
router.post('/', goalValidation, handleValidation, createGoal);
router.post('/:id/contribute', body('amount').isFloat({ min: 0.01 }), handleValidation, contributeToGoal);
router.delete('/:id', deleteGoal);

export default router;
