import React from 'react';
import { Bot, User, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const isHindiOrRajasthani = message.language === 'hi' || message.language === 'raj';

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return '';
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div 
      className={`flex items-start space-x-3 ${isBot ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.02 }}
    >
      {isBot && (
        <motion.div 
          className="flex-shrink-0"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          <motion.div 
            className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)"
            }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 8px rgba(59, 130, 246, 0.1)",
                "0 0 0 0 rgba(59, 130, 246, 0.4)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Bot className="h-5 w-5 text-white" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-3 w-3 text-yellow-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <motion.div 
        className={`max-w-xs lg:max-w-md ${isBot ? 'order-1' : 'order-2'}`}
        initial={{ opacity: 0, x: isBot ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.div
          className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
            isBot
              ? 'bg-white/90 border border-gray-200/50 text-gray-900'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          } ${isHindiOrRajasthani ? 'hindi-text' : ''}`}
          whileHover={{
            scale: 1.02,
            boxShadow: isBot 
              ? "0 10px 30px rgba(0, 0, 0, 0.1)"
              : "0 10px 30px rgba(59, 130, 246, 0.3)"
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.p 
            className="text-sm whitespace-pre-wrap leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {message.content}
          </motion.p>
          
          {isBot && message.confidence !== undefined && (
            <motion.div 
              className="mt-3 pt-3 border-t border-gray-100/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-xs">
                <motion.span 
                  className={`font-semibold px-2 py-1 rounded-full ${getConfidenceColor(message.confidence)} bg-white/50`}
                  whileHover={{ scale: 1.05 }}
                >
                  Confidence: {Math.round(message.confidence)}%
                </motion.span>
                {message.intent && (
                  <motion.span 
                    className="text-gray-500 bg-gray-100/50 px-2 py-1 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    Intent: {message.intent}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className={`mt-2 flex items-center space-x-2 text-xs text-gray-500 ${
            isBot ? 'justify-start' : 'justify-end'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="h-3 w-3" />
          </motion.div>
          <span>{formatTime(message.timestamp)}</span>
          {message.language !== 'en' && (
            <motion.span 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md"
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)"
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              {message.language.toUpperCase()}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {!isBot && (
        <motion.div 
          className="flex-shrink-0 order-3"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          <motion.div 
            className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 8px 20px rgba(75, 85, 99, 0.4)"
            }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(75, 85, 99, 0.4)",
                "0 0 0 6px rgba(75, 85, 99, 0.1)",
                "0 0 0 0 rgba(75, 85, 99, 0.4)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <User className="h-5 w-5 text-white" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageBubble;