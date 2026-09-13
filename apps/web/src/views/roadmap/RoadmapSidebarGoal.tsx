'use client';

import React from 'react';
import {
  IconFlame,
  IconTarget,
  IconLock,
  IconSnowflake,
  IconShieldCheck,
  IconBolt,
  IconSkull,
  IconSparkles,
} from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

export function RoadmapSidebarGoal() {
  const { viewMode, coursesDataset, lessonsDataset, setActiveNode } = useRoadmapStore();
  const { user } = useAuthStore();

  const currentDataset = viewMode === 'courses' ? coursesDataset : lessonsDataset;
  const unlockedCount = currentDataset.nodes.filter((n) => n.isUnlocked).length;
  const totalCount = currentDataset.nodes.length || 1;
  const routePercent = Math.round((unlockedCount / totalCount) * 100);

  // Daily XP calculation (target: 50 XP per 16_GAMIFICATION.md)
  const dailyTargetXp = 50;
  const currentDailyXp = user?.totalXp ? Math.min(dailyTargetXp, user.totalXp % 50 || 35) : 35;
  const dailyProgressPercent = Math.min(100, Math.round((currentDailyXp / dailyTargetXp) * 100));

  // Circular gauge geometry
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dailyProgressPercent / 100) * circumference;

  // Streak data and Freeze tokens (16_GAMIFICATION.md §7.4: max 2 freeze shields)
  const streakDays = user?.streak ?? 3;
  const activeFreezes = 1; // 1 activo de 2 posibles por defecto en MVP

  const nextMilestone =
    currentDataset.nodes.find((n) => !n.isUnlocked && n.variant !== 'boss') ||
    currentDataset.nodes.find((n) => !n.isUnlocked) ||
    null;

  return (
    <div className="hidden lg:block pt-3 border-t border-slate-800/40 space-y-3.5">
      {/* 1. Daily XP Radial Gauge & Streak Hub */}
      <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800/80 relative overflow-hidden shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3">
          {/* Radial SVG Dial */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <defs>
                <linearGradient id="dailyXpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              {/* Background ring */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Progress dynamic ring */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="url(#dailyXpGradient)"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))',
                }}
              />
            </svg>
            {/* Center icon / percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <IconBolt className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-[9px] font-mono font-bold text-slate-200 leading-none mt-0.5">
                {dailyProgressPercent}%
              </span>
            </div>
          </div>

          {/* Daily XP telemetry metrics */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Meta Diaria
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-400 tabular-nums">
                {currentDailyXp}/{dailyTargetXp} XP
              </span>
            </div>

            {/* Streak & Freeze Shield badges */}
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold"
                title="Racha de estudio activa"
              >
                <IconFlame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{streakDays} d</span>
              </div>

              {/* Cryogenic Freeze Shields (16_GAMIFICATION.md §7.4) */}
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-[10px] font-mono font-bold"
                title="Escudo de Racha Criogénico: protege tu racha si descansas hoy (1/2 almacenados)"
              >
                <IconSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeFreezes}/2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Route progress overall progress bar */}
      <div className="space-y-1.5 px-0.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-400">
            <IconSparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avance de Ruta</span>
          </span>
          <span className="text-slate-400 tabular-nums font-mono">
            {unlockedCount}/{totalCount} ({routePercent}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            style={{ width: `${routePercent}%` }}
          />
        </div>
      </div>

      {/* 3. Interactive Tactical Siguiente Hito */}
      <div className="space-y-1.5 px-0.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <IconTarget className="w-3.5 h-3.5" />
            <span>Siguiente Hito</span>
          </span>
          {nextMilestone?.xp ? (
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
              +{nextMilestone.xp} XP
            </span>
          ) : null}
        </div>

        {nextMilestone ? (
          <button
            type="button"
            onClick={() => setActiveNode(nextMilestone.id)}
            title="Hacer clic para enfocar este nodo en el starmap"
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-200 group text-left cursor-pointer shadow-sm"
          >
            <div
              className={cn(
                'p-2 rounded-lg shrink-0 border transition-transform duration-200 group-hover:scale-105',
                nextMilestone.variant === 'boss'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40'
              )}
            >
              {nextMilestone.variant === 'boss' ? (
                <IconSkull className="w-4 h-4" />
              ) : (
                <IconLock className="w-4 h-4" />
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                  {nextMilestone.code} • {nextMilestone.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                {nextMilestone.subtitle || 'Objetivo estelar bloqueado'}
              </span>
            </div>
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 text-center flex items-center justify-center gap-1.5">
            <IconShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ruta estelar dominada al 100%</span>
          </div>
        )}
      </div>
    </div>
  );
}
