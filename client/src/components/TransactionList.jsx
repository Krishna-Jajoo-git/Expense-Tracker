import React, { useState } from 'react';
import { Trash2, Receipt, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

const CATEGORY_STYLES = {
  Food: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Rent: 'bg-purple-50 text-purple-700 border-purple-200/60',
  Travel: 'bg-sky-50 text-sky-700 border-sky-200/60',
  Utilities: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
  Entertainment: 'bg-pink-50 text-pink-700 border-pink-200/60',
  Salary: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Freelance: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Investment: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  Other: 'bg-slate-100 text-slate-700 border-slate-200/80'
};

const DEFAULT_MOCK_TRANSACTIONS = [
  {
    _id: 'mock-1',
    title: 'Monthly Tech Salary',
    amount: 4500,
    category: 'Salary',
    type: 'income',
    date: '2026-10-01T00:00:00.000Z'
  },
  {
    _id: 'mock-2',
    title: 'Apartment Monthly Rent',
    amount: 1200,
    category: 'Rent',
    type: 'expense',
    date: '2026-10-02T00:00:00.000Z'
  },
  {
    _id: 'mock-3',
    title: 'Whole Foods Market',
    amount: 250,
    category: 'Food',
    type: 'expense',
    date: '2026-10-05T00:00:00.000Z'
  },
  {
    _id: 'mock-4',
    title: 'High-speed Fiber Internet',
    amount: 75,
    category: 'Utilities',
    type: 'expense',
    date: '2026-10-08T00:00:00.000Z'
  }
];

export default function TransactionList({
  transactions = [],
  onDelete,
  isLoading = false
}) {
  const [filterType, setFilterType] = useState('all');

  const itemsToDisplay = transactions && transactions.length > 0
    ? transactions
    : DEFAULT_MOCK_TRANSACTIONS;

  const filteredItems = itemsToDisplay.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    const val = Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `RS ${val}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredItems.length} record{filteredItems.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'expense'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'income'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3">Transaction</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3 text-right">Amount</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                  Loading transactions...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                  No transactions match the selected filter.
                </td>
              </tr>
            ) : (
              filteredItems.map((tx) => {
                const isExpense = tx.type === 'expense';
                const badgeStyle = CATEGORY_STYLES[tx.category] || CATEGORY_STYLES.Other;

                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isExpense
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {isExpense ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{tx.title}</p>
                          <p className="text-[11px] text-slate-400 sm:hidden">
                            {formatDate(tx.date)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}
                      >
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold whitespace-nowrap">
                      <span className={isExpense ? 'text-rose-600' : 'text-emerald-600'}>
                        {isExpense ? '- ' : '+ '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(tx._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
