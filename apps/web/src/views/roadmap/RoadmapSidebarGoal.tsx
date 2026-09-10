'use client';

import React from 'react';
import { IconFlame, IconClock, IconSparkles } from '@tabler/icons-react';

export function RoadmapSidebarGoal() {
  return (
    <div className="hidden lg:block pt-3 border-t border-slate-800/40 space-y-2.5">
      <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-1.5 text-amber-400">
          <IconFlame className="w-3.5 h-3.5 fill-amber-400" />
          <span>Meta Diaria</span>
        </span>
        <span className="text-slate-400">7 / 10 min</span>
      </div>

      {/* Progress track */}
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/60">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
          style={{ width: '70%' }}
        />
      </div>

      {/* Next Milestone telemetry */}
      <div className="flex items-center gap-2 pt-1">
        <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <IconSparkles className="w-3 h-3" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Siguiente Hito</span>
          <span className="text-[10px] font-mono font-semibold text-slate-300 truncate">02 • Python Intermedio</span>
        </div>
      </div>
    </div>
  );
}
