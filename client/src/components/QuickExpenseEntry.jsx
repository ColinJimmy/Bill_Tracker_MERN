import React, { useState, useEffect } from 'react';
import { DollarSign, Building2, Tag, Calendar, Plus, TrendingUp } from 'lucide-react';

const QuickExpenseEntry = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Predefined categories for smart suggestions
  const categories = {
    'McDonald\'s': 'Food & Dining',
    'Starbucks': 'Food & Dining',
    'Uber': 'Transportation',
    'Shell': 'Transportation',
    'Amazon': 'Shopping',
    'Walmart': 'Groceries',
    'Target': 'Shopping',
    'Netflix': 'Entertainment',
    'Spotify': 'Entertainment',
    'Gym': 'Health & Fitness'
  };

  const allCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Groceries',
    'Entertainment',
    'Health & Fitness',
    'Utilities',
    'Housing',
    'Education',
    'Travel',
    'Other'
  ];

  // Smart category suggestion based on merchant
  useEffect(() => {
    if (formData.merchant) {
      const merchant = formData.merchant.toLowerCase();
      const suggestions = [];
      
      // Check for exact matches
      Object.keys(categories).forEach(key => {
        if (key.toLowerCase().includes(merchant) || merchant.includes(key.toLowerCase())) {
          suggestions.push(categories[key]);
        }
      });

      // Add popular categories based on amount ranges
      const amount = parseFloat(formData.amount);
      if (amount > 0) {
        if (amount < 20) {
          suggestions.push('Food & Dining', 'Transportation');
        } else if (amount > 100) {
          suggestions.push('Shopping', 'Utilities');
        }
      }

      // Remove duplicates and limit to 3 suggestions
      const uniqueSuggestions = [...new Set(suggestions)].slice(0, 3);
      setSuggestedCategories(uniqueSuggestions);

      // Auto-select first suggestion if available
      if (uniqueSuggestions.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: uniqueSuggestions[0] }));
      }
    } else {
      setSuggestedCategories([]);
    }
  }, [formData.merchant, formData.amount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.merchant || !formData.category) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newExpense = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount),
        timestamp: new Date().toISOString()
      };
      
      onExpenseAdded(newExpense);
      
      // Reset form
      setFormData({
        amount: '',
        merchant: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Plus className="text-blue-600 mr-2" size={24} />
        <h2 className="text-2xl font-semibold text-gray-800">Quick Expense Entry</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Merchant Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="merchant"
              value={formData.merchant}
              onChange={handleInputChange}
              placeholder="Enter merchant name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Smart Category Suggestions */}
        {suggestedCategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Smart Suggestions
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {suggestedCategories.map((category, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.category === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {allCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add notes about this expense..."
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.amount || !formData.merchant || !formData.category}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Plus className="mr-2" size={20} />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuickExpenseEntry;
