import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isReconnecting?: boolean;
  lastConnected?: Date;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isReconnecting = false,
  lastConnected,
  className = ''
}) => {
  const getStatusColor = () => {
    if (isReconnecting) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (isConnected) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusText = () => {
    if (isReconnecting) return 'Reconnecting...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (isReconnecting) return <Loader2 className="w-3 h-3 animate-spin" />;
    if (isConnected) return <Wifi className="w-3 h-3" />;
    return <WifiOff className="w-3 h-3" />;
  };

  const formatLastConnected = () => {
    if (!lastConnected || isConnected) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastConnected.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return 'Yesterday';
  };

  // Only show when disconnected or reconnecting
  if (isConnected && !isReconnecting) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 ${className}`}
      >
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
          {!isConnected && !isReconnecting && lastConnected && (
            <span className="text-xs opacity-75">
              ({formatLastConnected()})
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectionStatus;