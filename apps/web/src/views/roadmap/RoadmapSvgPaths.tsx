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
          {/* Core crisp laser path */}
          <path
            d={c.path}
            fill="none"
            stroke={c.color}
            strokeWidth="2.5"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeDasharray={c.isDashed ? '6 6' : undefined}
          />
        </g>
      ))}
    </g>
  );
}
