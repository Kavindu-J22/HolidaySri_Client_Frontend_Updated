import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutGrid, Sparkles } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BackgroundAnimation from '../common/BackgroundAnimation';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Load collapsed state from localStorage, default to true (collapsed)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Listen for custom openSidebar event (for desktop)
  useEffect(() => {
    const handleOpenSidebar = () => {
      setIsSidebarOpen(true);
    };

    window.addEventListener('openSidebar', handleOpenSidebar);
    return () => {
      window.removeEventListener('openSidebar', handleOpenSidebar);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative">
      {/* Background Animation */}
      <BackgroundAnimation />

      <Navbar />

      {/* Add padding-top to account for fixed navbar */}
      <div className="flex flex-1 relative z-10 pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        <main className="flex-1 lg:ml-0 flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />

      {/* Creative Sidebar Menu Button for Mobile */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed left-4 top-20 z-40">
          <button
            onClick={toggleSidebar}
            className="group relative p-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-200"
            aria-label="Open categories"
          >
            <div className="relative">
              <LayoutGrid className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
            </div>

            {/* Animated sparkle effect */}
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>

            {/* Animated pulse ring */}
            <div className="absolute inset-0 rounded-2xl transition-all duration-300 animate-pulse bg-purple-400 opacity-20"></div>

            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Browse Categories
              </div>
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
