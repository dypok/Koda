'use client';

import React, { useRef, useEffect } from 'react';
import { IconFlame, IconStar, IconShieldCheck, IconPlayerPlay, IconWifi, IconGauge } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/auth.store';
import { useRoadmapStore } from '@/stores/roadmap.store';
import gsap from 'gsap';

export function RoadmapLegend() {
  const { user } = useAuthStore();
  const { simulateCompleteAndUnlockNext, animatingConnectionId, getCurrentDataset } = useRoadmapStore();
  const dataset = getCurrentDataset();

  // Cálculo dinámico en tiempo real
  const totalNodes = dataset.nodes.length || 1;
  const completedOrUnlockedNodes = dataset.nodes.filter((n) => n.isUnlocked).length;
  const syncPercent = Math.round((completedOrUnlockedNodes / totalNodes) * 100);

  const dialNeedleRef = useRef<HTMLDivElement | null>(null);
  const pulseSweepRef = useRef<HTMLDivElement | null>(null);

  // Animación GSAP de precisión para el indicador de telemetría
  useEffect(() => {
    if (dialNeedleRef.current) {
      gsap.to(dialNeedleRef.current, {
        width: `${syncPercent}%`,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, [syncPercent]);

  useEffect(() => {
    if (pulseSweepRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          pulseSweepRef.current,
          { x: '-100%', opacity: 0.3 },
          {
            x: '200%',
            opacity: 1,
            duration: 2.2,
            repeat: -1,
            ease: 'power2.inOut',
          }
        );
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <footer className="h-14 border-t border-slate-900/90 bg-slate-950/95 backdrop-blur-xl px-6 flex items-center justify-between text-xs font-mono z-20 shrink-0 select-none">
      {/* Racha y XP acumulados con micro-animaciones */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-orange-400 font-bold group cursor-default">
          <div className="p-1 rounded bg-orange-500/10 border border-orange-500/20 group-hover:scale-110 transition-transform">
            <IconFlame className="w-3.5 h-3.5 fill-orange-500" />
          </div>
          <span className="tracking-wide">{user?.streak || 1}D RACHA</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-bold group cursor-default">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <IconStar className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span className="tracking-wide">+{user?.totalXp || 50} XP</span>
        </div>
      </div>

      {/* COCKPIT HIGH-PRECISION TELEMETRY SYNC */}
      <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]">
        {/* Radar Link Telemetry Header */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <IconWifi className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-400">
              <span className="font-bold text-cyan-300">TELEMETRY SYNC</span>
              <span className="text-slate-600">//</span>
              <span className="text-emerald-400 font-bold">LINK 1420MHz</span>
            </div>
            <div className="text-[8px] text-slate-500 tracking-tight">
              {completedOrUnlockedNodes}/{totalNodes} NODES ONLINE
            </div>
          </div>
        </div>

        {/* Precision HUD Beam Bar */}
        <div className="flex flex-col gap-1 w-32 sm:w-40">
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span className="text-slate-400 text-[8px]">CORE FREQ</span>
            <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] font-mono">
              {syncPercent}%
            </span>
          </div>

          <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-px">
            {/* GSAP smoothly animated fill */}
            <div
              ref={dialNeedleRef}
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full relative overflow-hidden"
              style={{ width: `${syncPercent}%` }}
            >
              {/* Photon pulse sweep */}
              <div
                ref={pulseSweepRef}
                className="absolute inset-0 w-8 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones y Nivel de Usuario */}
      <div className="flex items-center gap-3">
        {/* Botón táctico de prueba de cinemática de completado */}
        <button
          onClick={simulateCompleteAndUnlockNext}
          disabled={Boolean(animatingConnectionId)}
          className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 hover:scale-105 active:scale-95 cursor-pointer"
          title="Simula la finalización del módulo actual, el avance del láser y la rotura del candado"
        >
          <IconPlayerPlay className="w-3 h-3 text-cyan-400" />
          <span>Simular Desbloqueo</span>
        </button>

        <div className="flex items-center gap-2 text-cyan-400 font-bold pl-2 border-l border-slate-800">
          <IconShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px]">Nivel {user?.level || 4}</span>
        </div>
      </div>
    </footer>
  );
}
