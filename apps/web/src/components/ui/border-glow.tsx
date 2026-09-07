'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

export function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(', ');
}

export function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

export function easeInCubic(x: number) {
  return x * x * x;
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%',
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

export function buildMeshGradients(colors: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    out.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  out.push(`linear-gradient(${colors[0]} 0 100%)`);
  return out;
}

export interface BorderGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

type AnimateOpts = {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (t: number) => number;
  onUpdate: (v: number) => void;
  onEnd?: () => void;
};

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  contentClassName = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#14110E',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#FF8A4C', '#FFC18A', '#FF6B2C'],
  fillOpacity = 0.5,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  function getCenterOf(el: HTMLElement) {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }

  function getEdgeProximity(el: HTMLElement, x: number, y: number) {
    const [cx, cy] = getCenterOf(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function getCursorAngle(el: HTMLElement, x: number, y: number) {
    const [cx, cy] = getCenterOf(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setEdgeProximity(getEdgeProximity(cardRef.current, x, y));
    setCursorAngle(getCursorAngle(cardRef.current, x, y));
  };

  useEffect(() => {
    if (!animated) return;
    let isCancelled = false;
    const timers: NodeJS.Timeout[] = [];
    const rafs: number[] = [];

    const animateValue = ({
      start = 0,
      end = 100,
      duration = 1000,
      delay = 0,
      ease = easeOutCubic,
      onUpdate,
      onEnd,
    }: AnimateOpts) => {
      const timer = setTimeout(() => {
        if (isCancelled) return;
        const t0 = performance.now();
        function tick() {
          if (isCancelled) return;
          const elapsed = performance.now() - t0;
          const t = Math.min(Math.max(elapsed / duration, 0), 1);
          onUpdate(start + (end - start) * ease(t));
          if (t < 1) {
            rafs.push(requestAnimationFrame(tick));
          } else {
            onEnd?.();
          }
        }
        rafs.push(requestAnimationFrame(tick));
      }, delay);
      timers.push(timer);
    };

    const angleStart = 110;
    const angleEnd = 465;
    setSweepActive(true);
    setCursorAngle(angleStart);

    animateValue({
      duration: 500,
      onUpdate: (v) => setEdgeProximity(v / 100),
    });
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) =>
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart),
    });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) =>
        setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart),
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => setEdgeProximity(v / 100),
      onEnd: () => setSweepActive(false),
    });

    return () => {
      isCancelled = true;
      timers.forEach(clearTimeout);
      rafs.forEach(cancelAnimationFrame);
    };
  }, [animated]);

  const colorSensitivity = edgeSensitivity + 20;
  const isVisible = isHovered || sweepActive;
  const borderOpacity = isVisible
    ? Math.max(
        0,
        (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity)
      )
    : 0;
  const glowOpacity = isVisible
    ? Math.max(
        0,
        (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)
      )
    : 0;

  const meshGradients = useMemo(() => buildMeshGradients(colors), [colors]);
  const borderBg = useMemo(
    () => meshGradients.map((g) => `${g} border-box`),
    [meshGradients]
  );
  const fillBg = useMemo(
    () => meshGradients.map((g) => `${g} padding-box`),
    [meshGradients]
  );

  const angleDeg = `${cursorAngle.toFixed(3)}deg`;
  const transitionStr = isVisible
    ? 'opacity 0.25s ease-out'
    : 'opacity 0.75s ease-in-out';

  const borderMask = `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${
    coneSpread + 15
  }%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`;

  const fillMask = [
    'linear-gradient(to bottom, black, black)',
    'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
    'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
    `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
  ].join(', ');

  const outerMask = `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`;

  const borderBgFull = [
    `linear-gradient(${backgroundColor} 0 100%) padding-box`,
    'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
    ...borderBg,
  ].join(', ');

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cn(
        'relative grid isolate border border-white/10 transition-colors',
        className
      )}
      role="presentation"
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0,0,0.01px)',
        boxShadow:
          'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
        ...style,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 -z-[1]"
        style={{
          borderRadius: 'inherit',
          border: '1px solid transparent',
          background: borderBgFull,
          opacity: borderOpacity,
          WebkitMaskImage: borderMask,
          maskImage: borderMask,
          transition: transitionStr,
        }}
      />
      <div
        className="absolute inset-0 -z-[1]"
        style={
          {
            borderRadius: 'inherit',
            border: '1px solid transparent',
            background: fillBg.join(', '),
            WebkitMaskImage: fillMask,
            maskImage: fillMask,
            WebkitMaskComposite:
              'source-out, source-over, source-over, source-over, source-over, source-over',
            maskComposite: 'subtract, add, add, add, add, add' as any,
            opacity: borderOpacity * fillOpacity,
            mixBlendMode: 'soft-light' as const,
            transition: transitionStr,
          } as React.CSSProperties
        }
      />

      <span
        className="absolute pointer-events-none z-[1]"
        style={{
          borderRadius: 'inherit',
          inset: `-${glowRadius}px`,
          WebkitMaskImage: outerMask,
          maskImage: outerMask,
          opacity: glowOpacity,
          mixBlendMode: 'plus-lighter' as const,
          transition: transitionStr,
        }}
      >
        <span
          className="absolute"
          style={{
            borderRadius: 'inherit',
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div
        className={cn(
          'flex flex-col relative overflow-hidden z-[1] w-full h-full',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
