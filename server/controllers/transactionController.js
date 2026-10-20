const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions with optional query filters (month, category, type)
// @route   GET /api/transactions
// @access  Public
const getTransactions = async (req, res) => {
  try {
    const { month, category, type, startDate, endDate } = req.query;
    const filter = {};

    // Filter by type (income/expense)
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      filter.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category.trim() !== '') {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Filter by month (format: YYYY-MM or YYYY-M)
    if (month) {
      const parts = month.split('-');
      if (parts.length === 2) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1; // 0-indexed for Date
        if (!isNaN(year) && !isNaN(monthIndex) && monthIndex >= 0 && monthIndex <= 11) {
          const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
          const end = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));
          filter.date = { $gte: start, $lte: end };
        }
      }
    } else if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Public
const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

    if (!title || amount === undefined || !type) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, amount, and type (income or expense)'
      });
    }

    const transaction = await Transaction.create({
      title,
      amount: Number(amount),
      category: category || 'Other',
      type: type.toLowerCase(),
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

// @desc    Update an existing transaction
// @route   PUT /api/transactions/:id
// @access  Public
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction ID format'
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    if (req.body.type) {
      req.body.type = req.body.type.toLowerCase();
    }
    if (req.body.amount !== undefined) {
      req.body.amount = Number(req.body.amount);
    }
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }

    const updated = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction ID format'
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
