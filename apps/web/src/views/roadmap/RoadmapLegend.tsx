'use client';

import React, { useRef, useEffect } from 'react';
import { IconFlame, IconStar, IconShieldCheck, IconPlayerPlay, IconActivity } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/auth.store';
import { useRoadmapStore } from '@/stores/roadmap.store';
import gsap from 'gsap';

export function RoadmapLegend() {
  const { user } = useAuthStore();
  const { simulateCompleteAndUnlockNext, animatingConnectionId, getCurrentDataset } = useRoadmapStore();
  const dataset = getCurrentDataset();

  // Cálculo dinámico en tiempo real del progreso de sincronización
  const totalNodes = dataset.nodes.length || 1;
  const completedOrUnlockedNodes = dataset.nodes.filter((n) => n.isUnlocked).length;
  const syncPercent = Math.round((completedOrUnlockedNodes / totalNodes) * 100);

  const totalCells = 12;
  const filledCells = Math.round((syncPercent / 100) * totalCells);

  const cellsContainerRef = useRef<HTMLDivElement | null>(null);

  // Animación de pulso cuántico con GSAP sobre las celdas activas
  useEffect(() => {
    if (!cellsContainerRef.current) return;
    const activeElements = cellsContainerRef.current.querySelectorAll('.sync-cell-filled');
    if (!activeElements.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        activeElements,
        { opacity: 0.7, scaleY: 0.95 },
        {
          opacity: 1,
          scaleY: 1.05,
          duration: 1.2,
          stagger: 0.08,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        }
      );
    }, cellsContainerRef);

    return () => ctx.revert();
  }, [filledCells]);

  return (
    <footer className="h-13 border-t border-slate-900/90 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between text-xs font-mono z-20 shrink-0 select-none">
      {/* Racha y XP acumulados */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-orange-400 font-bold">
          <IconFlame className="w-4 h-4 fill-orange-500" />
          <span>{user?.streak || 1} días de racha</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <IconStar className="w-4 h-4 fill-amber-400" />
          <span>{user?.totalXp || 50} XP acumulados</span>
        </div>
      </div>

      {/* TELEMETRY SYNC REACTOR (Ahora abajo al centro-derecha) */}
      <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800/80 shadow-inner">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <IconActivity className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
            TELEMETRY SYNC
          </span>
        </div>

        {/* Celdas de Energía del Reactor Cuántico */}
        <div ref={cellsContainerRef} className="flex items-center gap-1 p-0.5 bg-slate-950 rounded border border-slate-800">
          {Array.from({ length: totalCells }).map((_, idx) => {
            const isFilled = idx < filledCells;
            return (
              <div
                key={idx}
                className={`w-2 h-4 rounded-xs transition-all duration-300 ${
                  isFilled
                    ? 'sync-cell-filled bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.7)]'
                    : 'bg-slate-800/60 opacity-40'
                }`}
              />
            );
          })}
        </div>

        <div className="text-right pl-1">
          <span className="text-xs font-bold font-mono text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            {syncPercent}%
          </span>
        </div>
      </div>

      {/* Acciones y Nivel de Usuario */}
      <div className="flex items-center gap-4">
        {/* Botón táctico de prueba de cinemática de completado */}
        <button
          onClick={simulateCompleteAndUnlockNext}
          disabled={Boolean(animatingConnectionId)}
          className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
          title="Simula la finalización del módulo actual, el avance del láser y la rotura del candado"
        >
          <IconPlayerPlay className="w-3 h-3 text-cyan-400" />
          <span>Simular Desbloqueo</span>
        </button>

        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <IconShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Nivel {user?.level || 4} Architect</span>
        </div>
      </div>
    </footer>
  );
}
