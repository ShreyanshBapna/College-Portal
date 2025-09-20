import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types/chat';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  currentLanguage: Language;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  currentLanguage,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      resizeTextarea();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [message]);

  const getPlaceholder = (): string => {
    const placeholders = {
      en: 'Type your message here... (Press Enter to send, Shift+Enter for new line)',
      hi: 'यहाँ अपना संदेश लिखें... (भेजने के लिए Enter दबाएं, नई लाइन के लिए Shift+Enter)',
      raj: 'आपणो संदेश यहाँ लिखो... (भेजने के लिए Enter दबावो, नई लाइन के लिए Shift+Enter)'
    };
    return placeholders[currentLanguage];
  };

  // Voice input functionality (Web Speech API)
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'raj' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 px-4 py-4 shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.form 
        onSubmit={handleSubmit} 
        className="flex items-end space-x-3"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex-1 relative">
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={disabled}
              className={`w-full resize-none border-2 border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[50px] max-h-[120px] transition-all duration-300 shadow-sm ${
                currentLanguage === 'hi' || currentLanguage === 'raj' ? 'hindi-text' : ''
              }`}
              rows={1}
              whileFocus={{
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              }}
            />
            
            {/* Message icon inside textarea */}
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              animate={{ 
                scale: message.trim() ? 0 : 1,
                opacity: message.trim() ? 0 : 1 
              }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="h-5 w-5" />
            </motion.div>
            
            {/* Character count indicator */}
            <AnimatePresence>
              {message.length > 100 && (
                <motion.div
                  className="absolute -top-6 right-0 text-xs text-gray-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {message.length}/500
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Voice Input Button */}
        <motion.button
          type="button"
          onClick={toggleVoiceInput}
          disabled={disabled}
          className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-lg ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
              : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? 'Stop listening' : 'Voice input'}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? {
            boxShadow: [
              "0 0 0 0 rgba(239, 68, 68, 0.4)",
              "0 0 0 10px rgba(239, 68, 68, 0.1)",
              "0 0 0 0 rgba(239, 68, 68, 0.4)"
            ]
          } : {}}
          transition={{
            duration: isListening ? 1.5 : 0.2,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <motion.div
            animate={isListening ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </motion.div>
        </motion.button>

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
          title="Send message"
          whileHover={{ 
            scale: message.trim() ? 1.05 : 1,
            y: message.trim() ? -2 : 0,
            boxShadow: message.trim() ? "0 10px 25px rgba(59, 130, 246, 0.4)" : "0 4px 15px rgba(0, 0, 0, 0.1)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={message.trim() ? {
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0.4)",
              "0 0 0 8px rgba(59, 130, 246, 0.1)",
              "0 0 0 0 rgba(59, 130, 246, 0.4)"
            ]
          } : {}}
          transition={{
            duration: message.trim() ? 2 : 0.2,
            repeat: message.trim() ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <motion.div
            animate={message.trim() ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: message.trim() ? Infinity : 0 }}
          >
            <Send className="h-6 w-6" />
          </motion.div>
        </motion.button>
      </motion.form>

      {/* Quick Action Buttons */}
      <AnimatePresence>
        <motion.div 
          className="mt-4 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {getQuickActions(currentLanguage).map((action, index) => (
            <motion.button
              key={index}
              onClick={() => setMessage(action)}
              disabled={disabled}
              className="inline-flex items-center px-4 py-2 border-2 border-gray-200 rounded-full text-sm text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: 0.5 + (index * 0.1), 
                duration: 0.4,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
              >
                <Zap className="h-4 w-4 mr-2 text-blue-500" />
                {action}
              </motion.span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const getQuickActions = (language: Language): string[] => {
  const actions = {
    en: [
      'What are the admission requirements?',
      'Tell me about course fees',
      'Library timings?',
      'Hostel facilities',
      'Scholarship information'
    ],
    hi: [
      'प्रवेश की आवश्यकताएं क्या हैं?',
      'कोर्स फीस के बारे में बताएं',
      'लाइब्रेरी का समय?',
      'हॉस्टल की सुविधाएं',
      'छात्रवृत्ति की जानकारी'
    ],
    raj: [
      'दाखले की जरूरत क्या सै?',
      'कोर्स फीस के बारे में बताओ',
      'लाइब्रेरी को समय?',
      'हॉस्टल की सुविधावां',
      'छात्रवृत्ति की जानकारी'
    ]
  };
  return actions[language];
};

// Declare global types for Speech Recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default ChatInput;