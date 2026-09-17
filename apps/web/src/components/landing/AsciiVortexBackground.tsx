'use client';

import React, { useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  loadPixi,
  dprCap,
  saveDataMode,
  useElementVisible,
  type PixiApp,
  type PixiSprite,
  type PixiTexture,
} from '@/lib/pixi/engine';

const ASCII_CHARS = ['@', '#', '%', '*', '+', '=', '-', ':', '.'];
const GOLD_TONES = [0xf59e0b, 0xfbbf24, 0xfcd34d, 0xd97706, 0xffedd5];
const WHITE_TONES = [0xffffff, 0xf3f4f6, 0xe5e7eb, 0x93c5fd];
const TILT = Math.PI / 12;

interface VortexParticle {
  sprite: PixiSprite;
  centerX: number;
  centerY: number;
  radiusX: number;
  angle: number;
  angularSpeed: number;
  radialSpeed: number;
  aspectRatio: number;
  baseAlpha: number;
}

function diskBounds(w: number, h: number) {
  return {
    minHole: Math.max(w * 0.22, 280),
    maxOuter: Math.max(w, h) * 0.75,
  };
}

/** Vórtice de acreción con glifos ASCII en Pixi: ojo central limpio para legibilidad, ticker parado fuera de pantalla. */
export const AsciiVortexBackground: React.FC<{ className?: string; density?: number }> = ({
  className,
  density,
}) => {
  const reduceMotion = useReducedMotion();
  const [mountRef, visible] = useElementVisible<HTMLDivElement>();
  const appRef = React.useRef<PixiApp | null>(null);

  const targetCount = useMemo(() => {
    if (density) return Math.max(40, Math.min(480, Math.round(density)));
    if (typeof window === 'undefined') return 200;
    if (saveDataMode()) return 80;
    return window.matchMedia('(max-width: 640px)').matches ? 140 : 260;
  }, [density]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || reduceMotion) return;
    let cancelled = false;

    const boot = async () => {
      const PIXI = await loadPixi();
      if (cancelled) return;
      try {
        await Promise.race([
          document.fonts.load('600 24px "JetBrains Mono"', '@#%*+=-:.'),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);
      } catch {
        /* fallback a monospace del sistema */
      }
      if (cancelled) return;

      const rect = mount.getBoundingClientRect();
      let W = Math.max(1, Math.round(rect.width));
      let H = Math.max(1, Math.round(rect.height));
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
      mount.prepend(view);
      appRef.current = app;

      const layer = new PIXI.Container();
      app.stage.addChild(layer);

      const textures: PixiTexture[] = [];
      const pool: Record<string, PixiTexture> = {};
      for (const char of ASCII_CHARS) {
        GOLD_TONES.forEach((color, idx) => {
          const text = new PIXI.Text(char, {
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 24,
            fontWeight: '600',
            fill: color,
          });
          const tex = app.renderer.generateTexture(text);
          text.destroy();
          textures.push(tex);
          pool[`${char}|gold_${idx}`] = tex;
        });
        WHITE_TONES.forEach((color, idx) => {
          const text = new PIXI.Text(char, {
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 24,
            fontWeight: '500',
            fill: color,
          });
          const tex = app.renderer.generateTexture(text);
          text.destroy();
          textures.push(tex);
          pool[`${char}|white_${idx}`] = tex;
        });
      }

      const spawn = (p: VortexParticle, fromOuter: boolean) => {
        const { minHole, maxOuter } = diskBounds(W, H);
        p.centerX = W * 0.5;
        p.centerY = H * 0.46;
        p.radiusX = fromOuter
          ? minHole + Math.pow(Math.random(), 0.82) * (maxOuter - minHole)
          : maxOuter + Math.random() * 80;
        p.aspectRatio = 0.52;
        p.angle = Math.random() * Math.PI * 2;
        const distFactor = (p.radiusX - minHole) / (maxOuter - minHole + 1);
        p.angularSpeed = 0.0035 + (1 - distFactor) * 0.007;
        p.radialSpeed = -(0.25 + (1 - distFactor) * 0.45);
        const isGold = Math.random() > 0.38;
        const char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)] ?? '@';
        const tones = isGold ? GOLD_TONES.length : WHITE_TONES.length;
        const key = `${char}|${isGold ? 'gold' : 'white'}_${Math.floor(Math.random() * tones)}`;
        const tex = pool[key];
        if (tex) p.sprite.texture = tex;
        const baseScale = 0.45 + (1 - distFactor) * 0.35 + Math.random() * 0.2;
        p.sprite.scale.set(baseScale);
        p.baseAlpha = isGold ? 0.45 + Math.random() * 0.45 : 0.28 + Math.random() * 0.42;
        if (distFactor < 0.25) p.baseAlpha = Math.min(1, p.baseAlpha + 0.35);
        p.sprite.alpha = p.baseAlpha;
      };

      const particles: VortexParticle[] = Array.from({ length: targetCount }, () => {
        const char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)] ?? '@';
        const sprite = new PIXI.Sprite(pool[`${char}|gold_0`]);
        sprite.anchor.set(0.5);
        layer.addChild(sprite);
        const p: VortexParticle = {
          sprite,
          centerX: 0,
          centerY: 0,
          radiusX: 0,
          angle: 0,
          angularSpeed: 0,
          radialSpeed: 0,
          aspectRatio: 0.52,
          baseAlpha: 0.6,
        };
        spawn(p, true);
        return p;
      });

      const tick = () => {
        const { minHole } = diskBounds(W, H);
        for (const p of particles) {
          p.angle += p.angularSpeed;
          p.radiusX += p.radialSpeed;
          if (p.radiusX < minHole) spawn(p, false);
          const rx = p.radiusX;
          const ry = p.radiusX * p.aspectRatio;
          const cosA = Math.cos(p.angle);
          const sinA = Math.sin(p.angle);
          p.sprite.position.set(
            p.centerX + (cosA * rx * Math.cos(TILT) - sinA * ry * Math.sin(TILT)),
            p.centerY + (cosA * rx * Math.sin(TILT) + sinA * ry * Math.cos(TILT))
          );
          p.sprite.rotation = p.angle + Math.PI / 2;
          const depth = (sinA + 1) * 0.5;
          p.sprite.alpha = p.baseAlpha * (0.65 + depth * 0.35);
        }
      };
      app.ticker.add(tick);

      const ro = new ResizeObserver(() => {
        const r = mount.getBoundingClientRect();
        W = Math.max(1, Math.round(r.width));
        H = Math.max(1, Math.round(r.height));
        app.renderer.resize(W, H);
        for (const p of particles) {
          p.centerX = W * 0.5;
          p.centerY = H * 0.46;
        }
      });
      ro.observe(mount);
      (app as unknown as { __ro?: ResizeObserver }).__ro = ro;
      (app as unknown as { __tex?: PixiTexture[] }).__tex = textures;
    };

    void boot();
    return () => {
      cancelled = true;
      const app = appRef.current;
      appRef.current = null;
      if (app) {
        try {
          app.ticker.stop();
        } catch {
          /* noop */
        }
        const ro = (app as unknown as { __ro?: ResizeObserver }).__ro;
        ro?.disconnect();
        const tex = (app as unknown as { __tex?: PixiTexture[] }).__tex;
        tex?.forEach((t) => {
          try {
            t.destroy(true);
          } catch {
            /* noop */
          }
        });
        const v = app.view as unknown as HTMLElement;
        if (v.parentNode === mount) mount.removeChild(v);
        app.destroy(true);
      }
    };
  }, [targetCount, reduceMotion, mountRef]);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (visible) app.ticker.start();
    else app.ticker.stop();
  }, [visible]);

  if (reduceMotion) return null;

  return (
    <div ref={mountRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[46%] h-[min(460px,60%)] w-[min(680px,85%)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(11,15,25,1) 45%, rgba(11,15,25,0.85) 60%, rgba(245,158,11,0.06) 85%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 95% 80% at 50% 50%, transparent 50%, rgba(11,15,25,0.8) 85%, #0B0F19 100%)',
        }}
      />
    </div>
  );
};

export default AsciiVortexBackground;
