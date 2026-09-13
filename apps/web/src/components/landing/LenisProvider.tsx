'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '@/lib/scroll';

/**
 * Smooth scroll solo para la landing. No se inicializa con
 * prefers-reduced-motion. Expone la instancia para GSAP ScrollTrigger (S2).
 */
export const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]') as
        | HTMLAnchorElement
        | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
