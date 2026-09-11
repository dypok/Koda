'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface GlareHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  transitionDuration?: number;
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
  children,
  glareColor = '#F97316',
  glareOpacity = 0.25,
  glareAngle = -45,
  transitionDuration = 650,
  className,
  style,
  ...props
}) => {
  const rgba = useMemo(() => hexToRgba(glareColor, glareOpacity), [glareColor, glareOpacity]);

  return (
    <div
      className={cn('group/glare relative overflow-hidden transform-gpu', className)}
      style={style}
      {...props}
    >
      {/* Barrido lumínico 100% acelerado por GPU sin layout thrashing ni offsetWidth */}
      {glareOpacity > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-full z-10 opacity-0 group-hover/glare:opacity-100 transition-opacity duration-200 overflow-hidden"
        >
          <div
            className="w-full h-full transform-gpu -translate-x-full group-hover/glare:translate-x-full transition-transform ease-out will-change-transform"
            style={{
              transitionDuration: `${transitionDuration}ms`,
              background: `linear-gradient(${glareAngle}deg, transparent 40%, ${rgba} 50%, transparent 60%)`,
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
};
