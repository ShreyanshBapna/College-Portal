import React from 'react';
import ResponsiveGrid from './ResponsiveGrid';
import Card from './Card';

const ResponsiveTest: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Responsive Grid Test</h1>
      
      {/* Test 1: 2, 3, 4 columns */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Test 1: 2 mobile, 3 tablet, 4 desktop</h2>
        <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i} className="h-24 flex items-center justify-center">
              <span className="text-lg font-bold">Card {i + 1}</span>
            </Card>
          ))}
        </ResponsiveGrid>
      </div>

      {/* Test 2: 1, 2, 3 columns */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Test 2: 1 mobile, 2 tablet, 3 desktop</h2>
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} className="h-32 flex items-center justify-center bg-blue-50">
              <span className="text-lg font-bold text-blue-600">Large Card {i + 1}</span>
            </Card>
          ))}
        </ResponsiveGrid>
      </div>

      {/* Test 3: 1, 1, 2 columns */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Test 3: 1 mobile, 1 tablet, 2 desktop</h2>
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="h-40 flex items-center justify-center bg-green-50">
              <span className="text-lg font-bold text-green-600">Wide Card {i + 1}</span>
            </Card>
          ))}
        </ResponsiveGrid>
      </div>

      {/* Current screen size indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded">
        <div className="block sm:hidden">Mobile (&lt; 640px)</div>
        <div className="hidden sm:block md:hidden">Small (640px - 768px)</div>
        <div className="hidden md:block lg:hidden">Medium (768px - 1024px)</div>
        <div className="hidden lg:block xl:hidden">Large (1024px - 1280px)</div>
        <div className="hidden xl:block">XL (≥ 1280px)</div>
      </div>
    </div>
  );
};

export default ResponsiveTest;