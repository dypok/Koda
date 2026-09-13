'use client';

import React from 'react';
import { NodeVariant } from '@/models/roadmap/roadmap-graph.types';

export function RoadmapNodeRings({ variant }: { variant: NodeVariant }) {
  if (variant === 'active') {
    return (
      <g className="node-active-beacon pointer-events-none">
        {/* Outer tactical scanning radar brackets */}
        <circle
          r="48"
          stroke="#F97316"
          strokeWidth="1"
          strokeDasharray="8 16"
          fill="none"
          opacity="0.4"
          className="animate-spin"
          style={{ animationDuration: '24s' }}
        />
        {/* Concentric pulse ring */}
        <circle
          r="38"
          stroke="#FB923C"
          strokeWidth="1.5"
          fill="none"
          opacity="0.65"
          className="animate-pulse"
        />
        {/* Octagonal/circular inner core with intense glow */}
        <circle
          r="26"
          fill="#EA580C"
          stroke="#FED7AA"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_18px_rgba(249,115,22,0.85)]"
        />
        {/* Crosshair micro-notches */}
        <path d="M -30 0 L -23 0 M 23 0 L 30 0 M 0 -30 L 0 -23 M 0 23 L 0 30" stroke="#FDBA74" strokeWidth="1.5" />
      </g>
    );
  }

  if (variant === 'boss') {
    return (
      <g className="node-boss-monolith pointer-events-none">
        {/* Outer forcefield distortion hex ring */}
        <circle
          r="52"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          fill="none"
          opacity="0.4"
          className="animate-spin"
          style={{ animationDuration: '30s', animationDirection: 'reverse' }}
        />
        {/* Middle containment barrier */}
        <circle
          r="40"
          stroke="#DC2626"
          strokeWidth="1.5"
          fill="none"
          opacity="0.75"
          className="animate-pulse"
        />
        {/* Core dark reactor cell */}
        <circle
          r="28"
          fill="#450A0A"
          stroke="#F87171"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_22px_rgba(239,68,68,0.7)]"
        />
        {/* Warning hazard cross markers */}
        <path d="M -34 0 L -25 0 M 25 0 L 34 0 M 0 -34 L 0 -25 M 0 25 L 0 34" stroke="#FCA5A5" strokeWidth="2" />
      </g>
    );
  }

  if (variant === 'completed') {
    return (
      <g className="node-completed-beacon">
        {/* Steady starlight telemetry ring */}
        <circle
          r="34"
          stroke="#0284C7"
          strokeWidth="1"
          strokeDasharray="4 6"
          fill="none"
          opacity="0.5"
        />
        <circle
          r="26"
          fill="#0C4A6E"
          stroke="#38BDF8"
          strokeWidth="2"
          className="drop-shadow-[0_0_14px_rgba(56,189,248,0.6)]"
        />
        {/* Secure docking nodes */}
        <circle cx="0" cy="-30" r="1.5" fill="#38BDF8" />
        <circle cx="0" cy="30" r="1.5" fill="#38BDF8" />
      </g>
    );
  }

  if (variant === 'unlocked') {
    return (
      <g className="node-unlocked-beacon">
        <circle
          r="34"
          stroke="#059669"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.5"
        />
        <circle
          r="26"
          fill="#064E3B"
          stroke="#34D399"
          strokeWidth="2"
          className="drop-shadow-[0_0_14px_rgba(16,185,129,0.5)]"
        />
      </g>
    );
  }

  if (variant === 'bonus') {
    return (
      <g className="node-bonus-beacon">
        <circle
          r="36"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          fill="none"
          opacity="0.6"
          className="animate-spin"
          style={{ animationDuration: '20s' }}
        />
        <circle
          r="25"
          fill="#78350F"
          stroke="#FBBF24"
          strokeWidth="2"
          className="drop-shadow-[0_0_14px_rgba(245,158,11,0.6)]"
        />
      </g>
    );
  }

  // Locked or default
  return (
    <g className="node-locked-beacon">
      {/* Outer steel bulkhead */}
      <circle
        r="32"
        stroke="#334155"
        strokeWidth="1"
        strokeDasharray="3 5"
        fill="none"
        opacity="0.6"
        className="transition-all duration-300 group-hover:stroke-rose-500/80 group-hover:opacity-100"
      />
      {/* Heavy armor plating */}
      <circle
        r="24"
        fill="#090D16"
        stroke="#475569"
        strokeWidth="2"
        className="transition-all duration-300 group-hover:stroke-rose-400 group-hover:drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
      />
      {/* Encrypted lock hash lines */}
      <line x1="-12" y1="0" x2="-8" y2="0" stroke="#64748B" strokeWidth="1" />
      <line x1="8" y1="0" x2="12" y2="0" stroke="#64748B" strokeWidth="1" />
    </g>
  );
}
