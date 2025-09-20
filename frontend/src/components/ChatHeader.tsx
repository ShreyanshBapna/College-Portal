import React from 'react';
import { MessageCircle, Wifi, WifiOff, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../types/chat';

interface ChatHeaderProps {
  currentLanguage: Language;
  isConnected: boolean;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentLanguage,
  isConnected,
  onClearChat,
}) => {
  const getLanguageDisplayName = (lang: Language): string => {
    const names = {
      en: 'English',
      hi: 'Hindi',
      raj: 'Rajasthani'
    };
    return names[lang];
  };

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-lg"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-400" />
              </motion.div>
            </motion.div>
            <motion.h1 
              className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              SIH Multilingual Campus Assistant
            </motion.h1>
          </div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-2 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              •
            </motion.span>
            <span>JECRC Foundation</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex items-center space-x-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Connection Status */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            {isConnected ? (
              <>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Wifi className="h-4 w-4 text-green-500" />
                </motion.div>
                <motion.span 
                  className="text-sm text-green-600 hidden sm:inline font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Connected
                </motion.span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <WifiOff className="h-4 w-4 text-red-500" />
                </motion.div>
                <motion.span 
                  className="text-sm text-red-600 hidden sm:inline font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Disconnected
                </motion.span>
              </>
            )}
          </motion.div>

          {/* Current Language */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm text-gray-600 hidden sm:inline">Language:</span>
            <motion.span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)"
              }}
              transition={{ duration: 0.2 }}
            >
              {getLanguageDisplayName(currentLanguage)}
            </motion.span>
          </motion.div>

          {/* Clear Chat Button */}
          <motion.button
            onClick={onClearChat}
            className="inline-flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white/90 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md backdrop-blur-sm"
            title="Clear Chat"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <RotateCcw className="h-4 w-4" />
            </motion.div>
            <span className="hidden sm:inline">Clear</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default ChatHeader;