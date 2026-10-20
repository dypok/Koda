'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '@/lib/scroll';
import { getGsap } from '@/lib/gsap';
import { isLowEndDevice } from '@/lib/pixi/engine';

/**
 * Smooth scroll solo para la landing en equipos de escritorio capaces.
 * En gama baja, pantallas táctiles o prefers-reduced-motion usa el scroll nativo
 * acelerado por hardware (compositor thread) sin sobrecargar el hilo principal.
 */
export const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      isLowEndDevice()
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    const { gsap, ScrollTrigger } = getGsap();
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);

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
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
