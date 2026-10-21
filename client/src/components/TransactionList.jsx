import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  Tag,
  Search,
  X,
  Download,
  ArrowUpDown,
  AlertCircle,
  Check,
  RotateCcw
} from 'lucide-react';

const CATEGORY_STYLES = {
  Food: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Rent: 'bg-purple-50 text-purple-700 border-purple-200/60',
  Travel: 'bg-sky-50 text-sky-700 border-sky-200/60',
  Utilities: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
  Entertainment: 'bg-pink-50 text-pink-700 border-pink-200/60',
  Salary: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Freelance: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Investment: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  Gift: 'bg-violet-50 text-violet-700 border-violet-200/60',
  Other: 'bg-slate-100 text-slate-700 border-slate-200/80'
};

const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Travel', 'Utilities', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

export default function TransactionList({
  transactions = [],
  onDelete,
  isLoading = false
}) {
  // Filter and Search States
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'
  const [filterMonth, setFilterMonth] = useState('all'); // 'all' | 'YYYY-MM'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | categoryName
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  // Safety state for delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Extract all distinct months available across transactions
  const availableMonths = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const monthsMap = new Map();

    transactions.forEach((tx) => {
      try {
        const d = new Date(tx.date);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          if (!monthsMap.has(key)) {
            monthsMap.set(key, { key, label, time: d.getTime() });
          }
        }
      } catch {
        // ignore invalid dates
      }
    });

    return Array.from(monthsMap.values()).sort((a, b) => b.time - a.time);
  }, [transactions]);

  // Contextual categories based on selected transaction type
  const availableCategories = useMemo(() => {
    if (filterType === 'expense') return EXPENSE_CATEGORIES;
    if (filterType === 'income') return INCOME_CATEGORIES;

    // Combine standard and any custom categories present in transactions
    const unique = new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]);
    transactions.forEach((t) => {
      if (t.category) unique.add(t.category);
    });
    return Array.from(unique);
  }, [filterType, transactions]);

  // Handle Type Filter Change
  const handleTypeChange = (newType) => {
    setFilterType(newType);
    // Reset category filter if previous category doesn't apply to new type
    if (newType === 'expense' && !EXPENSE_CATEGORIES.includes(filterCategory)) {
      setFilterCategory('all');
    } else if (newType === 'income' && !INCOME_CATEGORIES.includes(filterCategory)) {
      setFilterCategory('all');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterType('all');
    setFilterMonth('all');
    setFilterCategory('all');
    setSearchQuery('');
    setSortBy('date-desc');
  };

  const isFilterActive =
    filterType !== 'all' ||
    filterMonth !== 'all' ||
    filterCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'date-desc';

  // Apply filtering and sorting
  const filteredItems = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    let result = transactions.filter((item) => {
      // 1. Type Filter
      if (filterType !== 'all' && item.type !== filterType) {
        return false;
      }

      // 2. Month Filter (YYYY-MM)
      if (filterMonth !== 'all') {
        try {
          const d = new Date(item.date);
          const itemMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (itemMonth !== filterMonth) return false;
        } catch {
          return false;
        }
      }

      // 3. Category Filter
      if (filterCategory !== 'all') {
        if (item.category?.toLowerCase() !== filterCategory.toLowerCase()) {
          return false;
        }
      }

      // 4. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        if (!titleMatch && !catMatch) return false;
      }

      return true;
    });

    // 5. Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      const amtA = Number(a.amount) || 0;
      const amtB = Number(b.amount) || 0;

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'amount-desc':
          return amtB - amtA;
        case 'amount-asc':
          return amtA - amtB;
        case 'date-desc':
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [transactions, filterType, filterMonth, filterCategory, searchQuery, sortBy]);

  // Export filtered transactions to CSV
  const handleExportCSV = () => {
    if (filteredItems.length === 0) return;

    const headers = ['Title', 'Type', 'Category', 'Amount (RS)', 'Date'];
    const rows = filteredItems.map((item) => [
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.type,
      item.category,
      item.amount,
      new Date(item.date).toISOString().split('T')[0]
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
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
      {/* Top Header: Title, Count & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                {filteredItems.length} {filteredItems.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {transactions.length > 0 && filteredItems.length !== transactions.length
                ? `Showing ${filteredItems.length} of ${transactions.length} total records`
                : 'Audited financial ledger'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export to CSV Button */}
          {filteredItems.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 bg-white hover:bg-indigo-50/50 transition-all shadow-sm"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          {/* Clear Filters Button (shows when any filter is active) */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Filter Tabs: All | Expenses | Income */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTypeChange('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'expense'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expenses Only
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'income'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income Only
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Advanced Filter Bar: Search, Month Filter & Category Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-5">
        {/* Search Bar */}
        <div className="sm:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search by note or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Month Filter Dropdown */}
        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category / Expense-wise Filter Dropdown */}
        <div className="sm:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          >
            <option value="all">
              {filterType === 'expense'
                ? 'All Expenses'
                : filterType === 'income'
                ? 'All Incomes'
                : 'All Categories'}
            </option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {isFilterActive && (
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="text-slate-400 font-medium">Active filters:</span>
          {filterType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Type: {filterType}
              <button onClick={() => setFilterType('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterMonth !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Month: {availableMonths.find((m) => m.key === filterMonth)?.label || filterMonth}
              <button onClick={() => setFilterMonth('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filterCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
              Category: {filterCategory}
              <button onClick={() => setFilterCategory('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200">
              Keyword: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Transactions Table Container */}
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
                <td colSpan="5" className="py-12 text-center text-slate-400 text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400 text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600">No transactions match your criteria</p>
                    <p className="text-[11px] text-slate-400">
                      {isFilterActive
                        ? 'Try adjusting your month, category, or search filters.'
                        : 'Record a new income or expense using the form to get started.'}
                    </p>
                    {isFilterActive && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs transition"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((tx) => {
                const isExpense = tx.type === 'expense';
                const badgeStyle = CATEGORY_STYLES[tx.category] || CATEGORY_STYLES.Other;
                const isConfirming = confirmDeleteId === tx._id;

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
                      {isConfirming ? (
                        <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg p-1 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => {
                              onDelete && onDelete(tx._id);
                              setConfirmDeleteId(null);
                            }}
                            className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 text-[10px] font-bold"
                            title="Confirm Delete"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1 rounded text-slate-600 hover:bg-slate-200 text-[10px]"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(tx._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
