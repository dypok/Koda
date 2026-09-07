'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconGift,
  IconTrophy,
  IconTerminal2,
} from '@tabler/icons-react';
import { BorderGlow } from '@/components/ui/border-glow';

export const InteractivePreview: React.FC = () => {
  return (
    <section id="propuesta-valor" className="py-20 md:py-28 border-y border-slate-800/80 bg-slate-950/90 relative overflow-hidden">
      {/* Fondo de Matriz Digital con Máscara Radial Suave */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Haz de horizonte de energía lumínica sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none animate-[beamShimmer_6s_ease-in-out_infinite]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-2xl h-16 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-2xl pointer-events-none" />

      {/* Marcadores tácticos de precisión en esquinas */}
      <div className="hidden lg:block absolute top-6 left-8 text-slate-700/70 text-[11px] font-mono select-none pointer-events-none">
        + SYS.01 // ACCESS_FREE
      </div>
      <div className="hidden lg:block absolute top-6 right-8 text-slate-700/70 text-[11px] font-mono select-none pointer-events-none">
        [ZERO_PAYWALL] +
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Principal con Rajdhani Display y tonos Naranja/Ámbar oficiales */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Aprende{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              100% gratis
            </span>{' '}
            con los mejores resultados
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Sin suscripciones ocultas ni muros de pago. Un método interactivo de micro-lecciones y práctica deliberada diseñado para que domines la lógica de programación y alcances tu máximo potencial.
          </p>
        </motion.div>

        {/* 3 Cards con BorderGlow y colores individuales de la paleta cálida de Koda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1: 100% Gratuito (Orange Brand Glow) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <BorderGlow
              borderRadius={20}
              backgroundColor="#0B0F19"
              glowColor="24 95 60"
              colors={['#F97316', '#FB923C', '#EA580C']}
              className="group h-full"
              contentClassName="rounded-[19px] p-7 sm:p-8 h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <IconGift className="w-8 h-8 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  100% Gratuito
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                  Educación tecnológica de alta calidad accesible para todos. Acceso libre a lecciones, retos y proyectos sin costo alguno.
                </p>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Card 2: Los Mejores Resultados (Amber Gold Glow) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <BorderGlow
              borderRadius={20}
              backgroundColor="#0B0F19"
              glowColor="45 95 60"
              colors={['#F59E0B', '#FBBF24', '#D97706']}
              className="group h-full"
              contentClassName="rounded-[19px] p-7 sm:p-8 h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <IconTrophy className="w-8 h-8 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Los Mejores Resultados
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                  La práctica deliberada con código real genera una retención hasta 4x superior a mirar tutoriales pasivos en video.
                </p>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Card 3: Código Real en Vivo (Sunset Flame Glow) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <BorderGlow
              borderRadius={20}
              backgroundColor="#0B0F19"
              glowColor="15 95 60"
              colors={['#EA580C', '#F97316', '#FB923C']}
              className="group h-full"
              contentClassName="rounded-[19px] p-7 sm:p-8 h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <IconTerminal2 className="w-8 h-8 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Código Real en Vivo
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                  Consola y motor de ejecución en tu navegador. Comprueba de inmediato el funcionamiento de tu lógica sin instalaciones.
                </p>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractivePreview;
