'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { KodaLogoSvg } from './KodaLogoSvg';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface KodaLogoProps {
  href?: string;
  imgClassName?: string;
  linkClassName?: string;
  label?: string;
}

/** Logo KODA inline: hover expande las llaves con GSAP + resplandor que sigue al cursor. */
export const KodaLogo: React.FC<KodaLogoProps> = ({
  href = '/',
  imgClassName,
  linkClassName,
  label = 'Koda - inicio',
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const link = linkRef.current;
    const glow = glowRef.current;
    if (!link || !glow) return;
    gsap.set(glow, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
    const xTo = gsap.quickTo(glow, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: 0.35, ease: 'power3.out' });
    const move = (e: MouseEvent) => {
      const rect = link.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };
    const enter = () => gsap.to(glow, { opacity: 1, duration: 0.25, overwrite: 'auto' });
    const leave = () => gsap.to(glow, { opacity: 0, duration: 0.35, overwrite: 'auto' });
    link.addEventListener('mousemove', move);
    link.addEventListener('mouseenter', enter);
    link.addEventListener('mouseleave', leave);
    return () => {
      link.removeEventListener('mousemove', move);
      link.removeEventListener('mouseenter', enter);
      link.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <Link
      ref={linkRef}
      href={href}
      aria-label={label}
      className={cn(
        'group/koda-logo relative flex shrink-0 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70',
        linkClassName
      )}
    >
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-14 w-14 rounded-full bg-amber-500/35 opacity-0 blur-2xl"
      />
      <KodaLogoSvg
        label="Koda"
        className={cn(
          'relative select-none transition-all duration-300 ease-out',
          'group-hover/koda-logo:brightness-110',
          'group-hover/koda-logo:drop-shadow-[0_0_14px_rgba(245,158,11,0.5)]',
          imgClassName ?? 'h-7 sm:h-8'
        )}
      />
    </Link>
  );
};

export default KodaLogo;
