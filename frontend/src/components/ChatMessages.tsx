import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types/chat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Bot, Sparkles, MessageCircle, BookOpen, Users, Award } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      {/* Animated background when empty */}
      <AnimatePresence>
        {messages.length === 0 && !isLoading && (
          <motion.div 
            className="flex flex-col items-center justify-center h-full text-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Floating icons animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[MessageCircle, BookOpen, Users, Award].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute text-blue-200"
                  style={{
                    left: `${20 + (index * 20)}%`,
                    top: `${15 + (index * 15)}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    rotate: [0, 5, -5, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                >
                  <Icon className="h-8 w-8" />
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="relative z-10"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.4)",
                    "0 0 0 20px rgba(59, 130, 246, 0.1)",
                    "0 0 0 0 rgba(59, 130, 246, 0.4)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Bot className="h-10 w-10 text-white" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </motion.div>
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Welcome to Saarthi - JECRC Chatbot
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Ask me anything about <span className="font-bold text-blue-600">JECRC Foundation</span> - 
                admissions, fees, courses, facilities, scholarships, or any other campus-related queries. 
                I can assist you in <span className="font-bold text-purple-600">English, Hindi, and Rajasthani</span>.
              </motion.p>

              {/* Feature highlights */}
              <motion.div 
                className="mt-8 grid grid-cols-2 gap-4 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                {[
                  { icon: MessageCircle, text: "Real-time Chat", color: "from-blue-400 to-blue-600" },
                  { icon: BookOpen, text: "Course Info", color: "from-green-400 to-green-600" },
                  { icon: Users, text: "Admission Help", color: "from-purple-400 to-purple-600" },
                  { icon: Award, text: "Scholarships", color: "from-yellow-400 to-orange-500" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + (index * 0.1), duration: 0.4 }}
                  >
                    <feature.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages with stagger animation */}
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            <MessageBubble message={message} />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;