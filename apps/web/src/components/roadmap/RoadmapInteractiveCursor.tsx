'use client';

import React, { useEffect, useRef } from 'react';
import { useAppearanceStore, ACCENT_PALETTES } from '@/stores/appearance.store';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

/**
 * Lienzo de partículas y ondas reactivas al cursor del ratón.
 * Se dibuja en una capa `pointer-events-none` sin bloquear clics de la UI ni del roadmap.
 * Adopta dinámicamente el color de la paleta de acento elegida (Ámbar, Cian, Violeta o Esmeralda).
 */
export const RoadmapInteractiveCursor: React.FC = () => {
  const { interactiveCursor, accentTheme } = useAppearanceStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastMoveRef = useRef<{ x: number; y: number; time: number }>({ x: -1, y: -1, time: 0 });

  const palette = ACCENT_PALETTES[accentTheme] || ACCENT_PALETTES.amber;

  useEffect(() => {
    if (!interactiveCursor) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let isLoopRunning = false;

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animIdRef.current = requestAnimationFrame(render);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const ripples = ripplesRef.current;

      // 1. Dibujar ondas reactivas (ripples)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1.4;
        r.alpha *= 0.94;

        if (r.alpha < 0.02 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${palette.rgb}, ${r.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // 2. Dibujar chispas de estela estelar
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02) {
          particles.splice(i, 1);
          continue;
        }

        // Núcleo brillante
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.size * p.alpha), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.rgb}, ${p.alpha.toFixed(3)})`;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      if (particles.length > 0 || ripples.length > 0) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        isLoopRunning = false;
        animIdRef.current = null;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      const last = lastMoveRef.current;
      const dist = last.x >= 0 ? Math.hypot(x - last.x, y - last.y) : 0;
      lastMoveRef.current = { x, y, time: now };

      // Emitir 1 o 2 chispas
      const count = dist > 40 ? 3 : dist > 15 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        if (particlesRef.current.length < 50) {
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.4,
            size: Math.random() * 2.2 + 1.2,
            alpha: 0.9,
            decay: Math.random() * 0.025 + 0.02,
          });
        }
      }

      // Emitir onda suave al desplazarse
      if (dist > 55 && ripplesRef.current.length < 6) {
        ripplesRef.current.push({
          x,
          y,
          radius: 3,
          maxRadius: 40,
          alpha: 0.45,
        });
      }

      startLoop();
    };

    const handlePointerDown = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Burst de chispas en clic
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
        });
      }

      // Onda expansiva en clic
      ripplesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 55,
        alpha: 0.7,
      });

      startLoop();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [interactiveCursor, palette]);

  if (!interactiveCursor) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
};

export default RoadmapInteractiveCursor;
