'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { CAREER_BRANCHES, CareerBranchId } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

const KodaBracesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="522 320 175 130"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="koda-pill-brace-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="45%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
    <g transform="matrix(1.3333333,0,0,-1.3333333,0,745.33333)">
      <g id="g_open_brace" transform="translate(435.7425,305.7324)">
        <path
          fill="url(#koda-pill-brace-grad)"
          d="m 0,0 v 11.088 h -12 c 0,0 -12.717,-0.197 -13.696,-12.001 0,0 0.848,-10.37 0,-18 0,0 -0.701,-9.163 -14.054,-8.919 v -11.934 c 0,0 13.598,0.538 13.598,-9.636 l 0.065,-12.555 c 0,0 1.63,-18.391 26.087,-16.369 v 11.462 h -5.315 c 0,0 -9.294,-2.332 -8.642,16.973 0,0 1.044,10.63 -6.391,13.956 0,0 -1.916,0.326 -2.136,1.794 0,0 -0.391,1.663 2.446,2.127 0,0 7.647,3.384 6.864,17.471 0,0 -2.022,12.146 6.391,14.543 z"
        />
      </g>
      <g id="g_close_brace" transform="translate(492.9382,253.0041)">
        <path
          fill="url(#koda-pill-brace-grad)"
          d="m 0,0 v 12.962 h -8.071 c 0,0 -6.407,0.489 -7.875,-6.481 0,0 -1.565,-5.796 -1.174,-15.579 0.392,-9.782 -8.641,-15.13 -8.641,-15.13 0,0 -6.196,-2.935 -18.196,-1.892 v 12.131 h 6.979 c 0,0 6.554,-0.587 7.532,6.456 0,0 0.489,3.522 -0.097,9.49 0,0 -2.153,9.293 6.847,15.358 0,0 0.75,0.506 0.718,1.777 0,0 0.13,1.386 -0.962,1.941 0,0 -2.837,1.834 -5.161,7.165 0,0 -0.497,0.4 -1.051,6.432 v 8.446 c 0,0 0.522,9.261 -6.978,9.652 h -7.827 v 11.087 h 10.631 c 0,0 14.446,0.359 16.011,-12.554 0,0 0.147,-6.457 -0.587,-13.794 0,0 -0.098,-11.201 8.755,-13.353 l 9.147,0 v 13.72 L 27.065,18.736 Z"
        />
      </g>
    </g>
  </svg>
);

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
        <div
          aria-label="Koda"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 select-none shadow-[0_0_12px_rgba(249,115,22,0.12)]"
        >
          <KodaBracesIcon className="h-3.5 w-auto select-none drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]" />
        </div>
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
