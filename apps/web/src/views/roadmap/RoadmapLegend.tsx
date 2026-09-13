'use client';

import React from 'react';
import { IconFlame, IconStar, IconShieldCheck, IconPlayerPlay, IconWifi } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/auth.store';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function RoadmapLegend() {
  const { user } = useAuthStore();
  const { simulateCompleteAndUnlockNext, animatingConnectionId, getCurrentDataset } = useRoadmapStore();
  const dataset = getCurrentDataset();

  // Cálculo dinámico en tiempo real
  const totalNodes = dataset.nodes.length || 1;
  const completedOrUnlockedNodes = dataset.nodes.filter((n) => n.isUnlocked).length;
  const syncPercent = Math.round((completedOrUnlockedNodes / totalNodes) * 100);

  return (
    <footer className="h-14 border-t border-slate-900/90 bg-slate-950/95 backdrop-blur-xl px-6 flex items-center justify-between text-xs font-mono z-20 shrink-0 select-none">
      {/* Racha de Fusión Fría y XP acumulados */}
      <div className="flex items-center gap-4">
        {/* Cold Fusion Streak Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] group cursor-default">
          <div className="p-1 rounded bg-gradient-to-br from-orange-500/20 to-cyan-500/20 border border-cyan-400/40 group-hover:scale-110 transition-transform">
            <IconFlame className="w-3.5 h-3.5 text-orange-400 fill-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
          </div>
          <span className="tracking-wider text-cyan-300 font-bold text-[11px] drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
            {user ? `${user.streak}D RACHA` : 'SIN SESIÓN'}
          </span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 group cursor-default">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <IconStar className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
          </div>
          <span className="tracking-wide text-amber-300 font-bold">+{user ? user.totalXp : '–'} XP</span>
        </div>
      </div>

      {/* Telemetry sync: estado en una sola línea, sin ruido */}
      <div
        role="progressbar"
        aria-label={`Sincronización: ${completedOrUnlockedNodes} de ${totalNodes} nodos, ${syncPercent}%`}
        aria-valuenow={syncPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800"
      >
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[11px] font-bold text-slate-300 tracking-wide">Sincronizado</span>
        <span className="text-[11px] text-slate-500 tabular-nums">
          {completedOrUnlockedNodes}/{totalNodes}
        </span>
        <span aria-hidden="true" className="w-20 sm:w-24 h-1 rounded-full bg-slate-800 overflow-hidden">
          <span
            className="block h-full rounded-full bg-cyan-400/90 transition-all duration-500"
            style={{ width: `${syncPercent}%` }}
          />
        </span>
        <span className="text-[11px] font-bold text-cyan-300 tabular-nums">{syncPercent}%</span>
      </div>

      {/* Acciones y Nivel de Usuario */}
      <div className="flex items-center gap-3">
        {/* Botón táctico de prueba: solo desarrollo, nunca producción */}
        {process.env.NODE_ENV !== 'production' ? (
          <button
            onClick={simulateCompleteAndUnlockNext}
            disabled={Boolean(animatingConnectionId)}
            className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 hover:scale-105 active:scale-95 cursor-pointer"
            title="Solo dev: simula la finalización del módulo actual"
          >
            <IconPlayerPlay className="w-3 h-3 text-cyan-400" />
            <span>Simular Desbloqueo</span>
          </button>
        ) : null}

        <div className="flex items-center gap-2 text-cyan-400 font-bold pl-2 border-l border-slate-800">
          <IconShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px]">Nivel {user ? user.level : '–'}</span>
        </div>
      </div>
    </footer>
  );
}
