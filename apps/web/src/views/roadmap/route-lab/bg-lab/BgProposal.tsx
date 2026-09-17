'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useElementVisible } from '@/lib/pixi/engine';
import { BG_PROPOSALS, BgKey, createEngine } from './ascii-engines';

interface ProposalProps {
  engineKey: BgKey;
}

/** Marco común para los 15 fondos ASCII: canvas contenido, pausa fuera de pantalla. */
export const BgProposal: React.FC<ProposalProps> = ({ engineKey }) => {
  const reduceMotion = useReducedMotion();
  const [mountRef, visible] = useElementVisible<HTMLDivElement>();
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const meta = BG_PROPOSALS.find((m) => m.key === engineKey);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mount.prepend(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let engine = createEngine(engineKey, ctx, 1, 1);
    const fit = () => {
      const r = mount.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.round(r.width));
      H = canvas.height = Math.max(1, Math.round(r.height));
      engine = createEngine(engineKey, ctx, W, H);
      engine.frame(0, 0);
    };
    fit();

    if (reduceMotion) return () => canvas.remove();

    let raf = 0;
    let running = false;
    let last = performance.now();
    const loop = (now: number) => {
      if (!visibleRef.current) {
        running = false;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      engine.frame(now / 1000, dt);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!running && visibleRef.current) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    kick();
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) kick();
    });
    io.observe(mount);
    window.addEventListener('resize', fit);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', fit);
      canvas.remove();
    };
  }, [engineKey, reduceMotion, mountRef]);

  return (
    <div className="relative h-[70vh] overflow-hidden rounded-2xl border border-slate-800 bg-[#06070a]">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      <div className="absolute bottom-4 left-4 z-10 max-w-md rounded-xl border border-slate-800 bg-slate-950/85 px-4 py-3 backdrop-blur-md">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-300">
          R{meta?.num} — {meta?.label}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{meta?.blurb}</p>
      </div>
    </div>
  );
};

export default BgProposal;
