'use client';

import React from 'react';
import { NodeVariant } from '@/models/roadmap/roadmap-graph.types';

export function RoadmapNodeRings({ variant }: { variant: NodeVariant }) {
  if (variant === 'active') {
    return (
      <g className="node-active-halo pointer-events-none">
        <circle r="44" stroke="#F97316" strokeWidth="1.5" strokeDasharray="5 5" fill="none" opacity="0.35" className="animate-spin" style={{ animationDuration: '18s' }} />
        <circle r="36" stroke="#F97316" strokeWidth="1.5" fill="none" opacity="0.6" className="animate-pulse" />
        <circle r="26" fill="#EA580C" stroke="#FDBA74" strokeWidth="2.5" className="drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
      </g>
    );
  }

  if (variant === 'boss') {
    return (
      <g className="node-boss-halo pointer-events-none">
        <circle r="36" stroke="#EF4444" strokeWidth="1.5" fill="none" opacity="0.5" className="animate-pulse" />
        <circle r="26" fill="#7F1D1D" stroke="#F87171" strokeWidth="2.5" className="drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
      </g>
    );
  }

  if (variant === 'bonus') {
    return (
      <g className="node-bonus-halo">
        <circle r="32" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.5" />
        <circle r="24" fill="#78350F" stroke="#FBBF24" strokeWidth="2" className="drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
      </g>
    );
  }

  if (variant === 'completed') {
    return (
      <g className="node-completed-halo">
        <circle r="30" stroke="#0284C7" strokeWidth="1.5" fill="none" opacity="0.4" />
        <circle r="24" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="2" className="drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]" />
      </g>
    );
  }

  if (variant === 'unlocked') {
    return (
      <g className="node-unlocked-halo">
        <circle r="30" stroke="#059669" strokeWidth="1.5" fill="none" opacity="0.4" />
        <circle r="24" fill="#064E3B" stroke="#34D399" strokeWidth="2" className="drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
      </g>
    );
  }

  // Locked or branch locked
  return (
    <g className="node-locked-halo">
      <circle
        r="28"
        stroke="#475569"
        strokeWidth="1.5"
        fill="#0F172A"
        opacity="0.8"
        className="transition-all duration-300 group-hover:stroke-rose-500/80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]"
      />
      <circle
        r="22"
        fill="#1E293B"
        stroke="#64748B"
        strokeWidth="1.5"
        className="transition-all duration-300 group-hover:stroke-rose-400/80 group-hover:fill-rose-950/40"
      />
    </g>
  );
}
