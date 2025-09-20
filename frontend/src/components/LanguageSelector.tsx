import React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, LanguageInfo } from '../types/chat';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const languages: LanguageInfo[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी', flag: '🕉️' },
  ];

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 px-4 py-4 shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="h-5 w-5 text-blue-600" />
          </motion.div>
          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Select Language:
          </span>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-3 md:flex-nowrap"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`inline-flex items-center space-x-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg backdrop-blur-sm ${
                currentLanguage === lang.code
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white transform scale-105'
                  : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              title={`Switch to ${lang.name}`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.4 + (index * 0.1), 
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: currentLanguage === lang.code ? 1.05 : 1.1,
                y: -3,
                boxShadow: currentLanguage === lang.code 
                  ? "0 15px 35px rgba(59, 130, 246, 0.4)"
                  : "0 10px 25px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-xl"
                animate={currentLanguage === lang.code ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: currentLanguage === lang.code ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {lang.flag}
              </motion.span>
              <span className={`${lang.code === 'hi' || lang.code === 'raj' ? 'hindi-text' : ''} relative`}>
                {lang.nativeName}
                {currentLanguage === lang.code && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                  </motion.div>
                )}
              </span>
            </motion.button>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-xs text-gray-500 hidden lg:block max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            className="flex items-center space-x-1"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <span>The AI will automatically detect and respond in your selected language</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LanguageSelector;