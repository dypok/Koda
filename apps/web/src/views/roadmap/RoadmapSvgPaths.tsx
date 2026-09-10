'use client';

import React from 'react';
import { GraphConnection } from '@/models/roadmap/roadmap-graph.types';

interface RoadmapSvgPathsProps {
  connections: GraphConnection[];
}

export function RoadmapSvgPaths({ connections }: RoadmapSvgPathsProps) {
  return (
    <g className="roadmap-connections pointer-events-none">
      <defs>
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {connections.map((c) => (
        <g key={c.id}>
          {/* Subtle luminous ambient glow path */}
          <path
            d={c.path}
            fill="none"
            stroke={c.color}
            strokeWidth="7"
            strokeOpacity="0.2"
            strokeLinecap="round"
          />
          {/* Core laser beam */}
          <path
            d={c.path}
            fill="none"
            stroke={c.color}
            strokeWidth="2.5"
            strokeOpacity={c.isDashed ? '0.5' : '0.85'}
            strokeLinecap="round"
            strokeDasharray={c.isDashed ? '6 8' : undefined}
            className={c.isDashed ? 'animate-laser-standby' : undefined}
          />
          {/* High-speed energy photon packet traveling along active links */}
          {!c.isDashed && (
            <path
              d={c.path}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeOpacity="0.95"
              strokeLinecap="round"
              strokeDasharray="20 100"
              className="animate-laser-flow drop-shadow-[0_0_6px_#38BDF8]"
            />
          )}
        </g>
      ))}
    </g>
  );
}
