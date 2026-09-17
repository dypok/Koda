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
  const thermalArcRefs = useRef<{ [key: string]: SVGPathElement | null }>({});

  const nodeMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    nodes?.forEach((n) => map.set(n.id, n.isUnlocked));
    return map;
  }, [nodes]);

  // Animación cinemática de arco térmico ultrarrápido al desbloquear una conexión
  useEffect(() => {
    if (!animatingConnectionId) return;
    const arcEl = thermalArcRefs.current[animatingConnectionId];
    if (!arcEl) return;

    const length = arcEl.getTotalLength ? arcEl.getTotalLength() : 400;

    const ctx = gsap.context(() => {
      // Estado inicial: arco completamente retraído y brillante
      gsap.set(arcEl, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });

      // Detonación térmica de barrido a alta velocidad
      gsap.to(arcEl, {
        strokeDashoffset: 0,
        duration: 0.75,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(arcEl, {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
              gsap.set(arcEl, {
                strokeDasharray: undefined,
                strokeDashoffset: undefined,
                opacity: 0,
              });
            },
          });
        },
      });
    });

    return () => ctx.revert();
  }, [animatingConnectionId]);

  return (
    <g className="roadmap-connections pointer-events-none">
      <defs>
        {/* Filtro de resplandor térmico cuántico ámbar para conductos cilíndricos */}
        <filter id="cylindrical-glow-amber" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Filtro de sobrecalentamiento térmico para arco de ignición */}
        <filter id="thermal-arc-flare" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="flare" />
          <feMerge>
            <feMergeNode in="flare" />
            <feMergeNode in="flare" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((c) => {
        const fromUnlocked = nodeMap.get(c.fromId) ?? false;
        const toUnlocked = nodeMap.get(c.toId) ?? false;
        const isRouteUnlocked = fromUnlocked && toUnlocked;
        const isAnimating = animatingConnectionId === c.id;
        const isLocked = !isRouteUnlocked && !isAnimating;

        const isActivePath = highlightFromId != null && (c.fromId === highlightFromId || c.toId === highlightFromId);

        return (
          <g key={c.id} className="conduit-channel">
            {/* CAPA 1: Filamento estructural base en reposo (Breathing filament) */}
            <path
              d={c.path}
              fill="none"
              stroke={isLocked ? '#334155' : '#FF6A00'}
              strokeWidth={isLocked ? 1.5 : 2}
              strokeDasharray={isLocked ? '4 8' : undefined}
              className={isLocked ? 'opacity-30' : 'animate-conduit-breathe'}
              strokeLinecap="round"
            />

            {/* CAPA 1.5: Halo de canalización térmica en rutas activas */}
            {!isLocked && (
              <path
                d={c.path}
                fill="none"
                stroke="#FF6A00"
                strokeWidth={isActivePath ? 10 : 7}
                strokeOpacity={isActivePath ? 0.28 : 0.15}
                strokeLinecap="round"
                filter="url(#cylindrical-glow-amber)"
              />
            )}

            {/* CAPA 2: Cápsula Cilíndrica Continua (Charge Slug) - Solo en rutas activas/desbloqueadas */}
            {!isLocked && (
              <g className="conduit-charge-slug">
                {/* Manga exterior térmica de la cápsula (7px naranja ámbar cuántico) */}
                <path
                  d={c.path}
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="28 160"
                  className="animate-conduit-slug"
                  filter="url(#cylindrical-glow-amber)"
                  style={{ opacity: 0.95 }}
                />

                {/* Núcleo de alta densidad de la cápsula (2.2px blanco plasma) */}
                <path
                  d={c.path}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="28 160"
                  className="animate-conduit-slug"
                  style={{ opacity: 1 }}
                />
              </g>
            )}

            {/* CAPA 3: Arco Térmico de Ignición Cinemática (Thermal Arc Sweep) */}
            <path
              ref={(el) => {
                thermalArcRefs.current[c.id] = el;
              }}
              d={c.path}
              fill="none"
              stroke="#FFA338"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#thermal-arc-flare)"
              className="pointer-events-none opacity-0"
            />
            {/* Núcleo hiper-brillante del arco */}
            {isAnimating && (
              <path
                d={c.path}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="pointer-events-none"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

