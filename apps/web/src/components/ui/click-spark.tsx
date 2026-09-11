'use client';

import React, { useRef, useEffect, FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SparkEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface ClickSparkProps extends HTMLAttributes<HTMLDivElement> {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: SparkEasing;
  extraScale?: number;
}

interface Spark { x: number; y: number; angle: number; startTime: number; }

const ease = (t: number, e: SparkEasing): number =>
  e === 'linear' ? t : e === 'ease-in' ? t * t : e === 'ease-in-out' ? (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) : t * (2 - t);

export const ClickSpark: FC<ClickSparkProps> = ({
  children, sparkColor = '#fff', sparkSize = 10, sparkRadius = 15,
  sparkCount = 8, duration = 400, easing = 'ease-out', extraScale = 1.0,
  className, onClick, ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const isRunningRef = useRef(false);
  const pRef = useRef({ sparkColor, sparkSize, sparkRadius, duration, easing, extraScale });
  pRef.current = { sparkColor, sparkSize, sparkRadius, duration, easing, extraScale };

  const draw = (now: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sparks = sparksRef.current;
    const { sparkColor: sc, sparkSize: ss, sparkRadius: sr, duration: d, easing: ea, extraScale: es } = pRef.current;

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const elapsed = now - s.startTime;
      if (elapsed >= d) { sparks.splice(i, 1); continue; }
      const eased = ease(elapsed / d, ea);
      const dist = eased * sr * es;
      const len = ss * (1 - eased);
      ctx.strokeStyle = sc;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x + dist * Math.cos(s.angle), s.y + dist * Math.sin(s.angle));
      ctx.lineTo(s.x + (dist + len) * Math.cos(s.angle), s.y + (dist + len) * Math.sin(s.angle));
      ctx.stroke();
    }
    if (sparks.length > 0) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); isRunningRef.current = false; }
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = wrapper.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (!canvasRef.current || sparkCount <= 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, angle: (2 * Math.PI * i) / sparkCount, startTime: now });
    }
    if (!isRunningRef.current) { isRunningRef.current = true; requestAnimationFrame(draw); }
  };

  return (
    <div ref={wrapperRef} onClick={handleClick} role="presentation" className={cn('relative w-full h-full', className)} {...props}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />
      {children}
    </div>
  );
};
