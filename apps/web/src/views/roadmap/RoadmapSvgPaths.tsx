'use client';

import React, { useEffect, useRef } from 'react';
import { GraphConnection } from '@/models/roadmap/roadmap-graph.types';
import gsap from 'gsap';

interface RoadmapSvgPathsProps {
  connections: GraphConnection[];
  animatingConnectionId?: string | null;
}

export function RoadmapSvgPaths({ connections, animatingConnectionId }: RoadmapSvgPathsProps) {
  const laserBeamsRef = useRef<{ [key: string]: SVGPathElement | null }>({});

  // Animación cinemática de haz de energía cuando una conexión se enciende
  useEffect(() => {
    if (!animatingConnectionId) return;
    const pathEl = laserBeamsRef.current[animatingConnectionId];
    if (!pathEl) return;

    const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 300;

    const ctx = gsap.context(() => {
      // Estado inicial: haz retraído completamente
      gsap.set(pathEl, {
        strokeDasharray: length,
        strokeDashoffset: length,
        strokeOpacity: 1,
      });

      // Avance de energía a alta velocidad con GSAP
      gsap.to(pathEl, {
        strokeDashoffset: 0,
        duration: 0.85,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(pathEl, {
            strokeDasharray: undefined,
            strokeDashoffset: undefined,
          });
        },
      });
    });

    return () => ctx.revert();
  }, [animatingConnectionId]);

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
            ref={(el) => {
              laserBeamsRef.current[c.id] = el;
            }}
            d={c.path}
            fill="none"
            stroke={c.color}
            strokeWidth="2.5"
            strokeOpacity={c.isDashed ? '0.45' : '0.85'}
            strokeLinecap="round"
            strokeDasharray={c.isDashed ? '6 8' : undefined}
            className={c.isDashed ? 'animate-laser-standby' : undefined}
          />
          {/* Forward-traveling energy photon packet: solo en ruta activa */}
          <path
            d={c.path}
            fill="none"
            stroke={c.isDashed ? c.color : '#FFFFFF'}
            strokeWidth={c.isDashed ? '2' : '3'}
            strokeOpacity={c.isDashed ? '0.75' : '0.95'}
            strokeLinecap="round"
            strokeDasharray="20 100"
            className={c.isDashed ? undefined : 'animate-laser-flow'}
            style={{ filter: `drop-shadow(0 0 6px ${c.color})` }}
          />
        </g>
      ))}
    </g>
  );
}
