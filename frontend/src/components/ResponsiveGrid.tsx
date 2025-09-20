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

  // Helper function to get explicit grid column classes
  const getGridCols = (mobile: number, tablet: number, desktop: number) => {
    const mobileClass = mobile === 1 ? 'grid-cols-1' : 
                       mobile === 2 ? 'grid-cols-2' : 
                       mobile === 3 ? 'grid-cols-3' : 
                       mobile === 4 ? 'grid-cols-4' : 
                       mobile === 5 ? 'grid-cols-5' : 
                       mobile === 6 ? 'grid-cols-6' : 'grid-cols-1';
    
    const tabletClass = tablet === 1 ? 'md:grid-cols-1' : 
                       tablet === 2 ? 'md:grid-cols-2' : 
                       tablet === 3 ? 'md:grid-cols-3' : 
                       tablet === 4 ? 'md:grid-cols-4' : 
                       tablet === 5 ? 'md:grid-cols-5' : 
                       tablet === 6 ? 'md:grid-cols-6' : 'md:grid-cols-2';
    
    const desktopClass = desktop === 1 ? 'lg:grid-cols-1' : 
                        desktop === 2 ? 'lg:grid-cols-2' : 
                        desktop === 3 ? 'lg:grid-cols-3' : 
                        desktop === 4 ? 'lg:grid-cols-4' : 
                        desktop === 5 ? 'lg:grid-cols-5' : 
                        desktop === 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-3';
    
    return `${mobileClass} ${tabletClass} ${desktopClass}`;
  };

  const gridClasses = `
    grid 
    ${getGridCols(cols.mobile || 1, cols.tablet || 2, cols.desktop || 3)}
    ${gapClasses[gap]}
    w-full
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;