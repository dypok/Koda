'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AVAILABLE_LANGUAGES } from '@/models/register/register.constants';
import { VARIANTS } from './variant-styles';
import { VariantSwitch } from './VariantSwitch';
import { VariantGrid } from './VariantGrid';

const ITEMS = AVAILABLE_LANGUAGES.slice(0, 6);
const HASH_RE = /^#v(\d{1,2})$/;
const LS_KEY = 'koda-variant-lab';

function indexFromHash(): number | null {
  if (typeof window === 'undefined') return null;
  const m = HASH_RE.exec(window.location.hash);
  if (!m) return null;
  const n = Number(m[1]);
  const i = VARIANTS.findIndex((v) => v.num === n);
  return i >= 0 ? i : null;
}

/** Laboratorio de variantes del grid del register con switch V1..V12. */
export const VariantLab: React.FC = () => {
  const [active, setActive] = useState(0);
  const [selectedId, setSelectedId] = useState('python');

  useEffect(() => {
    const fromHash = indexFromHash();
    if (fromHash !== null) {
      setActive(fromHash);
      return;
    }
    try {
      const saved = window.localStorage.getItem(LS_KEY);
      const i = VARIANTS.findIndex((v) => v.id === saved);
      if (i >= 0) setActive(i);
    } catch {
      // solo sesión
    }
  }, []);

  const change = useCallback((i: number) => {
    setActive(i);
    try {
      window.localStorage.setItem(LS_KEY, VARIANTS[i].id);
      window.history.replaceState(null, '', `#v${VARIANTS[i].num}`);
    } catch {
      // sin almacenamiento
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      change((active + (e.key === 'ArrowRight' ? 1 : -1) + VARIANTS.length) % VARIANTS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, change]);

  const variant = VARIANTS[active];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {'$ koda variant-lab --register-grid'}
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
            12 estilos, un switch
          </h1>
        </div>
        <Link
          href="/register"
          className="rounded-[8px] border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          ← Volver al register
        </Link>
      </div>

      <VariantSwitch active={active} onChange={change} />

      <VariantGrid
        variantId={variant.id}
        tokens={variant.tokens}
        items={ITEMS}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <p className="font-mono text-[11px] text-slate-600">
        {'←/→ para ciclar · #vN compartible · solo preview, el flujo real no cambia'}
      </p>
    </div>
  );
};

export default VariantLab;
