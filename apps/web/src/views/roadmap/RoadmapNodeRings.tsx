'use client';

import React from 'react';
import { NodeVariant } from '@/models/roadmap/roadmap-graph.types';

export function RoadmapNodeRings({ variant }: { variant: NodeVariant }) {
  if (variant === 'active') {
    return (
      <g className="node-active-beacon pointer-events-none">
        {/* Vernier Metric Scale: Anillo exterior con muescas rotando */}
        <circle
          r="34"
          fill="none"
          stroke="#FF6A00"
          strokeWidth="1.2"
          strokeDasharray="1 5"
          opacity="0.8"
          className="st-spin-slow"
          style={{ animationDuration: '32s' }}
        />

        {/* Outer tactical orbital ring con micro-sensores */}
        <g transform="rotate(-18)">
          <ellipse
            rx="46"
            ry="18"
            fill="none"
            stroke="#FFA338"
            strokeWidth="0.8"
            strokeDasharray="3 7"
            opacity="0.5"
            className="animate-spin"
            style={{ animationDuration: '24s' }}
          />
          <circle cx="46" cy="0" r="2" fill="#FFFFFF" className="drop-shadow-[0_0_6px_#FF6A00]" />
          <circle cx="-46" cy="0" r="1.5" fill="#FFA338" className="drop-shadow-[0_0_4px_#FF6A00]" />
        </g>

        {/* Concentric mechanical Iris Diaphragm ring */}
        <circle
          r="27"
          fill="none"
          stroke="#FFA338"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.7"
          className="animate-pulse"
        />

        {/* Circular inner core: Titanio oscuro con fulgor térmico ámbar profundo */}
        <circle
          r="23"
          fill="#1A0D00"
          stroke="#FF6A00"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_18px_rgba(255,106,0,0.85)]"
        />

        {/* Crosshair vernier micro-notches */}
        <path d="M -32 0 L -25 0 M 25 0 L 32 0 M 0 -32 L 0 -25 M 0 25 L 0 32" stroke="#FFA338" strokeWidth="1.5" />
      </g>
    );
  }

  if (variant === 'boss') {
    return (
      <g className="node-boss-monolith pointer-events-none">
        {/* Vernier Metric Outer Scale con mayor radio */}
        <circle
          r="42"
          stroke="#FF6A00"
          strokeWidth="1.5"
          strokeDasharray="1 6"
          fill="none"
          opacity="0.75"
          className="st-spin-slower"
        />

        {/* Keplerian Dread Orbit con micro-partículas cuánticas */}
        <g transform="rotate(35)">
          <ellipse
            rx="56"
            ry="22"
            fill="none"
            stroke="#FFA338"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.6"
            className="animate-spin"
            style={{ animationDuration: '28s' }}
          />
          <circle cx="56" cy="0" r="2.5" fill="#FFFFFF" className="drop-shadow-[0_0_8px_#FF6A00]" />
          <circle cx="-56" cy="0" r="2" fill="#FFA338" className="drop-shadow-[0_0_6px_#FF6A00]" />
        </g>

        {/* Octagonal Iris containment barrier */}
        <polygon
          points="36,15 15,36 -15,36 -36,15 -36,-15 -15,-36 15,-36 36,-15"
          fill="none"
          stroke="#FF6A00"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.8"
          className="animate-pulse"
        />

        {/* Octagonal Core Monolith: Hiper-térmico */}
        <polygon
          points="27,11.2 11.2,27 -11.2,27 -27,11.2 -27,-11.2 -11.2,-27 11.2,-27 27,-11.2"
          fill="#2A0B00"
          stroke="#FFA338"
          strokeWidth="2.8"
          className="drop-shadow-[0_0_24px_rgba(255,106,0,0.9)] st-flicker"
        />

        {/* Warning hazard vernier ticks */}
        <path d="M -38 0 L -29 0 M 29 0 L 38 0 M 0 -38 L 0 -29 M 0 29 L 0 38" stroke="#FFFFFF" strokeWidth="2" />
      </g>
    );
  }

  if (variant === 'branch') {
    return (
      <g className="node-branch-beacon pointer-events-none">
        {/* Vernier ring */}
        <circle
          r="32"
          stroke="#FF6A00"
          strokeWidth="1"
          strokeDasharray="1 5"
          fill="none"
          opacity="0.6"
          className="st-spin-slow"
          style={{ animationDuration: '40s' }}
        />
        {/* Outer rotating dashed hexagon */}
        <polygon
          points="32,0 16,27.7 -16,27.7 -32,0 -16,-27.7 16,-27.7"
          fill="none"
          stroke="#FFA338"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity="0.6"
          className="animate-spin"
          style={{ animationDuration: '36s' }}
        />
        {/* Hexagonal Inner Core */}
        <polygon
          points="24,0 12,20.8 -12,20.8 -24,0 -12,-20.8 12,-20.8"
          fill="#1F0D00"
          stroke="#FF6A00"
          strokeWidth="2"
          className="drop-shadow-[0_0_14px_rgba(255,106,0,0.65)]"
        />
        {/* Connector node ticks */}
        <circle cx="0" cy="-28" r="1.5" fill="#FFA338" />
        <circle cx="0" cy="28" r="1.5" fill="#FFA338" />
      </g>
    );
  }

  if (variant === 'completed') {
    return (
      <g className="node-completed-beacon pointer-events-none">
        {/* Vernier scale calibrada */}
        <circle
          r="32"
          stroke="#FF6A00"
          strokeWidth="1"
          strokeDasharray="1 5"
          fill="none"
          opacity="0.75"
          className="st-spin-slow"
          style={{ animationDuration: '48s' }}
        />
        {/* Diafragma iris estabilizado */}
        <circle
          r="26"
          stroke="#FFA338"
          strokeWidth="1"
          strokeDasharray="3 5"
          fill="none"
          opacity="0.6"
        />
        {/* Núcleo térmico asentado */}
        <circle
          r="23"
          fill="#1C0E02"
          stroke="#FF6A00"
          strokeWidth="2.2"
          className="drop-shadow-[0_0_16px_rgba(255,106,0,0.7)]"
        />
        {/* Micro-docking alignment notches */}
        <circle cx="0" cy="-28" r="1.5" fill="#FFFFFF" />
        <circle cx="0" cy="28" r="1.5" fill="#FFFFFF" />
      </g>
    );
  }

  if (variant === 'unlocked') {
    return (
      <g className="node-unlocked-beacon pointer-events-none">
        <circle
          r="32"
          stroke="#FF6A00"
          strokeWidth="1"
          strokeDasharray="1 5"
          fill="none"
          opacity="0.6"
          className="st-spin-slow"
        />
        <circle
          r="23"
          fill="#170A00"
          stroke="#FFA338"
          strokeWidth="2"
          className="drop-shadow-[0_0_14px_rgba(255,106,0,0.55)]"
        />
      </g>
    );
  }

  if (variant === 'bonus') {
    return (
      <g className="node-bonus-beacon pointer-events-none">
        <circle
          r="34"
          stroke="#FFA338"
          strokeWidth="1.2"
          strokeDasharray="1 4"
          fill="none"
          opacity="0.8"
          className="st-spin-slow"
          style={{ animationDuration: '30s' }}
        />
        <circle
          r="23"
          fill="#2B1400"
          stroke="#FFB049"
          strokeWidth="2.2"
          className="drop-shadow-[0_0_16px_rgba(255,176,73,0.7)]"
        />
      </g>
    );
  }

  // Locked or default
  return (
    <g className="node-locked-beacon pointer-events-none">
      {/* Outer vernier ring in standby */}
      <circle
        r="32"
        stroke="#334155"
        strokeWidth="1"
        strokeDasharray="1 5"
        fill="none"
        opacity="0.45"
        className="transition-all duration-300 group-hover:stroke-[#FF6A00]/80 group-hover:opacity-90"
      />
      {/* Heavy obsidian/titanium armor plating */}
      <circle
        r="23"
        fill="#080C14"
        stroke="#334155"
        strokeWidth="1.8"
        className="transition-all duration-300 group-hover:stroke-[#FFA338] group-hover:drop-shadow-[0_0_12px_rgba(255,106,0,0.55)]"
      />
      {/* Encrypted lock hash lines */}
      <line x1="-10" y1="0" x2="-6" y2="0" stroke="#64748B" strokeWidth="1" />
      <line x1="6" y1="0" x2="10" y2="0" stroke="#64748B" strokeWidth="1" />
    </g>
  );
}

