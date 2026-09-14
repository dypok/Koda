'use client';

import React from 'react';
import { Flame, Star, Play, ShieldCheck, Check, Lock, Lightning, Atom, Sparkle } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

/**
 * HUD Inferior Táctico (Reactor Core & Consola de Telemetría):
 * - Cápsula de Fusión Fría (Streak): Cilindro de plasma de alta energía con indicador de carga.
 * - Tacómetro de XP Segmentado (XP Matrix): Instrumentación digital aeroespacial con barras LED.
 * - Sincronización Orbital con Micro-Constelaciones: Fibra óptica con gemas poliédricas conectadas.
 * - Insignia de Rango de Vuelo: Galón metálico de cadete estelar.
 * - Interruptor Dev de Sobremando Táctico (Safety Override).
 * - Cero efectos de audio (sin WebAudio ni SFX).
 */
export function RoadmapLegend() {
  const { user } = useAuthStore();
  const {
    simulateCompleteAndUnlockNext,
    animatingConnectionId,
    getCurrentDataset,
    activeNodeId,
    setActiveNode,
  } = useRoadmapStore();

  const dataset = getCurrentDataset();
  const nodes = dataset.nodes;

  const totalNodes = nodes.length || 1;
  const completedOrUnlockedNodes = nodes.filter((n) => n.isUnlocked).length;
  const syncPercent = Math.round((completedOrUnlockedNodes / totalNodes) * 100);

  return (
    <footer className="h-16 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between text-xs font-mono z-20 shrink-0 select-none relative">
      {/* Línea superior de resplandor cuántico */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.4) 25%, rgba(6,182,212,0.8) 50%, rgba(6,182,212,0.4) 75%, transparent 100%)',
        }}
      />

      {/* 1. Flanco Izquierdo: Cápsula de Fusión Fría (Racha) y Tacómetro de XP */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Cápsula de Fusión Fría (Streak Fuel Cell) */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.2)] group cursor-default">
          {/* Núcleo del Reactor con Pulso de Plasma */}
          <div className="relative w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500/30 to-amber-500/20 border border-orange-400/60 flex items-center justify-center shrink-0 overflow-hidden">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.9)] animate-pulse" />
            <div
              className="absolute inset-0 opacity-40 bg-orange-400 blur-sm pointer-events-none animate-ping"
              style={{ animationDuration: '3s' }}
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">
              FUSION REACTOR
            </span>
            <span className="text-[11px] font-black tracking-wider text-orange-300 drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]">
              {user ? `${user.streak}D CHARGED` : '1D CHARGED'}
            </span>
          </div>
        </div>

        {/* Tacómetro de XP Segmentado (Matrix Gauge) */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)] group cursor-default">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">
              XP CORE
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-bold text-amber-300 tracking-wide">
                +{user ? user.totalXp : 100} PTS
              </span>
              {/* Barras LED de nivel de potencia */}
              <div className="flex items-center gap-0.5" aria-hidden="true">
                <span className="w-1 h-2 rounded-xs bg-amber-400" />
                <span className="w-1 h-2.5 rounded-xs bg-amber-400" />
                <span className="w-1 h-3 rounded-xs bg-amber-400/80" />
                <span className="w-1 h-3.5 rounded-xs bg-amber-400/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Centro: Línea de Sincronización Orbital con Micro-Gemas de Constelación */}
      <div
        role="progressbar"
        aria-label={`Sincronización orbital: ${completedOrUnlockedNodes} de ${totalNodes} módulos, ${syncPercent}%`}
        aria-valuenow={syncPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="hidden md:flex items-center gap-3.5 px-4 py-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-2">
          <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            ORBIT SYNC
          </span>
          <span className="text-[10px] font-mono font-bold text-cyan-300 tabular-nums">
            {syncPercent}%
          </span>
        </div>

        {/* Tendido de Fibra Óptica con Micro-Gemas */}
        <div className="flex items-center gap-1.5 relative py-1">
          {/* Línea de fibra óptica continua de fondo */}
          <div
            className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-[2px] bg-slate-800"
            aria-hidden="true"
          />

          {nodes.map((node, i) => {
            const isCompleted = node.variant === 'completed';
            const isUnlocked = node.isUnlocked;
            const isActive = node.id === activeNodeId;
            const isBoss = node.variant === 'boss';

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveNode(node.id)}
                title={`${node.code} · ${node.label} (${isUnlocked ? 'Desbloqueado' : 'Bloqueado'})`}
                className={cn(
                  'relative z-10 w-4 h-4 rotate-45 rounded-xs transition-all duration-300 flex items-center justify-center cursor-pointer',
                  isActive
                    ? 'scale-125 ring-2 ring-cyan-400 shadow-[0_0_10px_#22d3ee]'
                    : 'hover:scale-110',
                  isBoss
                    ? isUnlocked
                      ? 'bg-rose-500 border border-rose-300'
                      : 'bg-rose-950/80 border border-rose-800'
                    : isCompleted
                    ? 'bg-emerald-400 border border-emerald-200 shadow-[0_0_6px_#34d399]'
                    : isUnlocked
                    ? 'bg-cyan-500/80 border border-cyan-300'
                    : 'bg-slate-900 border border-slate-700'
                )}
              >
                {/* Icono miniatura centrado en la gema */}
                <div className="-rotate-45 flex items-center justify-center">
                  {isCompleted ? (
                    <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                  ) : !isUnlocked ? (
                    <Lock className="w-2 h-2 text-slate-500" />
                  ) : (
                    <span className="text-[7px] font-mono font-bold text-slate-950 leading-none">
                      {node.code}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Flanco Derecho: Insignia de Rango de Piloto & Sobremando Dev */}
      <div className="flex items-center gap-3">
        {/* Sobremando de Pruebas (Safety Override Key) */}
        {process.env.NODE_ENV !== 'production' ? (
          <button
            type="button"
            onClick={simulateCompleteAndUnlockNext}
            disabled={Boolean(animatingConnectionId)}
            className="group relative h-8 px-3 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 hover:border-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-2 transition-all disabled:opacity-40 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            style={{
              clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
            }}
            title="Herramienta de desarrollo: simula completar y desbloquear el siguiente nodo"
          >
            <span className="text-[8px] opacity-40 group-hover:opacity-75 tracking-tighter">///</span>
            <Play className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">OVERRIDE DEV</span>
          </button>
        ) : null}

        {/* Insignia de Rango de Vuelo (Pilot Flight Wings) */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/25 shadow-[0_0_15px_rgba(6,182,212,0.15)] group cursor-default"
          style={{
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          }}
        >
          <div className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[7px] font-mono tracking-widest text-slate-400 uppercase">
              CADETE ESTELAR
            </span>
            <span className="text-[10px] font-mono font-black text-cyan-300 tracking-wider uppercase">
              CLASE {user ? user.level : 'I'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
