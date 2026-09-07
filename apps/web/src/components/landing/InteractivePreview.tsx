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
    <section id="propuesta-valor" className="py-20 md:py-28 border-y border-slate-800/80 bg-gradient-to-b from-[#070b14] via-[#0c1222] to-[#070b14] relative overflow-hidden">
      {/* Resplandor ambiental cálido central de alta visibilidad */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.18),rgba(245,158,11,0.08),transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[700px] h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Rejilla Cibernética Visible con Líneas de Luz */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_90%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 158, 11, 0.13) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.13) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Matriz de Puntos Brillantes en las Intersecciones de la Rejilla */}
      <div
        className="absolute inset-0 pointer-events-none opacity-65 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 1.5px, transparent 1.5px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Haz superior de luz de horizonte */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-orange-500/35 to-transparent pointer-events-none animate-[beamShimmer_4s_ease-in-out_infinite]" />

      {/* Nodos de energía cibernética pulsando en segundo plano */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute top-16 left-1/4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_14px_#fbbf24] animate-ping opacity-60" style={{ animationDuration: '4s' }} />
        <span className="absolute top-28 right-1/4 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_14px_#f97316] animate-ping opacity-50" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <span className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_14px_#f59e0b] animate-ping opacity-50" style={{ animationDuration: '4.5s', animationDelay: '2s' }} />
        <span className="absolute bottom-16 right-1/3 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_14px_#ea580c] animate-ping opacity-60" style={{ animationDuration: '5.5s', animationDelay: '0.5s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Principal con Rajdhani Display y tonos Naranja/Ámbar oficiales */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-40px' }}
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
            viewport={{ once: false, margin: '-30px' }}
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
            viewport={{ once: false, margin: '-30px' }}
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
            viewport={{ once: false, margin: '-30px' }}
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
