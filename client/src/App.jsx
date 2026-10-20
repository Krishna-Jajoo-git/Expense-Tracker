import React, { useState } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

export default function App() {
  // Initial local state for Task 3 layout shell demonstration
  const [transactions, setTransactions] = useState([
    {
      _id: 'sample-1',
      title: 'Monthly Salary',
      amount: 4500,
      category: 'Salary',
      type: 'income',
      date: '2026-10-01T00:00:00.000Z'
    },
    {
      _id: 'sample-2',
      title: 'Apartment Rent',
      amount: 1200,
      category: 'Rent',
      type: 'expense',
      date: '2026-10-02T00:00:00.000Z'
    },
    {
      _id: 'sample-3',
      title: 'Supermarket Groceries',
      amount: 250,
      category: 'Food',
      type: 'expense',
      date: '2026-10-05T00:00:00.000Z'
    },
    {
      _id: 'sample-4',
      title: 'High-speed Fiber Internet',
      amount: 75,
      category: 'Utilities',
      type: 'expense',
      date: '2026-10-08T00:00:00.000Z'
    }
  ]);

  // Derived KPI calculations for the shell
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const summary = {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };

  const handleAddTransaction = (newTx) => {
    const createdItem = {
      ...newTx,
      _id: `tx-${Date.now()}`
    };
    setTransactions((prev) => [createdItem, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric KPI Cards */}
        <section>
          <KPICards summary={summary} />
        </section>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Add Transaction Form */}
          <div className="lg:col-span-5">
            <TransactionForm onSubmit={handleAddTransaction} />
          </div>

          {/* Right Column: Recent Transactions Table */}
          <div className="lg:col-span-7">
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
