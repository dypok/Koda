'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}

/** Odómetro: cada dígito rueda verticalmente estilo slot-machine. */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  delay = 0.1,
  suffix = '',
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!isInView || started) return;
    if (reduceMotion) {
      setDisplay(to);
      setStarted(true);
      return;
    }
    const t1 = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t1);
  }, [isInView, started, reduceMotion, delay, to]);

  useEffect(() => {
    if (!started || reduceMotion) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reduceMotion, from, to]);

  const digits = String(display).split('');

  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`}>
      <span aria-hidden="true" className="inline-flex overflow-hidden tabular-nums">
        {digits.map((d, i) => (
          <span key={i} className="relative inline-block h-[1em] w-[0.62em] overflow-hidden leading-none">
            <span
              className="absolute left-0 top-0 flex flex-col leading-none transition-transform duration-150 ease-out will-change-transform"
              style={{ transform: `translateY(-${d}em)` }}
            >
              {Array.from({ length: 10 }).map((_, n) => (
                <span key={n} className="h-[1em] leading-none">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ))}
        {suffix && <span className="leading-none">{suffix}</span>}
      </span>
    </span>
  );
};

export default AnimatedCounter;
