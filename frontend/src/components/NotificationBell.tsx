import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import NotificationCenter from './NotificationCenter';

const NotificationBell: React.FC = () => {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const { unreadCount, isConnected } = useSocket();

  return (
    <>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsNotificationCenterOpen(true)}
          className="relative p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300"
        >
          <Bell className="h-6 w-6 text-white" />
          
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
          
          {/* Connection status indicator */}
          <div className="absolute -bottom-1 -right-1">
            {isConnected ? (
              <Wifi className="h-3 w-3 text-green-400" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-400" />
            )}
          </div>
          
          {/* Pulse animation for new notifications */}
          {unreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-xl bg-red-500/20 pointer-events-none"
            />
          )}
        </motion.button>
      </div>

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
};

export default NotificationBell;