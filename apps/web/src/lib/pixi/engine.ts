'use client';

import { useEffect, useRef, useState } from 'react';

export type PixiModule = typeof import('pixi.js');
export type PixiApp = InstanceType<PixiModule['Application']>;
export type PixiTexture = InstanceType<PixiModule['Texture']>;
export type PixiSprite = InstanceType<PixiModule['Sprite']>;
export type PixiContainer = InstanceType<PixiModule['Container']>;
export type PixiGraphics = InstanceType<PixiModule['Graphics']>;

let pixiPromise: Promise<PixiModule> | null = null;

/** Carga perezosa y compartida del motor: pixi viaja en chunk aparte, no en el bundle inicial. */
export function loadPixi(): Promise<PixiModule> {
  if (!pixiPromise) pixiPromise = import('pixi.js');
  return pixiPromise;
}

/** Tope de DPR: 1.5 en táctil, 2 en escritorio. */
export function dprCap(): number {
  if (typeof window === 'undefined') return 1;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
}

export function saveDataMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(prefers-reduced-data: reduce)').matches ||
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
  );
}

const GLOW_SIZE = 64;
let glowCache: { texture: PixiTexture } | null = null;

/** Sprite radial blanco reutilizable; se tiñe por sprite con `tint`. Requiere app viva. */
export function getGlowTexture(PIXI: PixiModule): PixiTexture {
  if (glowCache && !glowCache.texture.destroyed) return glowCache.texture;
  const canvas = document.createElement('canvas');
  canvas.width = GLOW_SIZE;
  canvas.height = GLOW_SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(GLOW_SIZE / 2, GLOW_SIZE / 2, 0, GLOW_SIZE / 2, GLOW_SIZE / 2, GLOW_SIZE / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GLOW_SIZE, GLOW_SIZE);
  }
  const texture = PIXI.Texture.from(canvas);
  glowCache = { texture };
  return texture;
}

export const GLOW_TEXTURE_SIZE = GLOW_SIZE;

/** Visibilidad real del elemento: para arrancar/parar tickers sin costo fantasma. */
export function useElementVisible<T extends HTMLElement>(threshold = 0.01): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}
