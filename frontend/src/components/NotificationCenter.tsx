import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  BookOpen, 
  Users, 
  Award, 
  CreditCard, 
  Megaphone,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, clearNotifications } = useSocket();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'attendance':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'grade':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'announcement':
        return <Megaphone className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="h-6 w-6 text-gray-700" />
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </motion.div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Bell className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative group cursor-pointer transition-all duration-300 ${
                          notification.read 
                            ? 'bg-gray-50/50' 
                            : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 shadow-md'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="p-4 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className={`font-semibold ${
                                  notification.read ? 'text-gray-600' : 'text-gray-800'
                                }`}>
                                  {notification.title}
                                </h4>
                                <div className="flex items-center gap-2 ml-2">
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                  <Clock className="h-3 w-3 text-gray-400" />
                                </div>
                              </div>
                              <p className={`text-sm mt-1 ${
                                notification.read ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Read indicator */}
                        {notification.read && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;