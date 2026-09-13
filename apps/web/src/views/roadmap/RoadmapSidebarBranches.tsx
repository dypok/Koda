'use client';

import React from 'react';
import { CAREER_BRANCHES, CareerBranchId } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

export function RoadmapSidebarBranches() {
  const { activeBranchId, setBranch, isLoading } = useRoadmapStore();

  return (
    <div className="space-y-2" role="group" aria-label="Ramas de carrera">
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
            disabled={isLoading}
            aria-pressed={isSelected}
            className={cn(
              'w-full flex flex-col p-2.5 sm:p-3 rounded-xl transition-all duration-300 text-left group relative active:scale-[0.98] cursor-pointer overflow-visible',
              isSelected
                ? 'text-white border'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/80'
            )}
            style={
              isSelected
                ? {
                    background: `linear-gradient(135deg, ${branch.color}15 0%, rgba(15,23,42,0.75) 100%)`,
                    borderColor: `${branch.color}60`,
                    boxShadow: `0 0 20px ${branch.color}20, inset 0 1px 0 ${branch.color}35`,
                  }
                : undefined
            }
          >
            {/* Left active vertical neon power rail */}
            <div
              className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-all duration-300"
              style={{
                backgroundColor: isSelected ? branch.color : 'transparent',
                boxShadow: isSelected ? `0 0 10px ${branch.color}` : 'none',
              }}
            />

            {/* Right Optical Docking Beam / Connector pointing into the starmap */}
            {isSelected && (
              <div
                className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 items-center pointer-events-none z-30"
                aria-hidden="true"
              >
                {/* Docking flare wedge */}
                <div
                  className="w-2.5 h-6 rounded-l-none rounded-r-md border-r border-y flex items-center justify-center backdrop-blur-sm"
                  style={{
                    backgroundColor: `${branch.color}25`,
                    borderColor: branch.color,
                    boxShadow: `0 0 10px ${branch.color}90`,
                  }}
                >
                  <div
                    className="w-1 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: branch.color }}
                  />
                </div>
                {/* Laser projection needle */}
                <div
                  className="w-2 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, ${branch.color} 0%, transparent 100%)`,
                    boxShadow: `0 0 6px ${branch.color}`,
                  }}
                />
              </div>
            )}

            {/* Collapsed Mode Floating Tooltip for < lg screens */}
            <div className="lg:hidden absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: branch.color }} />
                <p className="text-xs font-mono font-bold text-slate-100">{branch.title}</p>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-400 mt-1">
                <span className="font-bold" style={{ color: branch.color }}>{branch.progressPercent}% completado</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">★ {branch.earnedStars}/{branch.totalStars}</span>
              </div>
            </div>

            {/* Main card header */}
            <div className="flex items-center gap-3 w-full">
              <div
                className={cn(
                  'p-2 rounded-lg shrink-0 border transition-all duration-300 group-hover:scale-105',
                  isSelected ? 'border-opacity-60' : 'bg-slate-900/80 border-slate-800'
                )}
                style={{
                  color: branch.color,
                  backgroundColor: isSelected ? `${branch.color}20` : undefined,
                  borderColor: isSelected ? `${branch.color}60` : undefined,
                  boxShadow: isSelected ? `0 0 12px ${branch.color}30` : undefined,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="hidden lg:flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold font-mono tracking-tight truncate group-hover:text-white transition-colors">
                    {branch.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-0.5 shrink-0">
                    <span>★</span>
                    <span>{branch.earnedStars}</span>
                    <span className="text-slate-500 font-normal">/{branch.totalStars}</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                  {branch.technologies}
                </span>
              </div>
            </div>

            {/* Progress indicator track with LED glow */}
            <div className="hidden lg:flex flex-col gap-1.5 mt-2.5 pt-2 border-t border-slate-800/60 w-full">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isSelected ? branch.color : '#64748b' }}
                  />
                  <span>{branch.completedCourses}/{branch.totalCourses} cursos</span>
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{ color: isSelected ? branch.color : '#94a3b8' }}
                >
                  {branch.progressPercent}%
                </span>
              </div>
              <div className="w-full h-1 bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/80 p-0">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${branch.progressPercent}%`,
                    backgroundColor: branch.color,
                    boxShadow: isSelected ? `0 0 8px ${branch.color}` : undefined,
                  }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
