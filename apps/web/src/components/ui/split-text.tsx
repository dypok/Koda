'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

interface SplitTextProps {
  text: string;
  mode?: 'chars' | 'words';
  delay?: number;
  stagger?: number;
  className?: string;
}

/** Divide texto en chars/words enmascarados y los anima con GSAP al montar. */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  mode = 'chars',
  delay = 0,
  stagger = 0.02,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const units = mode === 'chars' ? Array.from(text) : text.split(' ');

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from('.st-split-unit', {
        yPercent: 110,
        duration: 0.7,
        ease: 'power4.out',
        delay,
        stagger: mode === 'chars' ? stagger : stagger * 3,
      });
    }, ref);
    return () => ctx.revert();
  }, [text, delay, stagger, mode]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {units.map((u, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
        >
          <span className="st-split-unit inline-block will-change-transform">
            {u === ' ' ? '\u00A0' : u}
            {mode === 'words' && i < units.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  );
};

export default SplitText;
