'use client';

import React from 'react';
import { FreeTierSection } from '@/views/landing/preview/FreeTierSection';
import { LiveCodeComparisonSection } from '@/views/landing/preview/LiveCodeComparisonSection';

export const InteractivePreview: React.FC = () => {
  return (
    <section aria-label="Vista previa" id="vista-previa" className="relative scroll-mt-20">
      <FreeTierSection />
      <LiveCodeComparisonSection />
    </section>
  );
};

export default InteractivePreview;
