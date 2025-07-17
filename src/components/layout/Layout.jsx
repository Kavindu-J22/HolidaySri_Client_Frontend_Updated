import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layers, Sparkles, X } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 lg:ml-0 flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />

      {/* Creative Sidebar Menu Button for Mobile */}
      <div className="lg:hidden fixed left-4 top-20 z-40">
        <button
          onClick={toggleSidebar}
          className={`group relative p-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
            isSidebarOpen
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200'
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-200'
          }`}
          aria-label={isSidebarOpen ? 'Close categories' : 'Open categories'}
        >
          <div className="relative">
            {isSidebarOpen ? (
              <X className="w-6 h-6 transition-transform duration-300 rotate-180" />
            ) : (
              <Layers className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
            )}
          </div>

          {/* Animated sparkle effect */}
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          </div>

          {/* Animated pulse ring */}
          <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
            isSidebarOpen
              ? 'animate-pulse bg-red-400 opacity-20'
              : 'animate-pulse bg-purple-400 opacity-20'
          }`}></div>

          {/* Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {isSidebarOpen ? 'Close Categories' : 'Browse Categories'}
            </div>
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>

          {/* Category indicator badge */}
          {!isSidebarOpen && (
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-gray-900 text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
              60+
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Layout;
