import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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

      {/* Sidebar toggle button for mobile */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-600 text-white p-4 rounded-full shadow-xl hover:bg-primary-700 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}
    </div>
  );
};

export default Layout;
