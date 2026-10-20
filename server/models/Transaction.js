const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      default: 'Other'
    },
    type: {
      type: String,
      required: [true, 'Please specify transaction type (income or expense)'],
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid type. Must be income or expense.'
      },
      lowercase: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Please provide a transaction date']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
