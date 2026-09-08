'use client';

import React from 'react';
import { FreeTierSection } from '@/views/landing/preview/FreeTierSection';
import { LiveCodeComparisonSection } from '@/views/landing/preview/LiveCodeComparisonSection';

export const InteractivePreview: React.FC = () => {
  return (
    <div className="relative">
      <FreeTierSection />
      <LiveCodeComparisonSection />
    </div>
  );
};

export default InteractivePreview;
