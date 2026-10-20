import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart3, AlertCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyTrendChart({ data = [], isLoading = false }) {
  const hasData = data && data.length > 0;

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Income',
        data: data.map((item) => item.income),
        backgroundColor: '#10b981', // Emerald
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.7
      },
      {
        label: 'Expense',
        data: data.map((item) => item.expense),
        backgroundColor: '#f43f5e', // Rose
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.7
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
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
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            const formatted = Number(value).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            return ` ${label}: RS ${formatted}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#64748b',
          callback: (value) => {
            if (value >= 1000) {
              return `RS ${(value / 1000).toFixed(1)}k`;
            }
            return `RS ${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Cashflow Trend</h3>
            <p className="text-xs text-slate-500">Income vs. Expense over past 6 months</p>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full flex items-center justify-center">
        {isLoading ? (
          <p className="text-xs text-slate-400">Loading trend...</p>
        ) : !hasData ? (
          <div className="text-center p-6 text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">No trend data available</p>
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
