'use client';

import React, { useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface GlareHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
}

function hexToRgba(hexColor: string, opacity: number): string {
  const hex = hexColor.replace('#', '');
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const [r, g, b] = hex.split('').map((c) => parseInt(c + c, 16));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return hexColor;
}

export const GlareHover: React.FC<GlareHoverProps> = ({
  children, glareColor = '#F97316', glareOpacity = 0.25, glareAngle = -45,
  glareSize = 250, transitionDuration = 2000, playOnce = false,
  className, style, onMouseEnter, onMouseLeave, ...props
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rgba = useMemo(() => hexToRgba(glareColor, glareOpacity), [glareColor, glareOpacity]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      overlayRef.current.style.transition = 'none';
      overlayRef.current.style.backgroundPosition = '-100% -100%, 0 0';
      void overlayRef.current.offsetWidth;
      overlayRef.current.style.transition = `${transitionDuration}ms ease`;
      overlayRef.current.style.backgroundPosition = '100% 100%, 0 0';
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current && !playOnce) {
      overlayRef.current.style.transition = `${transitionDuration}ms ease`;
      overlayRef.current.style.backgroundPosition = '-100% -100%, 0 0';
    }
    onMouseLeave?.(e);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
          backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '-100% -100%, 0 0',
        }}
      />
      {children}
    </div>
  );
};
