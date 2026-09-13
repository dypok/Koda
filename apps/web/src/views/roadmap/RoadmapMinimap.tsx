'use client';

import React, { useRef, useEffect } from 'react';
import { GraphDataset } from '@/models/roadmap/roadmap-graph.types';
import { useRoadmapStore } from '@/stores/roadmap.store';
import gsap from 'gsap';

interface RoadmapMinimapProps {
  dataset: GraphDataset;
}

export function RoadmapMinimap({ dataset }: RoadmapMinimapProps) {
  const { panOffset, zoomLevel, setActiveNode, activeNodeId } = useRoadmapStore();
  const radarSweepRef = useRef<SVGCircleElement | null>(null);

  // Animar el barrido del radar de telemetría usando GSAP
  useEffect(() => {
    if (!radarSweepRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(radarSweepRef.current, {
        rotation: 360,
        transformOrigin: 'center center',
        repeat: -1,
        ease: 'none',
        duration: 4,
      });
    });
    return () => ctx.revert();
  }, []);

  // Coordenadas calculadas para el visor del viewport
  // El SVG original tiene un viewBox de 0 0 1150 620
  const viewportWidth = 1150 / (zoomLevel / 100);
  const viewportHeight = 620 / (zoomLevel / 100);
  const viewportX = (1150 - viewportWidth) / 2 - panOffset.x / (zoomLevel / 100);
  const viewportY = (620 - viewportHeight) / 2 - panOffset.y / (zoomLevel / 100);

  return (
    <div className="absolute bottom-4 left-4 z-30 hidden sm:block pointer-events-auto">
      <div className="w-48 h-28 bg-slate-950/85 border border-cyan-500/30 rounded-lg p-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-between">
        {/* Radar Header */}
        <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400/80 px-1 border-b border-slate-800 pb-0.5">
          <span className="tracking-wider uppercase font-bold">RADAR // ORBIT</span>
          <span className="text-slate-400">{zoomLevel}%</span>
        </div>

        {/* Radar Mini Viewport SVG */}
        <div className="relative flex-1 w-full h-full overflow-hidden mt-1 rounded bg-slate-900/60">
          <svg viewBox="0 0 1150 620" className="w-full h-full">
            {/* Ambient radar grid rings */}
            <circle cx="575" cy="310" r="180" stroke="#0284C7" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.15" />
            <circle cx="575" cy="310" r="320" stroke="#0284C7" strokeWidth="1" strokeDasharray="6 12" fill="none" opacity="0.1" />

            {/* Radar Beam GSAP sweep */}
            <circle
              ref={radarSweepRef}
              cx="575"
              cy="310"
              r="240"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="40 300"
              fill="none"
              opacity="0.25"
            />

            {/* Mini Connections */}
            {dataset.connections.map((c) => (
              <path
                key={c.id}
                d={c.path}
                fill="none"
                stroke={c.color}
                strokeWidth="8"
                strokeOpacity="0.4"
              />
            ))}

            {/* Mini Nodes */}
            {dataset.nodes.map((n) => {
              const isSelected = n.id === activeNodeId;
              return (
                <circle
                  key={n.id}
                  cx={n.x}
                  cy={n.y}
                  r={isSelected ? 22 : 14}
                  fill={
                    n.variant === 'active'
                      ? '#F97316'
                      : n.variant === 'boss'
                        ? '#EF4444'
                        : n.variant === 'completed'
                          ? '#0284C7'
                          : '#475569'
                  }
                  className="cursor-pointer transition-all hover:scale-125"
                  onClick={() => setActiveNode(n.id)}
                />
              );
            })}

            {/* Viewport Bounds Rectangle (muestra qué parte del mapa estamos mirando) */}
            <rect
              x={Math.max(0, Math.min(1150 - viewportWidth, viewportX))}
              y={Math.max(0, Math.min(620 - viewportHeight, viewportY))}
              width={Math.min(1150, viewportWidth)}
              height={Math.min(620, viewportHeight)}
              fill="#38BDF8"
              fillOpacity="0.08"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeDasharray="10 6"
              className="pointer-events-none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
