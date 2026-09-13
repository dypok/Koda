'use client';

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

const GLYPHS = ['{', '}', '<', '>', '=', ';', '(', ')', '#', '/'];
const COLORS = ['#fbbf24', '#34d399', '#38bdf8', '#f472b6', '#a78bfa'];

/** Explosión de símbolos de código con física GSAP. Se anima al montar. */
export const CodeConfetti: React.FC<{ burstKey: number }> = ({ burstKey }) => {
  const ref = useRef<HTMLDivElement>(null);
  const parts = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        glyph: GLYPHS[i % GLYPHS.length],
        color: COLORS[i % COLORS.length],
        angle: (i / 24) * Math.PI * 2 + Math.random() * 0.5,
        dist: 70 + Math.random() * 110,
        size: 12 + Math.random() * 10,
      })),
    []
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.st-confetti-bit').forEach((el, i) => {
        const p = parts[i];
        gsap.fromTo(
          el,
          { x: 0, y: 0, opacity: 1, rotation: 0 },
          {
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist + 90,
            rotation: (Math.random() - 0.5) * 540,
            opacity: 0,
            duration: 1.1 + Math.random() * 0.5,
            ease: 'power2.out',
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [burstKey, parts]);

  if (prefersReducedMotion()) return null;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-16 z-20">
      {parts.map((p) => (
        <span
          key={`${burstKey}-${p.id}`}
          className="st-confetti-bit absolute font-mono font-bold will-change-transform"
          style={{ color: p.color, fontSize: p.size }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
};

export default CodeConfetti;
