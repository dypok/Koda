'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  loadPixi,
  dprCap,
  getGlowTexture,
  GLOW_TEXTURE_SIZE,
  useElementVisible,
  type PixiApp,
} from '@/lib/pixi/engine';

export type WeatherType = 'embers' | 'fireflies' | 'dust';

const PRESETS: Record<WeatherType, { tint: number; rise: [number, number]; sway: number; alpha: [number, number] }> = {
  embers: { tint: 0xfb923c, rise: [4, 7], sway: 14, alpha: [0.5, 0.95] },
  fireflies: { tint: 0x4ade80, rise: [5, 8], sway: 46, alpha: [0.3, 0.9] },
  dust: { tint: 0xfbbf24, rise: [6, 9], sway: 10, alpha: [0.25, 0.7] },
};

interface Particle {
  nx: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  swayAmp: number;
  alphaBase: number;
}

/** Clima ambiental por sección en Pixi: un canvas por sección, ticker parado fuera de pantalla (máx 14 sprites). */
export const WeatherLayer: React.FC<{ type: WeatherType; count?: number; className?: string }> = ({
  type,
  count = 12,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const [mountRef, visible] = useElementVisible<HTMLDivElement>();
  const appRef = useRef<PixiApp | null>(null);

  const particles = useMemo<Particle[]>(() => {
    const preset = PRESETS[type];
    return Array.from({ length: Math.min(14, count) }).map(() => ({
      nx: Math.random(),
      y: Math.random(),
      size: 2 + Math.random() * 3,
      speed: 1 / (preset.rise[0] + Math.random() * (preset.rise[1] - preset.rise[0])),
      phase: Math.random() * Math.PI * 2,
      swayAmp: preset.sway * (0.5 + Math.random() * 0.5),
      alphaBase: preset.alpha[0] + Math.random() * (preset.alpha[1] - preset.alpha[0]),
    }));
  }, [count, type]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || reduceMotion) return;
    let cancelled = false;
    let ro: ResizeObserver | null = null;

    const boot = async () => {
      const PIXI = await loadPixi();
      if (cancelled) return;
      const rect = mount.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.max(1, Math.round(rect.height));
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
      const view = app.view as unknown as HTMLCanvasElement;
      view.style.position = 'absolute';
      view.style.inset = '0';
      view.style.width = '100%';
      view.style.height = '100%';
      mount.appendChild(view);
      appRef.current = app;

      const texture = getGlowTexture(PIXI);
      const preset = PRESETS[type];
      const px = { w: W, h: H };
      const sprites = particles.map((p) => {
        const sp = new PIXI.Sprite(texture);
        sp.anchor.set(0.5);
        sp.tint = preset.tint;
        const sc = (p.size / GLOW_TEXTURE_SIZE) * 2;
        sp.scale.set(sc);
        sp.alpha = p.alphaBase;
        app.stage.addChild(sp);
        return { p, sp };
      });

      const tick = () => {
        const dt = Math.min(0.05, app.ticker.deltaMS / 1000);
        const time = performance.now() / 1000;
        for (const { p, sp } of sprites) {
          p.y -= p.speed * dt;
          if (p.y < -0.05) {
            p.y = 1.05;
            p.nx = Math.random();
          }
          const swayX = type === 'fireflies'
            ? Math.sin(time * 0.7 + p.phase) * p.swayAmp
            : Math.sin(time * 1.1 + p.phase) * p.swayAmp;
          sp.position.set(p.nx * px.w + swayX, p.y * px.h);
          sp.alpha = p.alphaBase * (type === 'fireflies' ? 0.55 + 0.45 * Math.sin(time * 1.4 + p.phase) : 1);
        }
      };
      app.ticker.add(tick);

      ro = new ResizeObserver(() => {
        if (cancelled || !app.renderer) return;
        const r = mount.getBoundingClientRect();
        px.w = Math.max(1, Math.round(r.width));
        px.h = Math.max(1, Math.round(r.height));
        if (app.renderer) {
          app.renderer.resize(px.w, px.h);
        }
      });
      ro.observe(mount);
    };

    void boot();
    return () => {
      cancelled = true;
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      const app = appRef.current;
      appRef.current = null;
      if (app) {
        try {
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
      }
    };
  }, [particles, type, reduceMotion, mountRef]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (visible) app.ticker.start();
    else app.ticker.stop();
  }, [visible]);

  if (reduceMotion) return null;

  return (
    <div ref={mountRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden select-none', className)} />
  );
};

export default WeatherLayer;
