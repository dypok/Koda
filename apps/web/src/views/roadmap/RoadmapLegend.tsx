'use client';

import React from 'react';
import { IconFlame, IconStar, IconShieldCheck } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/auth.store';

export function RoadmapLegend() {
  const { user } = useAuthStore();

  return (
    <footer className="h-12 border-t border-slate-900/90 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between text-xs font-mono z-20 shrink-0 select-none">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-orange-400 font-bold">
          <IconFlame className="w-4 h-4 fill-orange-500" />
          <span>{user?.streak || 1} días de racha</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <IconStar className="w-4 h-4 fill-amber-400" />
          <span>{user?.totalXp || 50} XP acumulados</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-cyan-400 font-bold">
        <IconShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Nivel {user?.level || 4} Architect</span>
      </div>
    </footer>
  );
}
