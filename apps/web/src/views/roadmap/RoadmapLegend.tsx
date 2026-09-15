'use client';

import React from 'react';
import { Flame, Star, Play, ShieldCheck } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { useRoadmapStore } from '@/stores/roadmap.store';

/** HUD inferior en píldoras flotantes: racha, XP y rango. */
export function RoadmapLegend() {
  const { user } = useAuthStore();
  const { simulateCompleteAndUnlockNext, animatingConnectionId } = useRoadmapStore();

  return (
    <>
      <div className="absolute bottom-4 left-4 z-20 flex flex-col items-start gap-2">
        {process.env.NODE_ENV !== 'production' ? (
          <button
            type="button"
            onClick={simulateCompleteAndUnlockNext}
            disabled={Boolean(animatingConnectionId)}
            title="Herramienta de desarrollo: simula completar y desbloquear el siguiente nodo"
            className="rounded-full border border-amber-500/40 bg-slate-950/80 px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider text-amber-300 backdrop-blur-md transition-all hover:bg-amber-900/40 disabled:opacity-40 cursor-pointer"
          >
            Override dev
          </button>
        ) : null}
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 py-1.5 pl-2 pr-4 backdrop-blur-md">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/15 border border-orange-400/40">
            <Flame aria-hidden="true" className="h-3.5 w-3.5 text-orange-400" weight="fill" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-mono text-xs font-black tracking-wider text-orange-300">
              {user ? `${user.streak}D` : '1D'}
            </span>
            <span className="font-mono text-[8px] tracking-widest text-slate-500 uppercase">
              Cadete · {user ? user.level : 'I'}
            </span>
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 py-1.5 pl-2 pr-4 backdrop-blur-md">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30">
          <Star aria-hidden="true" className="h-3.5 w-3.5 fill-amber-400 text-amber-300" />
        </span>
        <span className="font-mono text-xs font-bold tracking-wide text-amber-300">
          +{user ? user.totalXp : 100} XP
        </span>
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-cyan-300" />
      </div>
    </>
  );
}
