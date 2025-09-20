import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;    // < 640px
    tablet?: number;    // 640px - 1024px  
    desktop?: number;   // > 1024px
  };
  gap?: 'sm' | 'md' | 'lg';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-3 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8'
  };

  const gridClasses = `
    grid 
    grid-cols-${cols.mobile || 1}
    md:grid-cols-${cols.tablet || 2}
    lg:grid-cols-${cols.desktop || 3}
    ${gapClasses[gap]}
    w-full
  `;

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;