'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MiniLessonPreview } from '../MiniLessonPreview';
import { DEMOS } from './demo-proposals';
import { DemoSwitch } from './DemoSwitch';

const HASH_RE = /^#p(\d{1,2})$/;
const LS_KEY = 'koda-demo-lab';

function indexFromHash(): number | null {
  if (typeof window === 'undefined') return null;
  const m = HASH_RE.exec(window.location.hash);
  if (!m) return null;
  const i = DEMOS.findIndex((d) => d.num === Number(m[1]));
  return i >= 0 ? i : null;
}

/** Laboratorio de propuestas de la tarjeta demo con switch P1..P12. */
export const DemoLab: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fromHash = indexFromHash();
    if (fromHash !== null) {
      setActive(fromHash);
      return;
    }
    try {
      const saved = window.localStorage.getItem(LS_KEY);
      const i = DEMOS.findIndex((d) => d.id === saved);
      if (i >= 0) setActive(i);
    } catch {
      // solo sesión
    }
  }, []);

  const change = useCallback((i: number) => {
    setActive(i);
    try {
      window.localStorage.setItem(LS_KEY, DEMOS[i].id);
      window.history.replaceState(null, '', `#p${DEMOS[i].num}`);
    } catch {
      // sin almacenamiento
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (DEMOS[active].id === 'p9') return;
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      change((active + (e.key === 'ArrowRight' ? 1 : -1) + DEMOS.length) % DEMOS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, change]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {'$ koda demo-lab --lesson-preview'}
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
            12 propuestas, un switch
          </h1>
        </div>
        <Link
          href="/#vista-previa"
          className="rounded-[8px] border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          ← Volver a la landing
        </Link>
      </div>

      <DemoSwitch active={active} onChange={change} />

      <div className="flex justify-center">
        <MiniLessonPreview key={DEMOS[active].id} demo={DEMOS[active].id} />
      </div>

      <p className="font-mono text-[11px] text-slate-600">
        {'// ←/→ para ciclar (pausado en P9 para no chocar con A–D) · #pN compartible · solo preview'}
      </p>
    </div>
  );
};

export default DemoLab;
