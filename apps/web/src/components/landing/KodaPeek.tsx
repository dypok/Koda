'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { KodaMascot } from '@/components/brand/KodaMascot';

interface KodaPeekProps {
  align?: 'left' | 'right';
  size?: number;
  className?: string;
}

/** Koda asomando tras el contenido, con parallax propio. Easter egg recurrente. */
export const KodaPeek: React.FC<KodaPeekProps> = ({ align = 'right', size = 72, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { yPercent: 30 },
        {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-8 z-0 select-none opacity-70 hidden sm:block',
        align === 'right' ? 'right-4 lg:right-16' : 'left-4 lg:left-16',
        className
      )}
    >
      <KodaMascot
        state="thinking"
        size={size}
        animate="float"
        glow
      />
    </div>
  );
};

export default KodaPeek;
