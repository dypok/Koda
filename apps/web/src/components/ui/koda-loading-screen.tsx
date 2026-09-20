'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface KodaLoadingScreenProps {
  title?: string;
  subtitle?: string;
  terminalHint?: string;
  className?: string;
  fullScreen?: boolean;
}

/**
 * Pantalla de carga branded con la mascota Koda.
 * Utilizada para transiciones fluidas de OAuth, finalización de onboarding y montaje de rutas,
 * evitando pantallas intermedias o parpadeos negros.
 */
export const KodaLoadingScreen: React.FC<KodaLoadingScreenProps> = ({
  title = 'Preparando tu ruta de aprendizaje...',
  subtitle = 'Configurando tus primeros desafíos interactivos personalizados...',
  terminalHint = '> koda_core :: preparando_ruta',
  className,
  fullScreen = true,
}) => {
  const reduceMotion = useReducedMotion();

  const content = (
    <div className="flex flex-col items-center justify-center text-center max-w-md w-full px-6 space-y-6 select-none">
      {/* Mascota Koda con halo pulsante y animación flotante suave */}
      <div className="relative flex items-center justify-center">
        {/* Halo resplandeciente ámbar / naranja de fondo */}
        <div
          aria-hidden="true"
          className="absolute -inset-6 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-amber-300/15 blur-2xl animate-pulse"
        />

        {/* Mascota Koda 2D flotando suavemente */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  y: [0, -10, 0],
                  scale: [1, 1.02, 1],
                }
          }
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 w-28 h-28 sm:w-32 sm:h-32"
        >
          <Image
            src="/brand/koda-mascot-cartoon-2d.svg"
            alt="Koda preparando tu experiencia"
            width={128}
            height={128}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(245,158,11,0.35)]"
          />
        </motion.div>
      </div>

      {/* Terminal pill gamificada */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs shadow-[0_0_15px_rgba(245,158,11,0.15)]"
      >
        <Sparkle aria-hidden="true" className="w-3.5 h-3.5 animate-spin text-amber-400" />
        <span>{terminalHint}</span>
      </motion.div>

      {/* Textos informativos */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Barra de progreso / pulso de carga */}
      <div className="w-48 sm:w-64 h-2 bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: 'easeInOut',
          }}
          className="w-1/2 h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md',
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('w-full flex items-center justify-center py-16', className)}
    >
      {content}
    </div>
  );
};

export default KodaLoadingScreen;
