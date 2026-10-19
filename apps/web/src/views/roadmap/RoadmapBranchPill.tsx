'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { CAREER_BRANCHES, CareerBranchId } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { KodaLogoSvg } from '@/components/landing/KodaLogoSvg';
import { cn } from '@/lib/utils';

/** Píldora flotante: marca Koda + selector de rama de carrera. */
export const RoadmapBranchPill: React.FC = () => {
  const { activeBranchId, setBranch, isLoading } = useRoadmapStore();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const activeBranch = useMemo(
    () => CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0],
    [activeBranchId]
  );
  const BranchIcon = activeBranch.icon;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const pick = (id: CareerBranchId) => {
    setBranch(id);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="absolute left-4 top-4 z-30">
      <div className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-2.5 py-1.5 backdrop-blur-xl shadow-xl">
        <div
          aria-label="Koda"
          className="flex items-center select-none px-1.5 py-0.5"
        >
          <KodaLogoSvg className="h-5 w-auto select-none" />
        </div>
        <div className="h-4 w-px bg-slate-700/60" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={isLoading}
          aria-expanded={open}
          aria-label={`Rama activa: ${activeBranch.title}. Cambiar de rama`}
          className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-800/60 cursor-pointer"
        >
          <span className="shrink-0 flex items-center justify-center" style={{ color: activeBranch.color }}>
            <BranchIcon className="h-4 w-4" />
          </span>
          <span className="hidden max-w-36 truncate font-mono text-xs font-bold text-white sm:block">
            {activeBranch.title}
          </span>
          <CaretDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180 text-slate-200')} />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 space-y-1 rounded-2xl border border-slate-700/50 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-xl">
          <p className="px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-400">
            Cambiar especialidad
          </p>
          {CAREER_BRANCHES.map((b) => {
            const Icon = b.icon;
            const current = b.id === activeBranchId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => pick(b.id)}
                aria-current={current || undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors cursor-pointer',
                  current ? 'bg-orange-500/15 border border-orange-500/30 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                )}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${b.color}20`, color: b.color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-xs font-bold">{b.title}</span>
                  <span className="block truncate font-mono text-[10px] text-slate-500">{b.progressPercent}% completado</span>
                </span>
                {current && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoadmapBranchPill;
