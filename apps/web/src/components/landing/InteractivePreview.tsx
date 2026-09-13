'use client';

import React from 'react';
import { FreeTierSection } from '@/views/landing/preview/FreeTierSection';
import { LiveCodeComparisonSection } from '@/views/landing/preview/LiveCodeComparisonSection';

export const InteractivePreview: React.FC = () => {
  return (
    <div id="vista-previa" className="relative scroll-mt-20">
      <FreeTierSection />
      <LiveCodeComparisonSection />
    </div>
  );
};

export default InteractivePreview;
