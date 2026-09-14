'use client';

import React from 'react';
import Link from 'next/link';
import { KodaLogoSvg } from './KodaLogoSvg';
import { cn } from '@/lib/utils';

interface KodaLogoProps {
  href?: string;
  imgClassName?: string;
  linkClassName?: string;
  label?: string;
}

/** Logo KODA inline: hover expande las llaves con GSAP + resplandor ámbar. */
export const KodaLogo: React.FC<KodaLogoProps> = ({
  href = '/',
  imgClassName,
  linkClassName,
  label = 'Koda - inicio',
}) => (
  <Link
    href={href}
    aria-label={label}
    className={cn(
      'group/koda-logo flex shrink-0 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70',
      linkClassName
    )}
  >
    <KodaLogoSvg
      label="Koda"
      className={cn(
        'select-none transition-all duration-300 ease-out',
        'group-hover/koda-logo:brightness-110',
        'group-hover/koda-logo:drop-shadow-[0_0_14px_rgba(245,158,11,0.5)]',
        imgClassName ?? 'h-7 sm:h-8'
      )}
    />
  </Link>
);

export default KodaLogo;
