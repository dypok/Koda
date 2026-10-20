'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { loadPixi, dprCap } from '@/lib/pixi/engine';

const GLYPHS = ['{', '}', '<', '>', '=', ';', '(', ')', '#', '/'];
const COLORS = ['#fbbf24', '#34d399', '#38bdf8', '#f472b6', '#a78bfa'];

interface Bit {
  glyph: string;
  color: string;
  angle: number;
  dist: number;
  size: number;
  dur: number;
  spin: number;
}

/** Explosión de símbolos de código en Pixi: se monta, estalla ~1.6s y destruye el motor. */
export const CodeConfetti: React.FC<{ burstKey: number }> = ({ burstKey }) => {
  const reduceMotion = useReducedMotion();
  const mountRef = useRef<HTMLDivElement>(null);

  const parts = useMemo<Bit[]>(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        glyph: GLYPHS[i % GLYPHS.length] ?? '{',
        color: COLORS[i % COLORS.length] ?? '#fbbf24',
        angle: (i / 24) * Math.PI * 2 + Math.random() * 0.5,
        dist: 70 + Math.random() * 110,
        size: 12 + Math.random() * 10,
        dur: 1.1 + Math.random() * 0.5,
        spin: (Math.random() - 0.5) * 540,
      })),
    []
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || reduceMotion) return;
    let cancelled = false;
    let appInstance: { ticker: { remove: (fn: () => void) => void; stop: () => void }; view: unknown; destroy: (b: boolean) => void } | null = null;
    let tickFn: (() => void) | null = null;

    const boot = async () => {
      const PIXI = await loadPixi();
      if (cancelled) return;
      const parent = mount.parentElement;
      const W = Math.max(1, Math.round(parent?.clientWidth ?? 320));
      const H = Math.max(1, Math.round(parent?.clientHeight ?? 480));
      const app = new PIXI.Application({
        width: W,
        height: H,
        backgroundAlpha: 0,
        antialias: true,
        resolution: dprCap(),
      });
      if (cancelled) {
        try {
          app.destroy(true);
        } catch {
          /* noop */
        }
        return;
      }
      appInstance = app as unknown as typeof appInstance;
      const view = app.view as unknown as HTMLCanvasElement;
      view.style.position = 'absolute';
      view.style.inset = '0';
      view.style.width = '100%';
      view.style.height = '100%';
      mount.appendChild(view);

      const ox = W / 2;
      const oy = 64;
      const tx = parts.map((p) => {
        const t = new PIXI.Text(p.glyph, {
          fontFamily: 'ui-monospace, monospace',
          fontSize: Math.round(p.size),
          fill: p.color,
          fontWeight: 'bold',
        });
        t.anchor.set(0.5);
        t.position.set(ox, oy);
        app.stage.addChild(t);
        return { p, t, elapsed: 0 };
      });

      const tick = () => {
        if (cancelled || !app?.renderer) return;
        const dt = Math.min(0.05, app.ticker.deltaMS / 1000);
        let alive = 0;
        for (const b of tx) {
          if (!b?.t || b.t.destroyed) continue;
          b.elapsed += dt;
          const k = Math.min(1, b.elapsed / b.p.dur);
          if (k < 1) alive += 1;
          const eased = 1 - (1 - k) * (1 - k);
          b.t.position.set(ox + Math.cos(b.p.angle) * b.p.dist * eased, oy + (Math.sin(b.p.angle) * b.p.dist + 90) * eased);
          b.t.rotation = (b.p.spin * Math.PI * b.elapsed) / 180;
          b.t.alpha = 1 - k;
        }
        if (alive === 0) {
          try {
            app.ticker.remove(tick);
            app.ticker.stop();
          } catch {
            /* noop */
          }
          const v = app.view as unknown as HTMLElement;
          if (v && v.parentNode === mount) mount.removeChild(v);
          try {
            app.destroy(true);
          } catch {
            /* noop */
          }
          appInstance = null;
        }
      };
      tickFn = tick;
      app.ticker.add(tick);
    };

    void boot();
    return () => {
      cancelled = true;
      if (appInstance) {
        try {
          if (tickFn) appInstance.ticker.remove(tickFn);
          appInstance.ticker.stop();
        } catch {
          /* noop */
        }
        const v = appInstance.view as unknown as HTMLElement;
        if (v && v.parentNode === mount) mount.removeChild(v);
        try {
          appInstance.destroy(true);
        } catch {
          /* noop */
        }
        appInstance = null;
      }
      mount.replaceChildren();
    };
  }, [burstKey, parts, reduceMotion]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 motion-reduce:hidden"
    />
  );
};

export default CodeConfetti;
