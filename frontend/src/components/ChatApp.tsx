import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import LanguageSelector from './LanguageSelector';
import { Message, Language } from '../types/chat';
import { chatApi } from '../services/chatApi';

interface ChatAppProps {}

const ChatApp: React.FC<ChatAppProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const getWelcomeMessage = (language: Language): string => {
    const welcomeMessages = {
      en: "Hello! I'm your multilingual campus assistant for JECRC Foundation. How can I help you today?",
      hi: "नमस्ते! मैं JECRC Foundation का आपका बहुभाषी कैंपस सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      raj: "नमस्कार! म्हैं JECRC Foundation को थारो बहुभाषी कैंपस सहायक हूं। आज म्हैं थारी कैसे मदद कर सकूं?"
    };
    return welcomeMessages[language];
  };

  const getLanguageName = (language: Language): string => {
    const languageNames = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      raj: 'Rajasthani (राजस्थानी)'
    };
    return languageNames[language];
  };

  const initializeChat = useCallback(async () => {
    try {
      const session = await chatApi.createSession(currentLanguage);
      setSessionId(session.sessionId);

      const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        forceNew: false
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Connected to server');
        setIsConnected(true);
        newSocket.emit('join_chat', { sessionId: session.sessionId });
        
        const welcomeMessage: Message = {
          id: 'welcome',
          content: getWelcomeMessage(currentLanguage),
          sender: 'bot',
          timestamp: new Date(),
          language: currentLanguage
        };
        setMessages([welcomeMessage]);
        toast.success('Connected to chat server');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from server:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, reconnect manually
          newSocket.connect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
        toast.error('Connection failed. Retrying...');
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        toast.success('Reconnected to chat server');
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('Reconnection failed:', error);
        toast.error('Reconnection failed. Please refresh the page.');
      });

      newSocket.on('receive_message', (response: any) => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: response.message,
          sender: 'bot',
          timestamp: new Date(),
          language: response.language,
          confidence: response.confidence,
          intent: response.intent
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      });

      newSocket.on('error', (error: any) => {
        toast.error('Connection error. Please try again.');
        setIsLoading(false);
      });

    } catch (error) {
      toast.error('Failed to initialize chat. Please refresh the page.');
      console.error('Chat initialization error:', error);
    }
  }, [currentLanguage]);

  useEffect(() => {
    initializeChat();
    
    return () => {
      if (socket) {
        console.log('🧹 Cleaning up socket connection');
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [currentLanguage, initializeChat, socket]); // Added missing dependencies

  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (socket && isConnected) {
        socket.emit('send_message', {
          message: content.trim(),
          language: currentLanguage,
          sessionId
        });
      } else {
        const response = await chatApi.sendMessage(sessionId, content.trim(), currentLanguage);
        
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: response.botResponse.content,
          sender: 'bot',
          timestamp: new Date(),
          language: response.botResponse.language,
          confidence: response.botResponse.confidence,
          intent: response.botResponse.intent
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
    
    const languageChangeMessage: Message = {
      id: `lang-change-${Date.now()}`,
      content: `Language switched to ${getLanguageName(newLanguage)}`,
      sender: 'bot',
      timestamp: new Date(),
      language: newLanguage
    };

    setMessages(prev => [...prev, languageChangeMessage]);

    if (socket) {
      socket.disconnect();
    }
    await initializeChat();
  };

  const handleClearChat = () => {
    setMessages([]);
    const welcomeMessage: Message = {
      id: 'welcome-new',
      content: getWelcomeMessage(currentLanguage),
      sender: 'bot',
      timestamp: new Date(),
      language: currentLanguage
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col h-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ChatHeader 
            isConnected={isConnected}
            currentLanguage={currentLanguage}
            onClearChat={handleClearChat}
          />
        </motion.div>
        
        <motion.div 
          className="flex-1 flex flex-col overflow-hidden backdrop-blur-sm"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ChatMessages 
            messages={messages}
            isLoading={isLoading}
          />
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ChatInput 
              onSendMessage={sendMessage}
              currentLanguage={currentLanguage}
              disabled={isLoading}
            />
          </motion.div>
        </motion.div>
        
        <AnimatePresence>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatApp;