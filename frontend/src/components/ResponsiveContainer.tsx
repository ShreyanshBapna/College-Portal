import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
  delay?: number;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '',
  maxWidth = 'full'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg', 
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <div className={`
      w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10
      ${maxWidthClasses[maxWidth]}
      ${className}
    `.trim().replace(/\s+/g, ' ')}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;