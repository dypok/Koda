'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { InfoModal, InfoModalTab } from './InfoModal';
import { FooterColumns } from '@/views/landing/FooterColumns';
import { KodaLogo } from './KodaLogo';
import { GlareHover } from '@/components/ui/glare-hover';
import { SoundToggle } from './SoundToggle';
import { AuroraToggle } from './AuroraToggle';
import { reveal } from '@/lib/reveal';

export const Footer: React.FC = () => {
  const [modalTab, setModalTab] = useState<InfoModalTab | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs sm:text-sm overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[750px] h-[200px] bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.06)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

      <GlareHover
        glareColor="#F59E0B"
        glareOpacity={0.1}
        transitionDuration={1100}
        className="relative z-10"
      >
      <motion.div
        {...reveal(reduceMotion)}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Marca & Misión */}
          <div className="md:col-span-3 space-y-4">
            <KodaLogo imgClassName="h-7 w-auto sm:h-8" linkClassName="w-fit" />

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed font-sans">
              Plataforma interactiva y gratuita para aprender a programar paso a paso. Sin frustración, a tu propio ritmo y con práctica directa en tu navegador.
            </p>

            <div className="text-[11px] text-slate-500 font-sans pt-1">
              © {new Date().getFullYear()} KodaAcademy Inc.
            </div>
          </div>

          {/* Columnas de Enlaces Modularizadas */}
          <FooterColumns onOpenModal={setModalTab} />
        </div>

        {/* Barra Inferior */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p>© {new Date().getFullYear()} KodaAcademy. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <AuroraToggle />
            <SoundToggle />
          </div>
        </div>
      </motion.div>
      </GlareHover>

      <InfoModal
        isOpen={modalTab !== null}
        onClose={() => setModalTab(null)}
        initialTab={modalTab || 'faqs'}
      />
    </footer>
  );
};

export default Footer;
