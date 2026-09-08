import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const HeroMascot: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88, y: 25 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    className="lg:col-span-5 flex flex-col items-center justify-center transform-gpu"
  >
    <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center">
      <Image
        src="/brand/koda-mascot.png"
        alt="Koda — Mascota Oficial KodaAcademy"
        width={420}
        height={302}
        style={{ width: 'auto', height: 'auto' }}
        className="relative z-10 max-h-[220px] sm:max-h-[260px] lg:max-h-[300px] object-contain animate-float select-none transform-gpu will-change-transform"
        priority
      />
    </div>
  </motion.div>
);
