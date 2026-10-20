import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart, AlertCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLOR_PALETTE = [
  '#f59e0b', // Amber (Food)
  '#a855f7', // Purple (Rent)
  '#0ea5e9', // Sky (Travel)
  '#06b6d4', // Cyan (Utilities)
  '#ec4899', // Pink (Entertainment)
  '#10b981', // Emerald (Salary/Income)
  '#6366f1', // Indigo
  '#64748b'  // Slate (Other)
];

export default function CategoryChart({ data = [], isLoading = false }) {
  const hasData = data && data.length > 0 && data.some((item) => item.total > 0);

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: COLOR_PALETTE.slice(0, data.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
            family: 'system-ui'
          },
          padding: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const formatted = Number(value).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            return ` ${label}: RS ${formatted}`;
          }
        }
      }
    }
  };

  const totalExpense = data.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Expense Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across categories</p>
          </div>
        </div>
        {hasData && (
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
            Total: RS {totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        )}
      </div>

      <div className="relative h-64 w-full flex items-center justify-center">
        {isLoading ? (
          <p className="text-xs text-slate-400">Loading breakdown...</p>
        ) : !hasData ? (
          <div className="text-center p-6 text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">No expense records found</p>
            <p className="text-[11px] text-slate-400 mt-1">Add an expense to view distribution</p>
          </div>
        ) : (
          <Doughnut data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
