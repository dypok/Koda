'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  duration = 1.5,
  delay = 0.1,
  suffix = '',
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-20px' });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!isInView) {
      node.textContent = `${from}${suffix}`;
      return;
    }

    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration, delay, suffix]);

  return (
    <span ref={ref} className={className}>
      {from}{suffix}
    </span>
  );
};

export default AnimatedCounter;
