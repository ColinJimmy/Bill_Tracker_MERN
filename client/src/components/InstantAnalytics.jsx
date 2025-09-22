import React, { useMemo } from 'react';
import { PieChart, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

const InstantAnalytics = ({ expenses = [] }) => {
  const analytics = useMemo(() => {
    if (!expenses.length) return null;

    // Calculate total spending
    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Group by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Sort categories by amount
    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Calculate today's spending
    const today = new Date().toISOString().split('T')[0];
    const todaySpending = expenses
      .filter(expense => expense.date === today)
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate this week's spending
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekSpending = expenses
      .filter(expense => new Date(expense.date) >= weekStart)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalSpending,
      categoryTotals: sortedCategories,
      todaySpending,
      weekSpending,
      expenseCount: expenses.length
    };
  }, [expenses]);

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="text-blue-600 mr-2" size={24} />
          <h2 className="text-2xl font-semibold text-gray-800">Instant Analytics</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <PieChart className="mx-auto mb-4" size={48} />
          <p>Add some expenses to see your analytics!</p>
        </div>
      </div>
    );
  }

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="text-blue-600 mr-2" size={24} />
        <h2 className="text-2xl font-semibold text-gray-800">Instant Analytics</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-xl font-bold text-blue-800">${analytics.totalSpending.toFixed(2)}</p>
            </div>
            <DollarSign className="text-blue-600" size={20} />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Today</p>
              <p className="text-xl font-bold text-green-800">${analytics.todaySpending.toFixed(2)}</p>
            </div>
            <BarChart3 className="text-green-600" size={20} />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">This Week</p>
              <p className="text-xl font-bold text-purple-800">${analytics.weekSpending.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-purple-600" size={20} />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Expenses</p>
              <p className="text-xl font-bold text-orange-800">{analytics.expenseCount}</p>
            </div>
            <PieChart className="text-orange-600" size={20} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <div className="space-y-3">
          {analytics.categoryTotals.map(([category, amount], index) => {
            const percentage = (amount / analytics.totalSpending) * 100;
            return (
              <div key={category} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-semibold text-gray-800">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Quick Insights</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {analytics.categoryTotals.length > 0 && (
            <li>• Your top spending category is {analytics.categoryTotals[0][0]} (${analytics.categoryTotals[0][1].toFixed(2)})</li>
          )}
          <li>• You've logged {analytics.expenseCount} expense{analytics.expenseCount !== 1 ? 's' : ''} so far</li>
          {analytics.todaySpending > 0 && (
            <li>• Today's spending: ${analytics.todaySpending.toFixed(2)}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InstantAnalytics;
