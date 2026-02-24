import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import SavingsGoal from '../models/SavingsGoal.js';

dotenv.config();
await connectDB();

await Promise.all([User.deleteMany(), Transaction.deleteMany(), SavingsGoal.deleteMany()]);

const user = await User.create({
  name: 'Demo Student',
  email: 'student@example.com',
  password: 'password123',
  monthlyBudget: 1000
});

await Transaction.insertMany([
  { user: user._id, type: 'income', amount: 1200, source: 'Part-time Job', category: 'Salary', date: new Date(), notes: 'Monthly paycheck' },
  { user: user._id, type: 'expense', amount: 80, category: 'Food', paymentMethod: 'Card', date: new Date(), notes: 'Groceries' },
  { user: user._id, type: 'expense', amount: 45, category: 'Transport', paymentMethod: 'Cash', date: new Date(), notes: 'Bus pass' }
]);

await SavingsGoal.create({ user: user._id, title: 'New Laptop', targetAmount: 1500, currentAmount: 300 });

console.log('Seed data inserted');
await mongoose.connection.close();
