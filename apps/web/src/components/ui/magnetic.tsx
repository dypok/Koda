'use client';

import React, { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/** Atracción magnética sutil hacia el cursor en CTAs. */
export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.22, className }) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform' }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Magnetic;
