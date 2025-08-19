import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../config/api';
import {
  Bell,
  CheckCircle,
  Gift,
  AlertCircle,
  Trash2,
  Loader,
  RefreshCw,
  Calendar,
  User,
  DollarSign,
  Sparkles,
  Square,
  CheckSquare,
  Minus
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        unreadOnly: filter === 'unread'
      };

      const response = await notificationAPI.getNotifications(params);
      setNotifications(response.data.notifications);
      setPagination(response.data.pagination);
      setUnreadCount(response.data.unreadCount);
      setSelectedNotifications(new Set()); // Clear selections when fetching new data
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds = []) => {
    try {
      await notificationAPI.markAsRead(notificationIds);
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n._id)));
    }
  };

  const handleSelectNotification = (notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedNotifications.size === 0) return;

    try {
      setIsDeleting(true);
      const notificationIds = Array.from(selectedNotifications);
      await notificationAPI.bulkDeleteNotifications(notificationIds);
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error bulk deleting notifications:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get selection state for select all checkbox
  const getSelectAllState = () => {
    if (selectedNotifications.size === 0) return 'none';
    if (selectedNotifications.size === notifications.length) return 'all';
    return 'partial';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'purchase':
        return <Gift className="w-5 h-5 text-green-500" />;
      case 'earning':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'promotion':
        return <Gift className="w-5 h-5 text-pink-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type, isRead) => {
    if (isRead) return 'bg-gray-50 dark:bg-gray-800';
    
    switch (type) {
      case 'welcome':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'purchase':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'earning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'system':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'promotion':
        return 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800';
      case 'warning':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return notificationDate.toLocaleDateString();
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            {selectedNotifications.size > 0 && (
              <span className="ml-2 text-primary-600 dark:text-primary-400">
                • {selectedNotifications.size} selected
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedNotifications.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Delete Selected ({selectedNotifications.size})</span>
            </button>
          )}

          <button
            onClick={() => markAsRead([])}
            disabled={unreadCount === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: 'Read' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key);
              setPage(1);
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Select All Section */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {getSelectAllState() === 'all' ? (
                <CheckSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              ) : getSelectAllState() === 'partial' ? (
                <Minus className="w-5 h-5 text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 rounded" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className="font-medium">
                {getSelectAllState() === 'all' ? 'Deselect All' : 'Select All'}
              </span>
            </button>

            {selectedNotifications.size > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedNotifications.size} of {notifications.length} selected
              </span>
            )}
          </div>

          {selectedNotifications.size > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => markAsRead(Array.from(selectedNotifications))}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Read</span>
              </button>

              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'unread' ? "You're all caught up!" : "No notifications to show."}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border transition-all duration-200 ${getNotificationBgColor(notification.type, notification.isRead)} ${
                !notification.isRead ? 'border-l-4' : 'border'
              } ${selectedNotifications.has(notification._id) ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <button
                    onClick={() => handleSelectNotification(notification._id)}
                    className="mr-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {selectedNotifications.has(notification._id) ? (
                      <CheckSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        notification.isRead 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        notification.isRead 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(notification.createdAt)}
                        </span>
                        
                        {notification.data?.promoCode && (
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full font-mono">
                            {notification.data.promoCode}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead([notification._id])}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          
          <span className="px-3 py-2 text-gray-600 dark:text-gray-400">
            Page {page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
