import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Upload, BarChart3, Brain, Shield, Zap, FileText, ArrowRight, CheckCircle, Calendar, TrendingUp, PieChart, DollarSign } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Upload className="w-8 h-8 text-blue-500" />,
      title: 'Easy Upload',
      description: 'Simply drag and drop your receipts, bills, or invoices'
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      title: 'Daily Expense Logging',
      description: 'Manually log daily expenses with smart categorization'
    },
    {
      icon: <Brain className="w-8 h-8 text-green-500" />,
      title: 'AI-Powered OCR',
      description: 'Advanced OCR and AI extract key information automatically'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
      title: 'Smart Analytics',
      description: 'Visualize spending patterns with interactive charts'
    },
    {
      icon: <Calendar className="w-8 h-8 text-cyan-500" />,
      title: 'Weekly/Monthly Reports',
      description: 'Get comprehensive summaries and spending insights'
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      title: 'Auto Categorization',
      description: 'AI automatically categorizes your expenses'
    },
    {
      icon: <PieChart className="w-8 h-8 text-indigo-500" />,
      title: 'Visual Analytics',
      description: 'Interactive charts, graphs, and spending breakdowns'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-500" />,
      title: 'Trend Analysis',
      description: 'Track spending trends and identify patterns over time'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: 'Real-time Processing',
      description: 'Get instant summaries and insights'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure'
    }
  ];

  const benefits = [
    'Log daily expenses manually or via receipt upload',
    'Get detailed weekly and monthly spending summaries',
    'View interactive charts and visual analytics',
    'Track spending trends and patterns over time',
    'Save time on manual expense tracking',
    'Get AI-powered spending insights and recommendations',
    'Organize receipts and expenses automatically',
    'Set budget goals and spending alerts',
    'Export detailed reports for tax purposes',
    'Compare spending across different time periods'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 -mt-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered Expense Tracker & Analytics
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Track daily expenses, upload receipts, and get intelligent weekly/monthly summaries with powerful visual analytics to understand your spending patterns.
          </p>
          
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="ml-2" size={20} />
            </Link>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powerful Features for Complete Expense Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From daily expense logging to comprehensive analytics - everything you need to master your finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Multiple Ways to Track Your Expenses
            </h2>
            <p className="text-xl text-gray-600">
              Choose the method that works best for you - or use both!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Receipt Upload Flow */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">Receipt Upload Method</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Upload Receipt</h4>
                    <p className="text-gray-600 text-sm">Take a photo or upload an image of your receipt</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">AI Processing</h4>
                    <p className="text-gray-600 text-sm">AI extracts amount, date, merchant, and category</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Auto-Categorized</h4>
                    <p className="text-gray-600 text-sm">Expense is automatically logged and categorized</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Entry Flow */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">Manual Entry Method</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-emerald-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Quick Entry</h4>
                    <p className="text-gray-600 text-sm">Enter amount, merchant, and select category</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-cyan-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Suggestions</h4>
                    <p className="text-gray-600 text-sm">AI suggests categories based on merchant and amount</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-indigo-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Instant Analytics</h4>
                    <p className="text-gray-600 text-sm">View updated charts and spending insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Flow */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-8">Get Comprehensive Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Daily Tracking</h4>
                <p className="text-xs text-gray-600">Monitor daily spending habits</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Weekly Reports</h4>
                <p className="text-xs text-gray-600">Detailed weekly summaries</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Monthly Analytics</h4>
                <p className="text-xs text-gray-600">Comprehensive monthly insights</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Trend Analysis</h4>
                <p className="text-xs text-gray-600">Long-term spending patterns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Complete Expense Management Solution
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to take control of your finances
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Key Benefits</h3>
                <div className="grid grid-cols-1 gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="text-green-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Analytics Dashboard Preview</h3>
                <p className="text-gray-600 mb-6">
                  Get powerful insights with visual analytics including spending trends, category breakdowns, and monthly comparisons.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      Food & Dining
                    </span>
                    <span className="font-semibold">$450</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Transportation
                    </span>
                    <span className="font-semibold">$280</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      Shopping
                    </span>
                    <span className="font-semibold">$320</span>
                  </div>
                </div>

                {!user && (
                  <Link
                    to="/register"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                  >
                    Start Tracking Today
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take Control of Your Finances Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start logging expenses and get intelligent insights with weekly and monthly analytics!
          </p>
          {user ? (
            <div className="flex justify-center space-x-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Log Daily Expenses
                <DollarSign className="ml-2" size={20} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Upload Receipt
                <Upload className="ml-2" size={20} />
              </Link>
            </div>
          ) : (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Now - It's Free!
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
