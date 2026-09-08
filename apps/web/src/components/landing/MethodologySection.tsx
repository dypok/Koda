'use client';

import React from 'react';
import { useMethodologyController } from '@/controllers/landing/useMethodologyController';
import { MethodologyHub } from '@/views/landing/methodology/MethodologyHub';
import { StreakSection } from '@/views/landing/methodology/StreakSection';
import { RoadmapSection } from '@/views/landing/methodology/RoadmapSection';
import { LiveCodeSection } from '@/views/landing/methodology/LiveCodeSection';
import { HintsSection } from '@/views/landing/methodology/HintsSection';

export const MethodologySection: React.FC = () => {
  const { pillars, scrollTo } = useMethodologyController();

  return (
    <div id="metodologia" className="bg-slate-950">
      <MethodologyHub pillars={pillars} onScrollTo={scrollTo} />
      <StreakSection />
      <RoadmapSection />
      <LiveCodeSection />
      <HintsSection />
    </div>
  );
};

export default MethodologySection;
