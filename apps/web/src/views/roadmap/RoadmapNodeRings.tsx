'use client';

import React from 'react';
import { NodeVariant } from '@/models/roadmap/roadmap-graph.types';

export function RoadmapNodeRings({ variant }: { variant: NodeVariant }) {
  if (variant === 'active') {
    return (
      <g className="node-active-beacon pointer-events-none">
        {/* Keplerian Elliptical Orbital Ring with micro-particles */}
        <g transform="rotate(-22)">
          <ellipse
            rx="46"
            ry="18"
            fill="none"
            stroke="#F97316"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.55"
            className="animate-spin"
            style={{ animationDuration: '28s' }}
          />
          <circle cx="46" cy="0" r="2.2" fill="#FDBA74" className="drop-shadow-[0_0_6px_#F97316]" />
          <circle cx="-46" cy="0" r="1.6" fill="#FED7AA" className="drop-shadow-[0_0_4px_#F97316]" />
          <circle cx="0" cy="18" r="1.8" fill="#FB923C" className="drop-shadow-[0_0_5px_#F97316]" />
        </g>

        {/* Outer tactical scanning radar brackets */}
        <circle
          r="48"
          stroke="#F97316"
          strokeWidth="1"
          strokeDasharray="8 16"
          fill="none"
          opacity="0.4"
          className="st-spin-slow"
          style={{ animationDuration: '48s' }}
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
        {/* Circular inner core with intense glow */}
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
        {/* Keplerian Dread Orbit with crimson energy particles */}
        <g transform="rotate(32)">
          <ellipse
            rx="56"
            ry="22"
            fill="none"
            stroke="#EF4444"
            strokeWidth="1.2"
            strokeDasharray="5 10"
            opacity="0.65"
            className="animate-spin"
            style={{ animationDuration: '32s' }}
          />
          <circle cx="56" cy="0" r="2.5" fill="#FCA5A5" className="drop-shadow-[0_0_8px_#EF4444]" />
          <circle cx="-56" cy="0" r="2" fill="#F87171" className="drop-shadow-[0_0_6px_#EF4444]" />
          <circle cx="0" cy="22" r="2.2" fill="#DC2626" className="drop-shadow-[0_0_7px_#EF4444]" />
        </g>

        {/* Outer forcefield distortion hex ring */}
        <circle
          r="64"
          stroke="#7F1D1D"
          strokeWidth="1"
          strokeDasharray="2 8"
          fill="none"
          opacity="0.5"
          className="st-spin-slow"
          style={{ animationDuration: '80s' }}
        />

        {/* Octagonal containment barrier */}
        <polygon
          points="38,15.7 15.7,38 -15.7,38 -38,15.7 -38,-15.7 -15.7,-38 15.7,-38 38,-15.7"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.75"
          className="animate-pulse"
        />

        {/* Octagonal Core Monolith */}
        <polygon
          points="28,11.6 11.6,28 -11.6,28 -28,11.6 -28,-11.6 -11.6,-28 11.6,-28 28,-11.6"
          fill="#450A0A"
          stroke="#F87171"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_24px_rgba(239,68,68,0.85)] st-flicker"
        />

        {/* Warning hazard cross markers */}
        <path d="M -34 0 L -25 0 M 25 0 L 34 0 M 0 -34 L 0 -25 M 0 25 L 0 34" stroke="#FCA5A5" strokeWidth="2" />
      </g>
    );
  }

  if (variant === 'branch') {
    return (
      <g className="node-branch-beacon">
        {/* Outer rotating dashed hexagon */}
        <polygon
          points="35,0 17.5,30.3 -17.5,30.3 -35,0 -17.5,-30.3 17.5,-30.3"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.55"
          className="animate-spin"
          style={{ animationDuration: '40s' }}
        />
        {/* Hexagonal Inner Core */}
        <polygon
          points="26,0 13,22.5 -13,22.5 -26,0 -13,-22.5 13,-22.5"
          fill="#0C4A6E"
          stroke="#38BDF8"
          strokeWidth="2"
          className="drop-shadow-[0_0_14px_rgba(56,189,248,0.6)]"
        />
        {/* Node connector ticks */}
        <circle cx="0" cy="-30" r="1.5" fill="#38BDF8" />
        <circle cx="0" cy="30" r="1.5" fill="#38BDF8" />
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
          className="st-spin-slow"
          style={{ animationDuration: '44s' }}
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
