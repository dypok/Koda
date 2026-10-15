'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ROUTE_PROPOSALS } from './route-proposals';
import { RouteSwitch } from './RouteSwitch';
import { RouteActual } from './proposals/RouteActual';
import { RouteConstellation } from './proposals/RouteConstellation';
import { RoutePipeline } from './proposals/RoutePipeline';
import { RouteDeck } from './proposals/RouteDeck';
import { RouteEdgeStyle } from './proposals/RouteEdgeStyle';
import { ChromeSlim } from './proposals/ChromeSlim';
import { ChromePills } from './proposals/ChromePills';
import { ChromeTerminal } from './proposals/ChromeTerminal';
import { BgProposal } from './bg-lab/BgProposal';

const HASH_RE = /^#r(\d{1,2})$/;
const LS_KEY = 'koda-route-lab';

function indexFromHash(): number | null {
  if (typeof window === 'undefined') return null;
  const m = HASH_RE.exec(window.location.hash);
  if (!m) return null;
  const i = ROUTE_PROPOSALS.findIndex((v) => v.num === Number(m[1]));
  return i >= 0 ? i : null;
}

/** Laboratorio de propuestas de la ruta Lua con switch R0..R3. Solo preview. */
export const RouteLab: React.FC = () => {
  const [active, setActive] = useState(0);
  const [lastAction, setLastAction] = useState('listo · elige una propuesta con el switch o ←/→');

  useEffect(() => {
    const fromHash = indexFromHash();
    if (fromHash !== null) {
      setActive(fromHash);
      return;
    }
    try {
      const saved = window.localStorage.getItem(LS_KEY);
      const i = ROUTE_PROPOSALS.findIndex((v) => v.id === saved);
      if (i >= 0) setActive(i);
    } catch {
      // solo sesión
    }
  }, []);

  const change = useCallback((i: number) => {
    setActive(i);
    try {
      window.localStorage.setItem(LS_KEY, ROUTE_PROPOSALS[i].id);
      window.history.replaceState(null, '', `#r${ROUTE_PROPOSALS[i].num}`);
    } catch {
      // sin almacenamiento
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      change((active + (e.key === 'ArrowRight' ? 1 : -1) + ROUTE_PROPOSALS.length) % ROUTE_PROPOSALS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, change]);

  const onAction = useCallback((msg: string) => setLastAction(msg), []);
  const proposal = ROUTE_PROPOSALS[active];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {'$ koda route-lab --lua-route'}
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">32 diseños, un switch</h1>
        </div>
        <Link
          href="/"
          className="rounded-[8px] border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
        >
          ← Volver a la ruta
        </Link>
      </div>

      <RouteSwitch active={active} onChange={change} />

      <div key={proposal.id}>
        {proposal.id === 'r0-actual' && <RouteActual onAction={onAction} />}
        {proposal.id === 'r1-constellation' && <RouteConstellation onAction={onAction} />}
        {proposal.id === 'r2-pipeline' && <RoutePipeline onAction={onAction} />}
        {proposal.id === 'r3-deck' && <RouteDeck onAction={onAction} />}
        {proposal.id === 'r4-edge-flow' && <RouteEdgeStyle style="flow" tagline="Flujo de energía" onAction={onAction} />}
        {proposal.id === 'r5-edge-packets' && <RouteEdgeStyle style="packets" tagline="Paquetes de datos" onAction={onAction} />}
        {proposal.id === 'r6-edge-pulse' && <RouteEdgeStyle style="pulse" tagline="Pulso cometa" onAction={onAction} />}
        {proposal.id === 'r7-node-hex' && <RouteEdgeStyle style="static" nodes="hex" tagline="Hexágono táctico" onAction={onAction} />}
        {proposal.id === 'r8-node-donut' && <RouteEdgeStyle style="static" nodes="donut" tagline="Dona de progreso" onAction={onAction} />}
        {proposal.id === 'r9-line-twin' && <RouteEdgeStyle style="pulse" design="twin" tagline="Haz doble + pulso" onAction={onAction} />}
        {proposal.id === 'r10-line-morse' && <RouteEdgeStyle style="flow" design="morse" tagline="Morse en marcha" onAction={onAction} />}
        {proposal.id === 'r11-unlock-shock' && <RouteEdgeStyle style="pulse" unlock="shockwave" tagline="Onda expansiva" onAction={onAction} />}
        {proposal.id === 'r12-unlock-ignite' && <RouteEdgeStyle style="pulse" unlock="ignition" tagline="Ignición por barrido" onAction={onAction} />}
        {proposal.id === 'r13-chrome-slim' && <ChromeSlim onAction={onAction} />}
        {proposal.id === 'r14-chrome-pills' && <ChromePills onAction={onAction} />}
        {proposal.id === 'r15-chrome-terminal' && <ChromeTerminal onAction={onAction} />}
        {proposal.bg && <BgProposal engineKey={proposal.bg} />}
      </div>

      <div className="flex items-center gap-2 rounded-[8px] border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs">
        <span aria-hidden="true" className="font-bold text-[#8FA8FF]">&gt;_</span>
        <span role="status" className="truncate text-slate-300">
          {lastAction}
        </span>
      </div>

      <p className="font-mono text-[11px] text-slate-600">
        {'←/→ para ciclar · #rN compartible · solo preview, ruta en / no cambia'}
      </p>
    </div>
  );
};

export default RouteLab;
