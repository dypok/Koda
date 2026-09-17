'use client';

import React from 'react';
import { IconFlame, IconTarget, IconLock } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function RoadmapSidebarGoal() {
  const { viewMode, coursesDataset, lessonsDataset } = useRoadmapStore();
  const currentDataset = viewMode === 'courses' ? coursesDataset : lessonsDataset;
  const nextMilestone =
    currentDataset.nodes.find((n) => !n.isUnlocked && n.variant !== 'boss') ||
    currentDataset.nodes.find((n) => !n.isUnlocked) ||
    currentDataset.nodes[1];

  return (
    <div className="hidden lg:block pt-3 border-t border-slate-800/40 space-y-3">
      {/* Daily Goal telemetry */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1.5 text-amber-400">
            <IconFlame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Meta Diaria</span>
          </span>
          <span className="text-slate-400">7 / 10 min</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/60">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: '70%' }}
          />
        </div>
      </div>

      {/* Restructured Siguiente Hito */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <IconTarget className="w-3.5 h-3.5" />
            <span>Siguiente Hito</span>
          </span>
          <div className="flex items-center gap-1.5">
            {nextMilestone?.xp ? (
              <span className="text-[10px] font-mono font-bold text-amber-400">
                +{nextMilestone.xp} XP
              </span>
            ) : null}
            {nextMilestone?.statusText ? (
              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-[9px] text-rose-400 font-bold">
                {nextMilestone.statusText}
              </span>
            ) : null}
          </div>
        </div>

        {nextMilestone ? (
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <div className="p-1.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50 shrink-0">
              <IconLock className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-mono font-bold text-slate-200 truncate">
                {nextMilestone.code} • {nextMilestone.label}
              </span>
              {nextMilestone.subtitle ? (
                <span className="text-[10px] font-mono text-slate-500 truncate">
                  {nextMilestone.subtitle}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
