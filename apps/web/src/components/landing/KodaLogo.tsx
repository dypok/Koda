'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface KodaLogoProps {
  href?: string;
  imgClassName?: string;
  linkClassName?: string;
  label?: string;
}

/** Logo KODA con micro-interacción hover: elevación + resplandor ámbar. */
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
    <Image
      src="/brand/logo.svg"
      alt="Koda"
      width={498}
      height={185}
      priority
      className={cn(
        'w-auto select-none object-contain transition-all duration-300 ease-out transform-gpu',
        'group-hover/koda-logo:scale-[1.05] group-hover/koda-logo:brightness-110',
        'group-hover/koda-logo:drop-shadow-[0_0_14px_rgba(245,158,11,0.5)]',
        'group-active/koda-logo:scale-[0.97]',
        imgClassName ?? 'h-7 w-auto sm:h-8'
      )}
    />
  </Link>
);

export default KodaLogo;
