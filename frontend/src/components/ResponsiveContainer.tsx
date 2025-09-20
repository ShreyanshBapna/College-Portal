import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
  delay?: number;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '', 
  animation = true,
  delay = 0
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay
      }
    }
  };

  // Unified responsive classes for all devices
  const baseClasses = `
    w-full max-w-7xl mx-auto
    px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16
    transition-all duration-300 ease-in-out
  `;

  if (animation) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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

export default ResponsiveContainer;