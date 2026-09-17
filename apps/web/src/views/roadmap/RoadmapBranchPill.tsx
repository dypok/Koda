'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CaretDown } from '@phosphor-icons/react';
import { CAREER_BRANCHES, CareerBranchId } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
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
    <div ref={boxRef} className="absolute left-4 top-4 z-20">
      <div className="flex items-center gap-1 rounded-full border border-slate-700/50 bg-slate-900/40 py-1.5 pl-1.5 pr-1 backdrop-blur-xl shadow-xl">
        <Link
          href="/"
          aria-label="Koda - volver a la landing"
          className="flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-black text-orange-400 transition-colors hover:bg-orange-500/20"
        >
          K
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={isLoading}
          aria-expanded={open}
          aria-label={`Rama activa: ${activeBranch.title}. Cambiar de rama`}
          className="flex items-center gap-2 rounded-full py-1.5 pl-1 pr-2.5 transition-colors hover:bg-slate-800/60 cursor-pointer"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border"
            style={{ backgroundColor: `${activeBranch.color}20`, borderColor: `${activeBranch.color}50`, color: activeBranch.color }}
          >
            <BranchIcon className="h-3.5 w-3.5" />
          </span>
          <span className="hidden max-w-32 truncate font-mono text-[11px] font-bold text-white sm:block">
            {activeBranch.title}
          </span>
          <CaretDown className={cn('h-3 w-3 text-slate-500 transition-transform', open && 'rotate-180 text-slate-200')} />
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
