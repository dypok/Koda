'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface TerminalBadgeProps {
  icon?: React.ReactNode;
  prefix?: string;
  text: string;
  suffix?: string;
  tone?: 'amber' | 'emerald';
  className?: string;
}

/** Etiqueta estilo terminal con entrada GSAP y cursor parpadeante. */
export const TerminalBadge: React.FC<TerminalBadgeProps> = ({
  icon,
  prefix = '>',
  text,
  suffix = '_',
  tone = 'amber',
  className,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        x: -12,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
      const cursor = rootRef.current?.querySelector('[data-cursor]');
      if (cursor) {
        gsap.to(cursor, {
          opacity: 0,
          duration: 0.55,
          repeat: -1,
          yoyo: true,
          ease: 'steps(1)',
        });
      }
      gsap.to(rootRef.current, {
        y: -4,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[6px] border bg-slate-950/90 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest will-change-transform',
        tone === 'amber'
          ? 'border-amber-400/40 border-l-2 border-l-amber-400 text-amber-300'
          : 'border-emerald-400/40 border-l-2 border-l-emerald-400 text-emerald-300',
        className
      )}
    >
      <span aria-hidden="true" className="opacity-60">{prefix}</span>
      {icon}
      <span>{text}</span>
      <span aria-hidden="true" data-cursor className="opacity-80">{suffix}</span>
    </div>
  );
};

export default TerminalBadge;
