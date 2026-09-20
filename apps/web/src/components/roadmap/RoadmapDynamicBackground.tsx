'use client';

import React, { useEffect } from 'react';
import { useAppearanceStore, ACCENT_PALETTES, StarDensity } from '@/stores/appearance.store';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { WeatherLayer } from '@/components/landing/WeatherLayer';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { RoadmapInteractiveCursor } from './RoadmapInteractiveCursor';

export const RoadmapDynamicBackground: React.FC = () => {
  const { backgroundPreset, starDensity, accentTheme, interactiveCursor, initAppearance } = useAppearanceStore();

  useEffect(() => {
    initAppearance();
  }, [initAppearance]);

  const palette = ACCENT_PALETTES[accentTheme] || ACCENT_PALETTES.amber;

  const densityMap: Record<StarDensity, { stars: number; particles: number }> = {
    low: { stars: 35, particles: 8 },
    medium: { stars: 100, particles: 20 },
    high: { stars: 240, particles: 45 },
  };

  const density = densityMap[starDensity] ?? densityMap.medium;

  const renderPreset = () => {
    switch (backgroundPreset) {
      case 'fireflies':
        return (
          <div
            key={`preset-fireflies-${density.stars}-${density.particles}-${accentTheme}`}
            className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(16,185,129,0.12),transparent_70%),linear-gradient(180deg,#030712_0%,#022c22_60%,#030712_100%)]"
          >
            <HeroSkyBackground starCount={Math.round(density.stars * 0.45)} accentTheme={accentTheme} interactive={false} className="absolute inset-0 opacity-70" />
            <WeatherLayer type="fireflies" count={density.particles} className="absolute inset-0" />
          </div>
        );

      case 'embers':
        return (
          <div
            key={`preset-embers-${density.stars}-${density.particles}-${accentTheme}`}
            className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(239,68,68,0.14),transparent_70%),linear-gradient(180deg,#030712_0%,#450a0a_60%,#030712_100%)]"
          >
            <HeroSkyBackground starCount={Math.round(density.stars * 0.4)} accentTheme={accentTheme} interactive={false} className="absolute inset-0 opacity-70" />
            <WeatherLayer type="embers" count={density.particles} className="absolute inset-0" />
          </div>
        );

      case 'dust':
        return (
          <div
            key={`preset-dust-${density.stars}-${density.particles}-${accentTheme}`}
            className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(245,158,11,0.12),transparent_70%),linear-gradient(180deg,#030712_0%,#1e1b4b_50%,#030712_100%)]"
          >
            <HeroSkyBackground starCount={Math.round(density.stars * 0.5)} accentTheme={accentTheme} interactive={false} className="absolute inset-0 opacity-75" />
            <WeatherLayer type="dust" count={density.particles} className="absolute inset-0" />
          </div>
        );

      case 'matrix-rain':
        return (
          <div
            key={`preset-matrix-${accentTheme}`}
            className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950"
          >
            <OrbitFieldBackground engineKey="slow-rain" className="absolute inset-0 opacity-90" />
          </div>
        );

      case 'kepler-orbit':
        return (
          <div
            key={`preset-kepler-${accentTheme}`}
            className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-950"
          >
            <OrbitFieldBackground engineKey="kepler-spiral" className="absolute inset-0 opacity-85" />
          </div>
        );

      case 'cosmic-stars':
      default:
        return (
          <div
            key={`preset-cosmic-${density.stars}-${accentTheme}`}
            className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
          >
            <HeroSkyBackground
              starCount={density.stars}
              accentTheme={accentTheme}
              interactive={false}
              className="absolute inset-0"
            />
          </div>
        );
    }
  };

  return (
    <>
      {renderPreset()}
      {/* Capa de aura atmosférica del tema de acento */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 80% 45% at 50% -5%, rgba(${palette.rgb}, 0.12), transparent 75%), radial-gradient(ellipse 65% 35% at 85% 95%, rgba(${palette.rgb}, 0.08), transparent 65%)`,
        }}
      />
      {/* Capa de cursor interactivo (ondas y chispas estelares) */}
      <RoadmapInteractiveCursor />
    </>
  );
};

export default RoadmapDynamicBackground;
