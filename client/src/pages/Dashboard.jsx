import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Track your expenses and gain insights with AI-powered analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-1">
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-2">
            <ExpenseChart refresh={refreshKey} />
          </div>
        </div>

        {/* Expense List */}
        <div className="mt-8">
          <ExpenseList refresh={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
