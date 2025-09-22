import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import QuickExpenseEntry from '../components/QuickExpenseEntry';
import InstantAnalytics from '../components/InstantAnalytics';
import { Upload, BarChart3, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('entry');

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem(`expenses_${user?.id || 'demo'}`);
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, [user]);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem(`expenses_${user?.id || 'demo'}`, JSON.stringify(expenses));
  }, [expenses, user]);

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
    // Auto-switch to analytics tab to show instant updates
    setTimeout(() => setActiveTab('analytics'), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Track your expenses and view instant analytics</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('entry')}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'entry'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="mr-2" size={18} />
              Quick Entry
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="mr-2" size={18} />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar className="mr-2" size={18} />
              History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {activeTab === 'entry' && (
              <QuickExpenseEntry onExpenseAdded={handleExpenseAdded} />
            )}
            {activeTab === 'analytics' && (
              <InstantAnalytics expenses={expenses} />
            )}
            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expense History</h2>
                {expenses.length === 0 ? (
                  <p className="text-gray-500">No expenses recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {expenses.slice(0, 10).map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{expense.merchant}</p>
                          <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                        </div>
                        <span className="font-semibold text-lg">${expense.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Always show analytics when on entry tab */}
          {activeTab === 'entry' && (
            <div>
              <InstantAnalytics expenses={expenses} />
            </div>
          )}

          {/* Show quick entry form when on analytics tab */}
          {activeTab === 'analytics' && (
            <div>
              <QuickExpenseEntry onExpenseAdded={handleExpenseAdded} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
