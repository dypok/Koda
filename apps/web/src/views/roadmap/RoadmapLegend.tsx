'use client';

import React from 'react';
import { IconFlame, IconStar, IconShieldCheck, IconPlayerPlay } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/auth.store';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function RoadmapLegend() {
  const { user } = useAuthStore();
  const { simulateCompleteAndUnlockNext, animatingConnectionId } = useRoadmapStore();

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

      <div className="flex items-center gap-4">
        {/* Botón táctico de prueba de cinemática de completado */}
        <button
          onClick={simulateCompleteAndUnlockNext}
          disabled={Boolean(animatingConnectionId)}
          className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
          title="Simula la finalización del módulo actual, el avance del láser y la rotura del candado"
        >
          <IconPlayerPlay className="w-3 h-3 text-cyan-400" />
          <span>Simular Desbloqueo</span>
        </button>

        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <IconShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Nivel {user?.level || 4} Architect</span>
        </div>
      </div>
    </footer>
  );
}
