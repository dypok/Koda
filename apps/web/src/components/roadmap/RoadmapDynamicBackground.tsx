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
    low: 30,
    medium: 70,
    high: 130,
  };

  const stars = densityMap[starDensity] ?? 70;

  switch (backgroundPreset) {
    case 'fireflies':
      return (
        <div
          key="preset-fireflies"
          className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(16,185,129,0.12),transparent_70%),linear-gradient(180deg,#030712_0%,#022c22_60%,#030712_100%)]"
        >
          <HeroSkyBackground starCount={30} interactive={false} className="absolute inset-0 opacity-70" />
          <WeatherLayer type="fireflies" count={14} className="absolute inset-0" />
        </div>
      );

    case 'embers':
      return (
        <div
          key="preset-embers"
          className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(239,68,68,0.14),transparent_70%),linear-gradient(180deg,#030712_0%,#450a0a_60%,#030712_100%)]"
        >
          <HeroSkyBackground starCount={25} interactive={false} className="absolute inset-0 opacity-70" />
          <WeatherLayer type="embers" count={14} className="absolute inset-0" />
        </div>
      );

    case 'dust':
      return (
        <div
          key="preset-dust"
          className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(245,158,11,0.12),transparent_70%),linear-gradient(180deg,#030712_0%,#1e1b4b_50%,#030712_100%)]"
        >
          <HeroSkyBackground starCount={35} interactive={false} className="absolute inset-0 opacity-75" />
          <WeatherLayer type="dust" count={14} className="absolute inset-0" />
        </div>
      );

    case 'matrix-rain':
      return (
        <div
          key="preset-matrix"
          className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950"
        >
          <OrbitFieldBackground engineKey="slow-rain" className="absolute inset-0 opacity-90" />
        </div>
      );

    case 'kepler-orbit':
      return (
        <div
          key="preset-kepler"
          className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950"
        >
          <OrbitFieldBackground engineKey="kepler-spiral" className="absolute inset-0 opacity-85" />
        </div>
      );

    case 'cosmic-stars':
    default:
      return (
        <div
          key={`preset-cosmic-${stars}-${interactiveCursor}`}
          className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        >
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
