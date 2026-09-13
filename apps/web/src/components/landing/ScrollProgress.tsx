'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/** Barra fina ámbar de progreso de lectura, fija arriba. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, background: 'hsl(var(--koda-hue) 95% 62%)' }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 pointer-events-none"
    />
  );
};

export default ScrollProgress;
