'use client';

import React, { useRef, useState, useEffect } from 'react';
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

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  className = '',
  onItemClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  function getXY(
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] {
    const angle =
      (((360 + noise(8)) / totalPoints) * pointIndex * Math.PI) / 180;
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  }

  function createParticle(
    i: number,
    t: number,
    d: [number, number],
    r: number
  ) {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate:
        rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  }

  function makeParticles(element: HTMLElement) {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('gooey-particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty(
          '--color',
          `var(--color-${p.color}, #f59e0b)`
        );
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('gooey-point');
        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => element.classList.add('active'));

        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            /* noop */
          }
        }, t);
      }, 30);
    }
  }

  function updateEffectPosition(element: HTMLElement) {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  }

  function handleClick(e: React.MouseEvent<HTMLElement>, index: number) {
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

    const liEl = (e.currentTarget as HTMLElement).closest('li') as HTMLElement | null;
    if (!liEl || activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (filterRef.current) {
      filterRef.current.querySelectorAll('.gooey-particle').forEach((p) => {
        try {
          filterRef.current?.removeChild(p);
        } catch {
          /* noop */
        }
      });
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLElement>, index: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = (e.currentTarget as HTMLElement).parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl } as unknown as React.MouseEvent<HTMLElement>, index);
      }
    }
  }

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const lis = navRef.current.querySelectorAll('li');
    const activeLi = lis[activeIndex] as HTMLElement | undefined;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const ro = new ResizeObserver(() => {
      const cur = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
      if (cur) updateEffectPosition(cur);
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [activeIndex]);

  return (
    <div
      className={cn('relative gooey-nav-container', className)}
      ref={containerRef}
    >
      <nav
        className="flex relative"
        style={{ transform: 'translate3d(0,0,0.01px)' }}
      >
        <ul
          ref={navRef}
          className="flex gap-2 lg:gap-4 list-none p-0 px-2 m-0 relative z-[3]"
          style={{
            color: 'white',
            textShadow: '0 1px 1px hsl(205deg 30% 10% / 0.2)',
          }}
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <li
                key={index}
                className={cn(
                  'gooey-nav-item rounded-full relative cursor-pointer transition-[background-color,color,box-shadow] duration-300 ease shadow-[0_0_0.5px_1.5px_transparent] text-white/90 hover:text-white',
                  isActive && 'active'
                )}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, index)}
                  onKeyDown={(e) => handleKey(e, index)}
                  className="outline-none py-2 px-3.5 inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold select-none"
                >
                  {item.icon && (
                    <span className="shrink-0">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <span className="gooey-effect gooey-filter" ref={filterRef} />
      <span className="gooey-effect gooey-text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
