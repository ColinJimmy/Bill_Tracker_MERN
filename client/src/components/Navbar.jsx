import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold flex items-center">
            <BarChart3 className="mr-2" size={24} />
            AI Bill Summarizer
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`flex items-center px-3 py-2 rounded transition-colors ${
                isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <Home size={18} className="mr-1" />
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center px-3 py-2 rounded transition-colors ${
                    isActive('/dashboard') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  <BarChart3 size={18} className="mr-1" />
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-2">
                  <User size={18} />
                  <span>{user.name}</span>
                  <button 
                    onClick={logout}
                    className="flex items-center px-3 py-2 rounded hover:bg-blue-500 transition-colors"
                  >
                    <LogOut size={18} className="mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded transition-colors ${
                    isActive('/login') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`px-3 py-2 rounded border border-white transition-colors ${
                    isActive('/register') ? 'bg-white text-blue-600' : 'hover:bg-white hover:text-blue-600'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
