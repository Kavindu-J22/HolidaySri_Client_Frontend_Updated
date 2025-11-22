import { useNavigate } from 'react-router-dom';
import { FileText, Download, Bookmark, DollarSign } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const QuickActionsMenu = ({ onActionClick }) => {
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

