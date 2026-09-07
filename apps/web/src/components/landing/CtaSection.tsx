'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IconLogin, IconRocket, IconCheck } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface CtaSectionProps {
  onOpenLogin?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenLogin }) => {
  return (
    <section className="py-24 md:py-36 bg-gradient-to-b from-slate-950 via-[#120e17] to-slate-950 relative overflow-hidden border-t border-slate-800/80">
      {/* Resplandor ambiental de ignición de fondo integrado */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.2),rgba(234,88,12,0.08),transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[450px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_70%)] blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent pointer-events-none" />


      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Mascota oficial Koda flotando directamente en la página */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full -z-10 transform scale-75 animate-pulse" />
            <Image
              src="/brand/koda-mascot.png"
              alt="Mascota Koda"
              width={220}
              height={160}
              className="object-contain animate-float select-none"
              priority
            />
          </div>
        </motion.div>

        {/* Textos y encabezados principales */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Comienza a programar{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              hoy mismo
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-sans">
            Inicia con el track oficial de Python 3.12 y sienta las bases lógicas universales. Sin configuraciones complejas, a tu propio ritmo y con práctica directa en tu navegador.
          </p>
        </motion.div>

        {/* Acciones principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GradientButton
            onClick={onOpenLogin}
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold gap-2.5 shadow-[0_0_30px_rgba(249,115,22,0.25)]"
          >
            <IconRocket className="w-5 h-5" />
            Comenzar Ahora — Es Gratis
          </GradientButton>

          <GradientButton
            variant="secondary"
            size="lg"
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold gap-2.5"
          >
            <IconLogin className="w-5 h-5 text-amber-400" />
            Ya tengo una cuenta
          </GradientButton>
        </motion.div>

        {/* Micro-puntos de confianza */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-sans font-medium"
        >
          <span className="flex items-center gap-1.5">
            <IconCheck className="w-4 h-4 text-orange-400" />
            100% Gratuito
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheck className="w-4 h-4 text-orange-400" />
            Sin tarjeta ni suscripción
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheck className="w-4 h-4 text-orange-400" />
            Práctica en navegador
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
