'use client';

import React from 'react';
import { CAREER_BRANCHES, CareerBranchId } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

export function RoadmapSidebarBranches() {
  const { activeBranchId, setBranch } = useRoadmapStore();

  return (
    <div className="space-y-2">
      <div className="hidden lg:flex items-center px-2 pb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
        <span>Ramas de Carrera</span>
      </div>

      {CAREER_BRANCHES.map((branch) => {
        const Icon = branch.icon;
        const isSelected = activeBranchId === branch.id;
        return (
          <button
            key={branch.id}
            type="button"
            onClick={() => setBranch(branch.id as CareerBranchId)}
            className={cn(
              'w-full flex flex-col p-3 rounded-xl transition-all text-left group relative',
              isSelected
                ? 'bg-cyan-500/10 text-white border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-slate-800/40'
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div
                className={cn(
                  'p-2 rounded-lg shrink-0 border transition-transform duration-200 group-hover:scale-105',
                  isSelected ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-slate-900/80 border-slate-800'
                )}
                style={{ color: branch.color }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="hidden lg:flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold font-mono tracking-tight truncate">{branch.title}</span>
                  <span className="text-[10px] font-mono font-bold text-amber-400">★ {branch.earnedStars}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{branch.technologies}</span>
              </div>
            </div>

            {/* Progress indicator bar on active branch */}
            <div className="hidden lg:flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2.5 pt-1.5 border-t border-slate-800/50 w-full">
              <span>{branch.completedCourses}/{branch.totalCourses} cursos</span>
              <span className={cn('font-bold', isSelected ? 'text-cyan-400' : 'text-slate-500')}>{branch.progressPercent}%</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
