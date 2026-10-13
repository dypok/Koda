'use client';

import React from 'react';
import { useRoadmapStore } from '@/stores/roadmap.store';

/** HUD inferior: solo el botón de desarrollo. La racha y el XP viven en la barra de Fusión. */
export function RoadmapLegend() {
  const { simulateCompleteAndUnlockNext, animatingConnectionId } = useRoadmapStore();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="absolute bottom-4 left-4 z-20">
      <button
        type="button"
        onClick={simulateCompleteAndUnlockNext}
        disabled={Boolean(animatingConnectionId)}
        title="Herramienta de desarrollo: simula completar y desbloquear el siguiente nodo"
        className="rounded-full border border-amber-500/40 bg-slate-950/80 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-amber-300 backdrop-blur-md transition-all hover:bg-amber-900/40 disabled:opacity-40 cursor-pointer"
      >
        Override dev
      </button>
    </div>
  );
}

export default RoadmapLegend;