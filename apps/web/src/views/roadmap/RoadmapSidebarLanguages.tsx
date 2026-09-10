'use client';

import React from 'react';
import { IconLock } from '@tabler/icons-react';
import { SIDEBAR_LANGUAGES } from '@/models/roadmap/python-roadmap.mock';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

export function RoadmapSidebarLanguages() {
  const { selectedLanguageId, setLanguage } = useRoadmapStore();

  return (
    <div className="space-y-1.5">
      <div className="hidden lg:flex items-center justify-between px-3 pb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
        <span>Lenguajes & Tracks</span>
        <span className="text-cyan-400/80">1 Activo</span>
      </div>

      {SIDEBAR_LANGUAGES.map((lang) => {
        const Icon = lang.icon;
        const isSelected = selectedLanguageId === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => lang.isAvailable && setLanguage(lang.id)}
            disabled={!lang.isAvailable}
            className={cn(
              'w-full flex flex-col p-2.5 rounded-xl transition-all text-left group',
              isSelected
                ? 'bg-amber-500/10 text-white border border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
                : lang.isAvailable
                ? 'text-slate-300 hover:bg-slate-900/60 hover:text-white border border-transparent'
                : 'text-slate-600 cursor-not-allowed opacity-55 border border-transparent'
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-1.5 rounded-lg bg-slate-900/90 shrink-0 border border-slate-800/60" style={{ color: lang.color }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="hidden lg:flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold font-mono truncate">{lang.name}</span>
                  {lang.isAvailable ? (
                    <span className="text-[10px] font-mono text-amber-400 font-bold">★ {lang.earnedStars}/{lang.totalStars}</span>
                  ) : (
                    <IconLock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-0.5">
                  <span>{lang.isAvailable ? `${lang.completedCourses}/${lang.totalCourses} cursos` : 'Próximamente'}</span>
                  {lang.isAvailable && <span className="text-cyan-400 font-semibold">{lang.progressPercent}%</span>}
                </div>
              </div>
            </div>

            {/* Mini progress bar on active language */}
            {isSelected && lang.progressPercent !== undefined && (
              <div className="hidden lg:block w-full h-1 bg-slate-800/80 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full"
                  style={{ width: `${lang.progressPercent}%` }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
