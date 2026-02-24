import { body } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const user = await User.create({ name, email, password });
  return res.status(201).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget, darkMode: user.darkMode }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget, darkMode: user.darkMode }
  });
};

export const getProfile = async (req, res) => res.json(req.user);

export const updateProfile = async (req, res) => {
  const { name, monthlyBudget, darkMode } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name ?? user.name;
  user.monthlyBudget = monthlyBudget ?? user.monthlyBudget;
  user.darkMode = darkMode ?? user.darkMode;
  await user.save();

  return res.json({ id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget, darkMode: user.darkMode });
};
