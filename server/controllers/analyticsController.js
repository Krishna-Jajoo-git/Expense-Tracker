const Transaction = require('../models/Transaction');

// @desc    Get financial summary (total income, total expense, net balance)
// @route   GET /api/analytics/summary
// @access  Public
const getSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransactions = 0;

    summary.forEach((item) => {
      totalTransactions += item.count;
      if (item._id === 'income') {
        totalIncome = item.total;
      } else if (item._id === 'expense') {
        totalExpense = item.total;
      }
    });

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        netBalance: Number(netBalance.toFixed(2)),
        transactionCount: totalTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

// @desc    Get expense breakdown by category for doughnut/pie charts
// @route   GET /api/analytics/category-breakdown
// @access  Public
const getCategoryBreakdown = async (req, res) => {
  try {
    const { type = 'expense' } = req.query;

    const breakdown = await Transaction.aggregate([
      {
        $match: {
          type: type.toLowerCase()
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const totalAmount = breakdown.reduce((acc, curr) => acc + curr.total, 0);

    const formattedData = breakdown.map((item) => ({
      category: item._id,
      total: Number(item.total.toFixed(2)),
      count: item.count,
      percentage: totalAmount > 0 ? Number(((item.total / totalAmount) * 100).toFixed(1)) : 0
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
      total: Number(totalAmount.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

// @desc    Get 6-month monthly trend (income vs. expense)
// @route   GET /api/analytics/monthly-trend
// @access  Public
const getMonthlyTrend = async (req, res) => {
  try {
    const now = new Date();
    // Start date is the first day of the month 5 months before current month (total 6 months)
    const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1, 0, 0, 0));

    const trend = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Build the continuous 6-month chronological sequence
    const monthlySeries = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const year = d.getUTCFullYear();
      const monthNum = d.getUTCMonth() + 1; // 1-12
      const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;
      const label = `${monthNames[d.getUTCMonth()]} ${year}`;

      const incomeItem = trend.find(
        (t) => t._id.year === year && t._id.month === monthNum && t._id.type === 'income'
      );
      const expenseItem = trend.find(
        (t) => t._id.year === year && t._id.month === monthNum && t._id.type === 'expense'
      );

      const income = incomeItem ? Number(incomeItem.total.toFixed(2)) : 0;
      const expense = expenseItem ? Number(expenseItem.total.toFixed(2)) : 0;
      const net = Number((income - expense).toFixed(2));

      monthlySeries.push({
        monthKey,
        month: label,
        income,
        expense,
        net
      });
    }

    res.status(200).json({
      success: true,
      data: monthlySeries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend
};
