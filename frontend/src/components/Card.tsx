import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5 lg:p-6',
    lg: 'p-5 sm:p-6 lg:p-8'
  };

  const baseClasses = `
    bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg shadow-gray-900/5
    ${paddingClasses[padding]}
    transition-all duration-300
    ${hover ? 'hover:shadow-xl hover:shadow-gray-900/10 hover:-translate-y-1' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className={`${baseClasses} ${className}`}
        whileHover={hover ? { scale: 1.02 } : undefined}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.button>
    );
  }

  if (hover) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        whileHover={{ scale: 1.01 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;