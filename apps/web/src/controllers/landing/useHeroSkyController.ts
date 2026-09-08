import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  PointerState, RippleState, generateStars, clamp,
  STAR_COUNT_DEFAULT,
} from '@/models/landing/hero-sky.model';
import { useHeroSkyCanvasLoop } from './useHeroSkyCanvasLoop';

export function useHeroSkyController(starCount = STAR_COUNT_DEFAULT, seed = 88, interactive = true) {
  const reduceMotion = useReducedMotion();
  const count = clamp(Math.round(starCount), 80, 200);
  const { stars, realStar } = useMemo(() => generateStars(count, seed), [count, seed]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const realCoreRef = useRef<HTMLSpanElement>(null);
  const realBloomRef = useRef<HTMLSpanElement>(null);

  const pointerRef = useRef<PointerState>({ x: -1, y: -1, inside: false });
  const rippleRef = useRef<RippleState>({ active: false, t: 0, x: 0, y: 0 });
  const rectRef = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top, width: rect.width || 1, height: rect.height || 1 };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round((rect.width || 1) * dpr);
      canvas.height = Math.round((rect.height || 1) * dpr);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const triggerStarDiscovery = useCallback(() => {
    setDiscovered(true);
    rippleRef.current = { active: true, t: 0, x: realStar.x, y: realStar.y };
  }, [realStar.x, realStar.y]);

  useHeroSkyCanvasLoop({
    containerRef, canvasRef, realCoreRef, realBloomRef, pointerRef, rippleRef,
    rectRef, stars, realStar, interactive, reduceMotion: !!reduceMotion,
    discovered, onDiscover: triggerStarDiscovery,
  });

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    pointerRef.current = { x: e.clientX - rectRef.current.left, y: e.clientY - rectRef.current.top, inside: true };
  }, []);
  const onPointerLeave = useCallback(() => {
    pointerRef.current = { x: -1, y: -1, inside: false };
  }, []);

  useEffect(() => {
    if (!interactive || reduceMotion) return;
    const handleMove = (e: PointerEvent) => {
      const { left, top, width, height } = rectRef.current;
      const inside = e.clientX >= left && e.clientX <= left + width && e.clientY >= top && e.clientY <= top + height;
      pointerRef.current = { x: e.clientX - left, y: e.clientY - top, inside };
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [interactive, reduceMotion]);

  return {
    containerRef, canvasRef, realCoreRef, realBloomRef, realStar,
    reduceMotion, triggerStarDiscovery, onPointerMove, onPointerLeave,
  };
}

