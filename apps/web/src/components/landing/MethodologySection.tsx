'use client';

import React, { useEffect, useState } from 'react';
import { useMethodologyController } from '@/controllers/landing/useMethodologyController';
import { MethodologyHub } from '@/views/landing/methodology/MethodologyHub';
import { PillarStrip } from '@/views/landing/methodology/PillarStrip';
import { StreakSection } from '@/views/landing/methodology/StreakSection';
import { RoadmapSection } from '@/views/landing/methodology/RoadmapSection';
import { LiveCodeSection } from '@/views/landing/methodology/LiveCodeSection';
import { HintsSection } from '@/views/landing/methodology/HintsSection';

const PILLAR_IDS = ['rachas', 'roadmap', 'codigo-real', 'pistas'];

export const MethodologySection: React.FC = () => {
  const { pillars, scrollTo } = useMethodologyController();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    const els = PILLAR_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="metodologia" className="bg-slate-950 scroll-mt-20">
      <MethodologyHub pillars={pillars} activeId={activeId} onScrollTo={scrollTo} />
      <PillarStrip pillars={pillars} activeId={activeId} onScrollTo={scrollTo} />
      <StreakSection />
      <RoadmapSection />
      <LiveCodeSection />
      <HintsSection />
    </div>
  );
};

export default MethodologySection;
