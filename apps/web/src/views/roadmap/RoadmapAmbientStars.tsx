'use client';

import React from 'react';

export function RoadmapAmbientStars() {
  return (
    <g className="pointer-events-none" fill="#94A3B8" fontSize="8" fontFamily="monospace">
      {/* 1. Static stars: strictly motionless, gentle luminosity breathing */}
      <g className="animate-star-twinkle-a">
        <text x="120" y="160">+</text>
        <text x="610" y="70">+</text>
        <text x="240" y="510">+</text>
        <text x="890" y="490">+</text>
        <circle cx="190" cy="140" r="1.5" fill="#38BDF8" className="opacity-60" />
        <circle cx="760" cy="80" r="1.5" fill="#A855F7" className="opacity-50" />
        <circle cx="1060" cy="180" r="1.5" fill="#38BDF8" className="opacity-40" />
      </g>
      <g className="animate-star-twinkle-b">
        <text x="360" y="120">+</text>
        <text x="940" y="110">+</text>
        <text x="540" y="530">+</text>
        <circle cx="470" cy="90" r="1.5" fill="#F97316" className="opacity-60" />
        <circle cx="310" cy="490" r="1.5" fill="#10B981" className="opacity-50" />
        <circle cx="710" cy="520" r="1.5" fill="#F59E0B" className="opacity-55" />
        <circle cx="1040" cy="430" r="1.5" fill="#EF4444" className="opacity-40" />
      </g>

      {/* 2. Wandering cosmic particles: smooth organic motion across the map */}
      <g className="animate-wander-1">
        <circle cx="280" cy="200" r="2" fill="#38BDF8" className="opacity-80 drop-shadow-[0_0_8px_#38BDF8]" />
      </g>
      <g className="animate-wander-2">
        <circle cx="720" cy="180" r="2" fill="#A855F7" className="opacity-75 drop-shadow-[0_0_8px_#A855F7]" />
      </g>
      <g className="animate-wander-3">
        <circle cx="460" cy="440" r="2" fill="#10B981" className="opacity-75 drop-shadow-[0_0_8px_#10B981]" />
      </g>
      <g className="animate-wander-4">
        <circle cx="860" cy="360" r="1.8" fill="#F59E0B" className="opacity-70 drop-shadow-[0_0_8px_#F59E0B]" />
      </g>
      <g className="animate-wander-5">
        <circle cx="580" cy="140" r="2.2" fill="#FFFFFF" className="opacity-85 drop-shadow-[0_0_10px_#38BDF8]" />
      </g>
    </g>
  );
}
