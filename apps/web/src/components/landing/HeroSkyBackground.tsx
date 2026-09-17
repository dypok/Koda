'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  generateStars,
  clamp,
  STAR_COUNT_DEFAULT,
  NEAR_RADIUS,
  HOVER_RADIUS,
  PARALLAX_RADIUS,
  PARALLAX_STRENGTH,
  NEAR_DIM_RADIUS,
  RIPPLE_DURATION,
} from '@/models/landing/hero-sky.model';
import {
  loadPixi,
  dprCap,
  saveDataMode,
  getGlowTexture,
  GLOW_TEXTURE_SIZE,
  useElementVisible,
  type PixiApp,
} from '@/lib/pixi/engine';

export interface HeroSkyBackgroundProps {
  className?: string;
  starCount?: number;
  seed?: number;
  interactive?: boolean;
}

type Pointer = { x: number; y: number; inside: boolean };
type Ripple = { active: boolean; t: number; x: number; y: number };

/** Cielo del hero en Pixi (WebGL): mismo look que el canvas 2D, un solo ticker pausado fuera de pantalla. */
export const HeroSkyBackground: React.FC<HeroSkyBackgroundProps> = ({
  className,
  starCount = STAR_COUNT_DEFAULT,
  seed = 88,
  interactive = true,
}) => {
  const reduceMotion = useReducedMotion();
  const [mountRef, visible] = useElementVisible<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const [effectiveCount, setEffectiveCount] = useState(() => clamp(Math.round(starCount), 80, 200));

  useEffect(() => {
    const compute = () => {
      const small = window.matchMedia('(max-width: 640px)').matches;
      setEffectiveCount(saveDataMode() ? 60 : small ? 90 : clamp(Math.round(starCount), 80, 200));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [starCount]);

  const { stars, realStar } = useMemo(() => generateStars(effectiveCount, seed), [effectiveCount, seed]);

  const pointerRef = useRef<Pointer>({ x: -1, y: -1, inside: false });
  const rippleRef = useRef<Ripple>({ active: false, t: 0, x: 0, y: 0 });
  const discoveredRef = useRef(false);
  const appRef = useRef<{ app: PixiApp; tick: () => void } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const stage = stageRef.current;
    if (!mount || !stage) return;
    let cancelled = false;

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
      const view = app.view as unknown as HTMLCanvasElement;
      view.style.position = 'absolute';
      view.style.inset = '0';
      view.style.width = '100%';
      view.style.height = '100%';
      view.style.display = 'block';
      stage.appendChild(view);

      const texture = getGlowTexture(PIXI);
      const layer = new PIXI.Container();
      app.stage.addChild(layer);

      const px = { w: W, h: H };
      const sprites = stars
        .filter((s) => !s.isReal)
        .map((s) => {
          const sp = new PIXI.Sprite(texture);
          sp.anchor.set(0.5);
          sp.tint = 0xffffff;
          layer.addChild(sp);
          return { s, sp };
        });

      const halo = new PIXI.Sprite(texture);
      halo.anchor.set(0.5);
      halo.tint = 0xf59e0b;
      const core = new PIXI.Sprite(texture);
      core.anchor.set(0.5);
      core.tint = 0xfcd34d;
      core.eventMode = 'static';
      core.cursor = 'pointer';
      layer.addChild(halo, core);

      const rippleGfx = new PIXI.Graphics();
      layer.addChild(rippleGfx);

      let nearAmt = 0;
      const reduced = !!reduceMotion;

      const discover = () => {
        rippleRef.current = { active: true, t: 0, x: realStar.x, y: realStar.y };
        discoveredRef.current = true;
        if (reduced) app.ticker.start();
      };
      core.on('pointerdown', discover);

      const draw = (now: number) => {
        const time = now / 1000;
        const ptr = pointerRef.current;
        const dist = ptr.inside ? Math.hypot(ptr.x - realStar.x, ptr.y - realStar.y) : 1;
        const nearT = ptr.inside ? clamp(1 - dist / NEAR_RADIUS, 0, 1) : 0;
        nearAmt += (nearT - nearAmt) * 0.08;
        if (!discoveredRef.current && ptr.inside && dist < HOVER_RADIUS) discover();

        const rip = rippleRef.current;
        if (rip.active) {
          rip.t += 1 / 60;
          if (rip.t > RIPPLE_DURATION) rip.active = false;
        }
        const ripRad = rip.t * 0.65;

        for (const { s, sp } of sprites) {
          let opacity = s.baseOpacity;
          if (!reduced) opacity *= 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed * Math.PI * 2 + s.twinklePhase);
          let ox = 0;
          let oy = 0;
          let sizeMul = 1;
          if (ptr.inside && interactive && !reduced) {
            const dx = s.x - ptr.x;
            const dy = s.y - ptr.y;
            const d = Math.hypot(dx, dy);
            const influence = clamp(1 - d / PARALLAX_RADIUS, 0, 1);
            if (d > 0.001) {
              const par = influence * PARALLAX_STRENGTH;
              ox = (dx / d) * (par / Math.max(px.w, 1));
              oy = (dy / d) * (par / Math.max(px.h, 1));
            }
            opacity *= 1 + influence * 0.6;
            sizeMul *= 1 + influence * 0.15;
            if (nearAmt > 0) {
              const toReal = Math.hypot(s.x - realStar.x, s.y - realStar.y);
              if (toReal < NEAR_DIM_RADIUS) opacity *= 1 - nearAmt * 0.5 * (1 - toReal / NEAR_DIM_RADIUS);
            }
          }
          if (rip.active) {
            const toRip = Math.hypot(s.x - rip.x, s.y - rip.y);
            const ring = Math.abs(toRip - ripRad);
            if (ring < 0.05) {
              opacity *= 1 + (1 - ring / 0.05) * 1.2 * (1 - rip.t / RIPPLE_DURATION);
            } else if (toRip < ripRad) {
              opacity *= 0.8 + 0.2 * (rip.t / RIPPLE_DURATION);
            }
          }
          sp.position.set((s.x + ox) * px.w, (s.y + oy) * px.h);
          const sc = ((s.size * sizeMul) / GLOW_TEXTURE_SIZE) * 2;
          sp.scale.set(sc);
          sp.alpha = clamp(opacity, 0.04, 1);
        }

        const rx = realStar.x * px.w;
        const ry = realStar.y * px.h;
        const pulse = reduced ? 1 : 1 + 0.12 * Math.sin((time * Math.PI * 2) / 2.2);
        const corePx = (realStar.size + 1.5) * (1 + nearAmt * 0.2) * pulse;
        core.position.set(rx, ry);
        core.scale.set((corePx / GLOW_TEXTURE_SIZE) * 2);
        core.alpha = 0.75 + nearAmt * 0.25;
        const haloPulse = reduced ? 1 : 0.85 + 0.15 * Math.sin((time * Math.PI * 2) / 3);
        halo.position.set(rx, ry);
        halo.scale.set(((44 * (0.8 + nearAmt * 0.6) * haloPulse) / GLOW_TEXTURE_SIZE) * 2);
        halo.alpha = 0.35 + nearAmt * 0.55;

        rippleGfx.clear();
        if (rip.active) {
          const fade = 1 - rip.t / RIPPLE_DURATION;
          rippleGfx.lineStyle(2, 0xfbbf24, 0.9 * fade);
          rippleGfx.drawCircle(rip.x * px.w, rip.y * px.h, Math.max(1, ripRad * Math.max(px.w, px.h)));
        }
        if (reduced && !rip.active) app.ticker.stop();
      };

      const tick = () => draw(performance.now());
      appRef.current = { app, tick };

      const ro = new ResizeObserver(() => {
        const r = mount.getBoundingClientRect();
        px.w = Math.max(1, Math.round(r.width));
        px.h = Math.max(1, Math.round(r.height));
        app.renderer.resize(px.w, px.h);
        if (reduced) draw(performance.now());
      });
      ro.observe(mount);

      if (reduced) {
        draw(performance.now());
      } else {
        app.ticker.add(tick);
      }
    };

    void boot();
    return () => {
      cancelled = true;
      const entry = appRef.current;
      appRef.current = null;
      if (entry) {
        try {
          entry.app.ticker.remove(entry.tick);
          entry.app.ticker.stop();
        } catch {
          /* noop */
        }
        const v = entry.app.view as unknown as HTMLElement;
        if (v.parentNode === stage) stage.removeChild(v);
        entry.app.destroy(true);
      }
    };
  }, [stars, realStar, interactive, reduceMotion, mountRef]);

  useEffect(() => {
    const entry = appRef.current;
    if (!entry || reduceMotion) return;
    if (visible) entry.app.ticker.start();
    else entry.app.ticker.stop();
  }, [visible, reduceMotion]);

  useEffect(() => {
    if (!interactive || reduceMotion) return;
    const toLocal = (clientX: number, clientY: number) => {
      const el = mountRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inside = clientX >= r.left && clientX <= r.left + r.width && clientY >= r.top && clientY <= r.top + r.height;
      pointerRef.current = { x: (clientX - r.left) / Math.max(1, r.width), y: (clientY - r.top) / Math.max(1, r.height), inside };
    };
    const handleMove = (e: PointerEvent) => toLocal(e.clientX, e.clientY);
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [interactive, reduceMotion, mountRef]);

  return (
    <div
      ref={mountRef}
      onPointerMove={
        reduceMotion
          ? undefined
          : (e) => {
              const el = mountRef.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              pointerRef.current = {
                x: (e.clientX - r.left) / Math.max(1, r.width),
                y: (e.clientY - r.top) / Math.max(1, r.height),
                inside: true,
              };
            }
      }
      onPointerLeave={
        reduceMotion
          ? undefined
          : () => {
              pointerRef.current = { x: -1, y: -1, inside: false };
            }
      }
      className={cn(
        'absolute inset-0 overflow-hidden select-none transform-gpu',
        'bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(245,158,11,0.08),transparent_55%),linear-gradient(165deg,rgba(11,15,25,0.98),rgba(4,5,10,1))]',
        className
      )}
      aria-hidden="true"
    >
      <div ref={stageRef} className="absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 contain-paint"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(234,88,12,0.06), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(245,158,11,0.04), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7), inset 0 0 1px rgba(255,255,255,0.03)',
        }}
      />
    </div>
  );
};

export default HeroSkyBackground;
