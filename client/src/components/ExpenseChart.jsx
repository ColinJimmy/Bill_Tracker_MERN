import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ExpenseChart = ({ refresh }) => {
  const [stats, setStats] = useState(null);
  const [chartType, setChartType] = useState('category');
  const [period, setPeriod] = useState('month');

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`/api/expenses/stats?period=${period}`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refresh]);

  if (!stats) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  const categoryData = {
    labels: stats.categoryStats.map(item => item._id),
    datasets: [
      {
        label: 'Amount Spent',
        data: stats.categoryStats.map(item => item.total),
        backgroundColor: [
          '#ef4444', '#f97316', '#eab308', '#22c55e',
          '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Expenses by Category (${period})`
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Expense Analytics</h2>
        
        <div className="flex space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="category">By Category</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${stats.totalExpenses.total.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Transactions</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.totalExpenses.count}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Average</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${stats.totalExpenses.count > 0 ? (stats.totalExpenses.total / stats.totalExpenses.count).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        {stats.categoryStats.length > 0 ? (
          chartType === 'pie' ? (
            <Pie data={categoryData} options={chartOptions} />
          ) : (
            <Bar data={categoryData} options={chartOptions} />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for the selected period
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
