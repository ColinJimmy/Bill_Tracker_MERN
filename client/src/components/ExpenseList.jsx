import React, { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import axios from 'axios';

const ExpenseList = ({ refresh }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [refresh]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}`);
        setExpenses(expenses.filter(exp => exp._id !== id));
        toast.success('Expense deleted successfully');
      } catch (error) {
        console.error('Failed to delete expense:', error);
        toast.error('Failed to delete expense');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Utilities: 'bg-yellow-100 text-yellow-800',
      Healthcare: 'bg-red-100 text-red-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Education: 'bg-indigo-100 text-indigo-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.Other;
  };

  if (loading) {
    return <div className="text-center py-8">Loading expenses...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No expenses found. Upload your first bill to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense._id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold mr-3">{expense.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Amount:</span> ${expense.amount.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </div>
                    <div>
                      <span className="font-medium">Merchant:</span> {expense.merchant || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium">Payment:</span> {expense.paymentMethod}
                    </div>
                  </div>
                  
                  {expense.description && (
                    <p className="mt-2 text-sm text-gray-700">{expense.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedExpense(expense)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{selectedExpense.title}</h3>
              
              {selectedExpense.aiSummary && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">AI Summary:</h4>
                  <p className="text-sm text-gray-700">{selectedExpense.aiSummary}</p>
                </div>
              )}
              
              {selectedExpense.originalText && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Extracted Text:</h4>
                  <p className="text-xs text-gray-600 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                    {selectedExpense.originalText}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
