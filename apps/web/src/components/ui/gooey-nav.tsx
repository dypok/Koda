'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type GooeyNavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
  className?: string;
  onItemClick?: (item: GooeyNavItem, index: number) => void;
}

type Particle = {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
};

const PALETTE = ['#f59e0b', '#f97316', '#fbbf24', '#ea580c'];

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  initialActiveIndex = 0,
  className = '',
  onItemClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextParticleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnParticles = useCallback((originX: number, originY: number) => {
    const newParticles: Particle[] = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 25 + Math.random() * 35;
      newParticles.push({
        id: nextParticleId.current++,
        startX: originX,
        startY: originY,
        targetX: originX + Math.cos(angle) * distance,
        targetY: originY + Math.sin(angle) * distance,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: 4 + Math.random() * 5,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 600);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const item = items[index];
    if (!item) return;

    if (item.href?.startsWith('#')) {
      e.preventDefault();
      const targetId = item.href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }

    item.onClick?.();
    onItemClick?.(item, index);
    setActiveIndex(index);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const originX = targetRect.left - rect.left + targetRect.width / 2;
      const originY = targetRect.top - rect.top + targetRect.height / 2;
      spawnParticles(originX, originY);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent<HTMLElement>, index);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex items-center rounded-full p-1 bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm shadow-inner',
        className
      )}
    >
      <nav aria-label="Navegación principal">
        <ul className="relative z-10 flex items-center gap-1 list-none p-0 m-0">
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <li key={index} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="gooey-nav-active-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 shadow-sm"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}

                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, index)}
                  onKeyDown={(e) => handleKey(e, index)}
                  className={cn(
                    'relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-colors duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                    isActive
                      ? 'text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon && (
                    <span
                      className={cn(
                        'shrink-0 transition-transform duration-200',
                        isActive ? 'scale-105' : 'opacity-80'
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Burst Particles on click */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{
              left: p.startX,
              top: p.startY,
              width: p.size,
              height: p.size,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              left: p.targetX,
              top: p.targetY,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.55,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full z-20"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GooeyNav;
