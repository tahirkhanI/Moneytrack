import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0 },
    source: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    paymentMethod: { type: String, trim: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
