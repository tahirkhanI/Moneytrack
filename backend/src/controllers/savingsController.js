import { body } from 'express-validator';
import SavingsGoal from '../models/SavingsGoal.js';

export const goalValidation = [
  body('title').notEmpty(),
  body('targetAmount').isFloat({ min: 1 })
];

export const createGoal = async (req, res) => {
  const goal = await SavingsGoal.create({ ...req.body, user: req.user._id });
  res.status(201).json(goal);
};

export const getGoals = async (req, res) => {
  const goals = await SavingsGoal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(goals);
};

export const contributeToGoal = async (req, res) => {
  const { amount } = req.body;
  const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) return res.status(404).json({ message: 'Goal not found' });

  goal.currentAmount += amount;
  goal.contributions.push({ amount });
  await goal.save();
  res.json(goal);
};

export const deleteGoal = async (req, res) => {
  const deleted = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) return res.status(404).json({ message: 'Goal not found' });
  res.json({ message: 'Goal deleted' });
};
