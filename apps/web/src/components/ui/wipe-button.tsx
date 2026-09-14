'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type WipeTone = 'amber' | 'ghost';
type WipeSize = 'sm' | 'md' | 'lg';

interface WipeButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: WipeTone;
  size?: WipeSize;
  className?: string;
  ariaLabel?: string;
  LinkComponent?: React.ElementType;
  children: React.ReactNode;
}

const BANDS: Record<WipeTone, [string, string, string]> = {
  amber: ['bg-amber-200', 'bg-amber-500', 'bg-amber-600'],
  ghost: ['bg-slate-600', 'bg-slate-700', 'bg-slate-800'],
};

const SIZES: Record<WipeSize, string> = {
  sm: 'px-4 py-2 text-xs min-h-[40px]',
  md: 'px-5 py-2.5 text-sm min-h-[48px]',
  lg: 'px-8 py-4 text-base min-h-[56px]',
};

/**
 * CTA con wipe diagonal de 3 bandas. Retroceso simétrico: misma duración
 * en ambas direcciones y delays espejados para que salir sea el espejo de entrar.
 */
export const WipeButton: React.FC<WipeButtonProps> = ({
  href,
  onClick,
  disabled = false,
  tone = 'amber',
  size = 'md',
  className,
  ariaLabel,
  LinkComponent = Link,
  children,
}) => {
  const [b1, b2, b3] = BANDS[tone];
  const finalText = tone === 'amber' ? 'text-white' : 'text-amber-300';
  const base =
    tone === 'amber'
      ? 'bg-amber-400 text-slate-950 shadow-[0_4px_20px_-2px_rgba(249,115,22,0.45)]'
      : 'border border-slate-700 text-slate-200';

  const bands = !disabled && (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute -left-4 -top-10 h-40 w-[130%] origin-left rotate-12 scale-x-0 transition-transform duration-[600ms] ease-out',
          'delay-150 group-hover:delay-0 group-hover:scale-x-100 motion-reduce:hidden',
          b1
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute -left-4 -top-10 h-40 w-[130%] origin-left rotate-12 scale-x-0 transition-transform duration-[600ms] ease-out',
          'delay-75 group-hover:delay-75 group-hover:scale-x-100 motion-reduce:hidden',
          b2
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute -left-4 -top-10 h-40 w-[130%] origin-left rotate-12 scale-x-0 transition-transform duration-[600ms] ease-out',
          'delay-0 group-hover:delay-150 group-hover:scale-x-100 motion-reduce:hidden',
          b3
        )}
      />
      <span
        className={cn(
          'absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-300 motion-reduce:hidden',
          'group-hover:opacity-100',
          finalText
        )}
      >
        {children}
      </span>
    </>
  );

  const cls = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-bold',
    'transition-all duration-300 hover:shadow-[0_8px_32px_-2px_rgba(249,115,22,0.65)] active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300',
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
    base,
    SIZES[size],
    className
  );

  if (href && !disabled) {
    const Comp = LinkComponent;
    return (
      <Comp href={href} aria-label={ariaLabel} onClick={onClick} className={cls}>
        <span className="relative z-10 flex items-center justify-center gap-2 transition-opacity duration-300 group-hover:opacity-0 motion-reduce:group-hover:opacity-100">
          {children}
        </span>
        {bands}
      </Comp>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={cls}>
      <span className="relative z-10 flex items-center justify-center gap-2 transition-opacity duration-300 group-hover:opacity-0 motion-reduce:group-hover:opacity-100">
        {children}
      </span>
      {bands}
    </button>
  );
};

export default WipeButton;
