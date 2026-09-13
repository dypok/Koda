'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/** Subrayado marcador que se dibuja con el scroll. */
export const Highlight: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.st-highlight-bg',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', end: 'top 55%', scrub: 0.4 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <span ref={ref} className={cn('relative inline-block text-amber-400', className)}>
      <span
        aria-hidden="true"
        className="st-highlight-bg absolute inset-x-0 bottom-1 top-auto h-[0.32em] origin-left rounded-sm bg-amber-400/25 will-change-transform"
      />
      <span className="relative">{children}</span>
    </span>
  );
};

export default Highlight;
