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
            strokeWidth="2"
            strokeOpacity={c.isDashed ? '0.45' : '0.85'}
            strokeLinecap="round"
            strokeDasharray={c.isDashed ? '6 8' : undefined}
            className={c.isDashed ? 'animate-laser-standby' : undefined}
          />
          {/* Forward-traveling energy photon packet */}
          <path
            d={c.path}
            fill="none"
            stroke={c.isDashed ? c.color : '#FFFFFF'}
            strokeWidth={c.isDashed ? '2' : '3'}
            strokeOpacity={c.isDashed ? '0.75' : '0.95'}
            strokeLinecap="round"
            strokeDasharray="20 100"
            className="animate-laser-flow"
            style={{ filter: `drop-shadow(0 0 6px ${c.color})` }}
          />
        </g>
      ))}
    </g>
  );
}
