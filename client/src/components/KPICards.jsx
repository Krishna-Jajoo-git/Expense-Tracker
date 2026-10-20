import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICards({ summary = { totalIncome: 0, totalExpense: 0, netBalance: 0 } }) {
  const formatCurrency = (amount) => {
    const isNegative = (amount || 0) < 0;
    const val = Math.abs(Number(amount || 0)).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${isNegative ? '-' : ''}RS ${val}`;
  };

  const isNetPositive = (summary.netBalance || 0) >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide uppercase text-slate-500">Total Balance</p>
          <div className={`p-2.5 rounded-xl ${isNetPositive ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {formatCurrency(summary.netBalance)}
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          {isNetPositive ? (
            <span className="inline-flex items-center text-emerald-600 font-semibold gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Healthy Standing
            </span>
          ) : (
            <span className="inline-flex items-center text-rose-600 font-semibold gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Deficit Attention
            </span>
          )}
          <span className="text-slate-400">• Net liquidity</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full pointer-events-none" />
      </div>

      {/* Total Income Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide uppercase text-slate-500">Total Income</p>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-600">
            {formatCurrency(summary.totalIncome)}
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <span className="inline-flex items-center font-semibold gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Cash Inflow
          </span>
          <span className="text-slate-400">• Across all streams</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full pointer-events-none" />
      </div>

      {/* Total Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide uppercase text-slate-500">Total Expenses</p>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-rose-600">
            {formatCurrency(summary.totalExpense)}
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-rose-700">
          <span className="inline-flex items-center font-semibold gap-0.5">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Cash Outflow
          </span>
          <span className="text-slate-400">• Total expenditures</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
