'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconShieldCheck,
  IconX,
  IconCheck,
} from '@tabler/icons-react';
import { BorderGlow } from '@/components/ui/border-glow';

export const InteractivePreview: React.FC = () => {
  return (
    <div className="relative">
      {/* =========================================================
          SECCIÓN 01: 100% Gratuito (Texto Izquierda / Card $0 Derecha)
          ========================================================= */}
      <section
        id="propuesta-valor"
        className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#0a0d18] to-slate-950"
      >
        {/* Resplandor ambiental de fondo cálido */}
        <div className="absolute top-1/2 right-6 lg:right-24 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15),rgba(245,158,11,0.05),transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Texto Izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-5 text-left"
            >
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Aprende{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  100% gratis
                </span>{' '}
                con los mejores resultados
              </h2>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                Sin suscripciones ocultas ni muros de pago. Un método interactivo de micro-lecciones y práctica deliberada diseñado para que domines la lógica de programación y alcances tu máximo potencial.
              </p>
            </motion.div>

            {/* Elemento Visual Derecha: Card $0 de Acceso Total */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center w-full"
            >
              <BorderGlow
                borderRadius={24}
                backgroundColor="#0B0F19"
                glowColor="28 95 60"
                colors={['#F97316', '#F59E0B', '#EA580C']}
                className="w-full max-w-md shadow-2xl"
                contentClassName="rounded-[23px] p-8 sm:p-10 flex flex-col items-center text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
                  <IconShieldCheck className="w-8 h-8 text-amber-400" />
                </div>

                <div className="space-y-2">
                  <span className="font-display text-7xl sm:text-8xl font-black bg-gradient-to-br from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent leading-none select-none">
                    $0
                  </span>
                  <p className="text-base sm:text-lg font-display font-bold text-white uppercase tracking-wider">
                    Acceso Libre Permanente
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xs mx-auto">
                    Aprende programación desde cero con el temario completo, sin membresías ni cobros sorpresa.
                  </p>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 02: Código Real en Vivo (Texto Izquierda / Comparativa Setup Derecha)
          ========================================================= */}
      <section
        id="codigo-en-vivo"
        className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#0e0c18] to-slate-950"
      >
        {/* Resplandor ambiental de fondo */}
        <div className="absolute top-1/2 right-6 lg:right-24 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.14),rgba(168,85,247,0.04),transparent_70%)] blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Texto Izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-5 text-left"
            >
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Código Real{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  en Vivo
                </span>
              </h2>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                Consola y motor de ejecución en tu navegador. Comprueba de inmediato el funcionamiento de tu lógica sin instalaciones.
              </p>
            </motion.div>

            {/* Elemento Visual Derecha: Tarjeta Comparativa Setup vs Koda */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center w-full"
            >
              <BorderGlow
                borderRadius={24}
                backgroundColor="#0B0F19"
                glowColor="15 95 60"
                colors={['#EA580C', '#F97316', '#FB923C']}
                className="w-full max-w-md shadow-2xl"
                contentClassName="rounded-[23px] p-6 sm:p-8 space-y-5"
              >
                {/* Lo Tradicional */}
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-xs uppercase tracking-wider">
                    <IconX className="w-4 h-4" />
                    El Método Tradicional
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400 font-sans">
                    <li className="flex items-center gap-2">
                      <IconX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      Instalar compiladores y paquetes pesados
                    </li>
                    <li className="flex items-center gap-2">
                      <IconX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      Errores de configuración en terminal y PATH
                    </li>
                    <li className="flex items-center gap-2">
                      <IconX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      Horas perdidas antes de escribir código
                    </li>
                  </ul>
                </div>

                {/* Con Koda */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-xs uppercase tracking-wider">
                    <IconCheck className="w-4 h-4" />
                    Con KodaAcademy
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Abre el navegador en cualquier computadora
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Ejecución instantánea y segura en la web
                    </li>
                    <li className="flex items-center gap-2">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Escribe y prueba código desde el primer segundo
                    </li>
                  </ul>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteractivePreview;

