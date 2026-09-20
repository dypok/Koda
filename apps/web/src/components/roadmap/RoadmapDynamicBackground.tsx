'use client';

import React, { useEffect } from 'react';
import { useAppearanceStore } from '@/stores/appearance.store';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { WeatherLayer } from '@/components/landing/WeatherLayer';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';

export const RoadmapDynamicBackground: React.FC = () => {
  const { backgroundPreset, starDensity, interactiveCursor, initAppearance } = useAppearanceStore();

  useEffect(() => {
    initAppearance();
  }, [initAppearance]);

  const densityMap: Record<string, number> = {
    low: 40,
    medium: 80,
    high: 140,
  };

  const stars = densityMap[starDensity] ?? 80;

  switch (backgroundPreset) {
    case 'fireflies':
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <HeroSkyBackground starCount={35} interactive={false} className="absolute inset-0" />
          <WeatherLayer type="fireflies" count={14} className="absolute inset-0" />
        </div>
      );

    case 'embers':
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <HeroSkyBackground starCount={30} interactive={false} className="absolute inset-0" />
          <WeatherLayer type="embers" count={14} className="absolute inset-0" />
        </div>
      );

    case 'dust':
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <HeroSkyBackground starCount={40} interactive={false} className="absolute inset-0" />
          <WeatherLayer type="dust" count={14} className="absolute inset-0" />
        </div>
      );

    case 'matrix-rain':
    case 'kepler-orbit':
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950">
          <OrbitFieldBackground className="absolute inset-0 opacity-80" />
        </div>
      );

    case 'cosmic-stars':
    default:
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <HeroSkyBackground
            starCount={stars}
            interactive={interactiveCursor}
            className="absolute inset-0"
          />
        </div>
      );
  }
};

export default RoadmapDynamicBackground;
