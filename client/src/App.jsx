import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import CategoryChart from './components/CategoryChart';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend
} from './services/api';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    transactionCount: 0
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all dashboard data from the backend
  const loadDashboardData = useCallback(async () => {
    setErrorMessage('');
    try {
      const [txRes, sumRes, catRes, trendRes] = await Promise.all([
        getTransactions(),
        getSummary(),
        getCategoryBreakdown('expense'),
        getMonthlyTrend()
      ]);

      if (txRes?.data) setTransactions(txRes.data);
      if (sumRes?.data) setSummary(sumRes.data);
      if (catRes?.data) setCategoryBreakdown(catRes.data);
      if (trendRes?.data) setMonthlyTrend(trendRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setErrorMessage(
        err.message || 'Unable to connect to backend server. Ensure backend is running on port 5000.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle adding a new transaction
  const handleAddTransaction = async (newTxData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await createTransaction(newTxData);
      if (res?.data) {
        // Optimistically update transactions list
        setTransactions((prev) => [res.data, ...prev]);
        // Refresh analytics and KPIs to ensure accurate aggregations
        const [sumRes, catRes, trendRes] = await Promise.all([
          getSummary(),
          getCategoryBreakdown('expense'),
          getMonthlyTrend()
        ]);
        if (sumRes?.data) setSummary(sumRes.data);
        if (catRes?.data) setCategoryBreakdown(catRes.data);
        if (trendRes?.data) setMonthlyTrend(trendRes.data);
      }
    } catch (err) {
      console.error('Failed to create transaction:', err);
      setErrorMessage(err.message || 'Failed to create transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a transaction with optimistic UI updates
  const handleDeleteTransaction = async (id) => {
    // Preserve copy of previous state for rollback on error
    const previousTransactions = [...transactions];
    const itemToDelete = transactions.find((t) => t._id === id);

    // Optimistically remove from state
    setTransactions((prev) => prev.filter((t) => t._id !== id));

    try {
      await deleteTransaction(id);
      // Refresh KPIs and charts after confirmed deletion
      const [sumRes, catRes, trendRes] = await Promise.all([
        getSummary(),
        getCategoryBreakdown('expense'),
        getMonthlyTrend()
      ]);
      if (sumRes?.data) setSummary(sumRes.data);
      if (catRes?.data) setCategoryBreakdown(catRes.data);
      if (trendRes?.data) setMonthlyTrend(trendRes.data);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setErrorMessage('Failed to delete transaction. Reverting changes.');
      // Rollback optimistic update
      setTransactions(previousTransactions);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-between text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Top Metric KPI Cards */}
        <section>
          <KPICards summary={summary} />
        </section>

        {/* Visual Analytics Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7">
            <MonthlyTrendChart data={monthlyTrend} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-5">
            <CategoryChart data={categoryBreakdown} isLoading={isLoading} />
          </div>
        </section>

        {/* Core Operations: Add Transaction Form & Live Transaction List */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <TransactionForm
              onSubmit={handleAddTransaction}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="lg:col-span-7">
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
