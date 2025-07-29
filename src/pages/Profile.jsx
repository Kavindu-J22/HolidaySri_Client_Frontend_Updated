import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileImage from '../components/common/ProfileImage';
import {
  User,
  ChevronLeft,
  ChevronRight,
  List,
  X,
  UserCircle,
  Megaphone,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import PersonalDetails from '../components/profile/PersonalDetails';
import AgentDashboard from '../components/profile/AgentDashboard';
import Advertisements from '../components/profile/Advertisements';
import BankDetails from '../components/profile/BankDetails';

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we should navigate to specific section from navigation state
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    } else if (location.state?.isNewAgent) {
      setActiveSection('agent');
    }
  }, [location.state]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false); // Keep closed by default on desktop too
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarItems = [
    {
      id: 'personal',
      name: 'Personal Details',
      icon: UserCircle,
      description: 'Manage your personal information'
    },
    {
      id: 'bank',
      name: 'Bank Details',
      icon: CreditCard,
      description: 'Manage your banking information'
    },
    {
      id: 'advertisements',
      name: 'Advertisements',
      icon: Megaphone,
      description: 'View and manage your ads'
    },
    {
      id: 'agent',
      name: 'Agent Dashboard',
      icon: TrendingUp,
      description: 'Track your promocode & agent performance'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalDetails />;
      case 'bank':
        return <BankDetails />;
      case 'advertisements':
        return <Advertisements />;
      case 'agent':
        return <AgentDashboard />;
      default:
        return <PersonalDetails />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ProfileImage
              src={user?.profileImage}
              alt={user?.name}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name}
            </span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'w-80' : 'w-20'}
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out
          ${isMobile ? 'top-16' : ''}
          h-screen ${isMobile ? '' : 'rounded-2xl'} border-r border-gray-200 dark:border-gray-700
        `}>
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <ProfileImage
                src={user?.profileImage}
                alt={user?.name}
                size="md"
              />
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={user?.email}>
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                    ${!sidebarOpen && 'justify-center p-4'}
                  `}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <Icon className={`${sidebarOpen ? 'w-5 h-5' : 'w-7 h-7'} transition-all duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                  {sidebarOpen && (
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
