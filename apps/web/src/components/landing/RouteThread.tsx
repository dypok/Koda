'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/** Hilo de Koda: línea vertical que crece con el scroll global. Solo desktop. */
export const RouteThread: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-0 bottom-0 z-10 hidden xl:block motion-reduce:!hidden w-px"
    >
      <div className="absolute inset-0 bg-slate-800/50" />
      <motion.div style={{ scaleY }} className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,#f59e0b,#f97316)]" />
      <motion.div
        style={{ top: '0%', height: '100%', scaleY }}
        className="absolute w-2 -left-[3.5px] origin-top rounded-full bg-amber-400/20 blur-[3px]"
      />
    </div>
  );
};

export default RouteThread;
