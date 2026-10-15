'use client';

import React from 'react';

/**
 * Renders an authentic tactical starmap cartography layer:
 * - Subtle coordinates grid with military/astronomy markings
 * - Coordinate crosshairs (+) at key junctions
 * - Watermark sector identification boundaries
 * - Telemetry labels: [QUADRANT-ALPHA], [SYS-NAV: ORBITAL], etc.
 */
export function RoadmapTacticalGrid() {
  return (
    <g className="pointer-events-none select-none">
      <defs>
        {/* Fine cartography grid pattern */}
        <pattern id="tactical-grid-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="#1E293B"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          {/* Sub-grid micro dots */}
          <circle cx="50" cy="50" r="0.8" fill="#334155" opacity="0.3" />
        </pattern>
      </defs>

      {/* Grid background coverage */}
      <rect
        x="-200"
        y="-100"
        width="1550"
        height="820"
        fill="url(#tactical-grid-pattern)"
        opacity="0.65"
      />

      {/* Axis Lines */}
      <line x1="-150" y1="310" x2="1300" y2="310" stroke="#0284C7" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.18" />
      <line x1="575" y1="-50" x2="575" y2="670" stroke="#0284C7" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.18" />

      {/* Sector Boundary Watermarks & Spatial Telemetry */}
      <g fontFamily="monospace" fontSize="9" fill="#475569" letterSpacing="1.5" opacity="0.55">
        {/* Left Sector: Core Foundations */}
        <g transform="translate(60, 60)">
          <text x="0" y="0" fontWeight="bold" fill="#64748B">SEC-01 · FOUNDATIONS</text>
          <text x="0" y="14" fontSize="7.5">COORD: [24.12°N : 88.04°W]</text>
          <path d="M 0 22 L 180 22" stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />
        </g>

        {/* Center Sector: Intermediate Mastery */}
        <g transform="translate(480, 50)">
          <text x="0" y="0" fontWeight="bold" fill="#64748B">SEC-02 · ARCHITECTURE & RUNTIME</text>
          <text x="0" y="14" fontSize="7.5">STATUS: SYNCHRONIZING TELEMETRY</text>
          <path d="M 0 22 L 240 22" stroke="#334155" strokeWidth="1" strokeDasharray="2 4" />
        </g>

        {/* Right Sector: Apex Gate / Deep Void */}
        <g transform="translate(860, 70)">
          <text x="0" y="0" fontWeight="bold" fill="#F87171" opacity="0.8">SEC-03 · APEX MONOLITH</text>
          <text x="0" y="14" fontSize="7.5" fill="#EF4444" opacity="0.6">HAZARD: RESTRICTED AIRSPACE</text>
          <path d="M 0 22 L 200 22" stroke="#7F1D1D" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* Bottom Calibration Markings */}
        <g transform="translate(60, 570)">
          <text x="0" y="0" fontSize="8" fill="#334155">SYS-ORBITAL · LATENCY: 12ms · BUFFER: OPTIMAL</text>
          <text x="750" y="0" fontSize="8" fill="#334155">CARTOGRAPHY PROTOCOL: KODA-NAV-V4</text>
        </g>
      </g>

      {/* Tactical Crosshairs (+) at key grid intersections */}
      <g fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.3" textAnchor="middle">
        <text x="100" y="200">+</text>
        <text x="300" y="200">+</text>
        <text x="700" y="160">+</text>
        <text x="900" y="200">+</text>
        <text x="300" y="440">+</text>
        <text x="500" y="440">+</text>
        <text x="700" y="480">+</text>
        <text x="1050" y="460">+</text>
      </g>

      {/* Target Reticle Accents */}
      <g stroke="#38BDF8" strokeWidth="0.75" fill="none" opacity="0.25">
        <circle cx="860" cy="310" r="14" strokeDasharray="3 3" />
        <circle cx="860" cy="310" r="4" />
      </g>
    </g>
  );
}
