import { useNavigate } from 'react-router-dom';
import { FileText, Download, Bookmark, DollarSign, LogIn } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const QuickActionsMenu = ({ onActionClick, user }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const userActions = [
    { icon: FileText, label: 'My Posts', path: '/my-posts', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Download, label: 'My Downloads', path: '/my-downloads', color: 'text-green-600 dark:text-green-400' },
    { icon: Bookmark, label: 'Saved Posts', path: '/my-saved-posts', color: 'text-yellow-600 dark:text-yellow-400' },
    { icon: DollarSign, label: 'Photo Earnings', path: '/my-photo-earnings', color: 'text-purple-600 dark:text-purple-400' },
  ];

  const handleActionClick = (path) => {
    navigate(path);
    if (onActionClick) {
      onActionClick();
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
    if (onActionClick) {
      onActionClick();
    }
  };

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div className="space-y-3">
        <div className={`text-center py-4 px-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Login to access quick actions
          </p>
          <button
            onClick={handleLoginClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <LogIn className="w-5 h-5" />
            <span>Login to Quick Action</span>
          </button>
        </div>
        {/* Show disabled action items for preview */}
        <div className="space-y-2 opacity-50 pointer-events-none">
          {userActions.map((action) => (
            <div
              key={action.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                isDarkMode
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              <action.icon className="w-5 h-5" />
              <span className="font-medium">{action.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {userActions.map((action) => (
        <button
          key={action.path}
          onClick={() => handleActionClick(action.path)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
              : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
          }`}
        >
          <action.icon className={`w-5 h-5 ${action.color}`} />
          <span className="font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsMenu;

