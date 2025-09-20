import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <motion.div 
      className="flex items-start space-x-3"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div 
        className="flex-shrink-0"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
      >
        <motion.div 
          className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative"
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
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Bot className="h-5 w-5 text-white" />
          </motion.div>
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-3 w-3 text-yellow-400" />
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3 shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="flex items-center space-x-2">
          <motion.span 
            className="text-sm text-gray-600 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            AI is thinking...
          </motion.span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Animated progress bar */}
        <motion.div 
          className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TypingIndicator;