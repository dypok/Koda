'use client';

import React, { useEffect, useRef } from 'react';
import { GraphConnection } from '@/models/roadmap/roadmap-graph.types';
import gsap from 'gsap';

interface RoadmapSvgPathsProps {
  connections: GraphConnection[];
  animatingConnectionId?: string | null;
  highlightFromId?: string | null;
  nodes?: { id: string; isUnlocked: boolean }[];
}

export function RoadmapSvgPaths({ connections, animatingConnectionId, highlightFromId, nodes }: RoadmapSvgPathsProps) {
  const laserBeamsRef = useRef<{ [key: string]: SVGPathElement | null }>({});

  const nodeMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    nodes?.forEach((n) => map.set(n.id, n.isUnlocked));
    return map;
  }, [nodes]);

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

      {connections.map((c) => {
        const fromUnlocked = nodeMap.get(c.fromId) ?? false;
        const toUnlocked = nodeMap.get(c.toId) ?? false;
        const isRouteUnlocked = fromUnlocked && toUnlocked;
        const isAnimating = animatingConnectionId === c.id;
        const isGray = !isRouteUnlocked && !isAnimating;

        const isActivePath = highlightFromId != null && (c.fromId === highlightFromId || c.toId === highlightFromId);
        const stroke = isGray ? '#334155' : (isActivePath && !c.isDashed ? '#F59E0B' : c.color);

        return (
          <g key={c.id}>
            {/* Ambient glow path: Solo si la ruta está desbloqueada o animando */}
            {!isGray && (
              <path
                d={c.path}
                fill="none"
                stroke={stroke}
                strokeWidth={isActivePath ? 9 : 6}
                strokeOpacity={isActivePath ? 0.35 : 0.2}
                strokeLinecap="round"
              />
            )}

            {/* Core laser beam: Gris neutro en reposo si la ruta está bloqueada */}
            <path
              ref={(el) => {
                laserBeamsRef.current[c.id] = el;
              }}
              d={c.path}
              fill="none"
              stroke={stroke}
              strokeWidth={isGray ? '2' : '2.5'}
              strokeOpacity={isGray ? '0.4' : (isAnimating ? '1' : '0.85')}
              strokeLinecap="round"
              strokeDasharray={isGray ? '5 7' : (c.isDashed && !isAnimating ? '6 8' : undefined)}
              className={isGray ? undefined : (c.isDashed && !isAnimating ? 'animate-laser-standby' : undefined)}
            />

            {/* Forward-traveling energy photon packet: Solo en rutas desbloqueadas activas o animando */}
            {!isGray && (
              <path
                d={c.path}
                fill="none"
                stroke={isAnimating ? '#38BDF8' : '#FFFFFF'}
                strokeWidth="3"
                strokeOpacity="0.95"
                strokeLinecap="round"
                strokeDasharray="20 100"
                className="animate-laser-flow"
                style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
