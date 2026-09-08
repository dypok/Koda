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
        src="/brand/koda-mascot-cartoon-2d-transparent.png"
        alt="Koda — Mascota Oficial KodaAcademy"
        width={420}
        height={420}
        style={{ width: 'auto', height: 'auto' }}
        className="relative z-10 max-h-[240px] sm:max-h-[280px] lg:max-h-[320px] object-contain animate-float select-none transform-gpu will-change-transform drop-shadow-[0_20px_45px_rgba(249,115,22,0.35)]"
        priority
      />
    </div>
  </motion.div>
);
