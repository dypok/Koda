'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconGift,
  IconTrophy,
  IconTerminal2,
  IconCheck,
  IconX,
  IconSparkles,
  IconBolt,
  IconShieldCheck,
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
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <IconGift className="w-3.5 h-3.5 text-amber-400" />
                Acceso Libre y Universal
              </div>

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

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-3 max-w-xl">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <IconSparkles className="w-4 h-4 text-amber-400" />
                  100% Gratuito
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Educación tecnológica de alta calidad accesible para todos. Acceso libre a lecciones, retos y proyectos sin costo alguno.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300 font-sans border-t border-slate-800/60">
                  <span className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Sin tarjeta de crédito
                  </span>
                  <span className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Cero muros de pago
                  </span>
                  <span className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Micro-lecciones ilimitadas
                  </span>
                  <span className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Certificados incluidos
                  </span>
                </div>
              </div>
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
                contentClassName="rounded-[23px] p-8 sm:p-10 flex flex-col items-center text-center space-y-6"
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

                <div className="w-full pt-4 border-t border-slate-800/80 flex justify-around text-center text-xs text-slate-400 font-sans">
                  <div>
                    <span className="block font-bold text-white text-base">100%</span>
                    <span>Libre</span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-800" />
                  <div>
                    <span className="block font-bold text-white text-base">0</span>
                    <span>Paywalls</span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-800" />
                  <div>
                    <span className="block font-bold text-white text-base">∞</span>
                    <span>Práctica</span>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 02: Los Mejores Resultados (Invertido: Comparativa Izquierda / Texto Derecha)
          ========================================================= */}
      <section
        id="resultados"
        className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#0d0f1c] to-slate-950"
      >
        {/* Resplandor ambiental de fondo */}
        <div className="absolute top-1/2 left-6 lg:left-24 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12),rgba(56,189,248,0.04),transparent_70%)] blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Elemento Visual Izquierda: Comparativa de Retención Activa */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full"
            >
              <BorderGlow
                borderRadius={24}
                backgroundColor="#0B0F19"
                glowColor="45 95 60"
                colors={['#F59E0B', '#FBBF24', '#D97706']}
                className="w-full max-w-md shadow-2xl"
                contentClassName="rounded-[23px] p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">
                    Retención Cognitiva
                  </span>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    Estudios de Aprendizaje
                  </span>
                </div>

                {/* Comparación 1: Tutoriales Pasivos */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-sans">Tutoriales en Video (Pasivo)</span>
                    <span className="text-slate-500 font-mono font-bold">1x Retención</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600/70 rounded-full w-[25%]" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Ilusión de entendimiento momentáneo pero olvido de sintaxis y algoritmos en 48 horas.
                  </p>
                </div>

                {/* Comparación 2: Método Interactivo Koda */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-bold font-sans flex items-center gap-1.5">
                      <IconBolt className="w-3.5 h-3.5 text-amber-400" />
                      Práctica Activa Koda
                    </span>
                    <span className="text-amber-400 font-mono font-bold">4x Superior</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 rounded-full w-full shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                  </div>
                  <p className="text-[11px] text-amber-300/80 font-sans">
                    Resolver desafíos en vivo consolida la memoria muscular y el pensamiento lógico independiente.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3.5 text-center">
                  <p className="text-xs text-slate-300 font-sans">
                    <strong className="text-white">Resultado comprobado:</strong> la práctica deliberada supera en 4x la tasa de retención a largo plazo.
                  </p>
                </div>
              </BorderGlow>
            </motion.div>

            {/* Texto Derecha */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <IconTrophy className="w-3.5 h-3.5 text-amber-400" />
                Máxima Eficacia
              </div>

              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Los Mejores{' '}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Resultados
                </span>
              </h2>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                La práctica deliberada con código real genera una retención hasta 4x superior a mirar tutoriales pasivos en video.
              </p>

              <div className="space-y-3 pt-2 text-slate-300 text-sm font-sans max-w-xl">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-amber-500/10 p-1.5 text-amber-400 border border-amber-500/20">
                    <IconCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Aprende haciendo desde el minuto uno</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                      Cada lección te pide resolver retos reales de programación en lugar de ver a otra persona codificar en pantalla.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-orange-500/10 p-1.5 text-orange-400 border border-orange-500/20">
                    <IconCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Resolución de problemas independiente</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                      Desarrolla el criterio analítico necesario para formular tus propias soluciones ante cualquier problema tecnológico.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 03: Código Real en Vivo (Texto Izquierda / Comparativa Setup Derecha)
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
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-semibold tracking-wider uppercase">
                <IconTerminal2 className="w-3.5 h-3.5 text-orange-400" />
                Cero Fricción Técnica
              </div>

              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Código Real{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  en Vivo
                </span>
              </h2>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                Consola y motor de ejecución en tu navegador. Comprueba de inmediato el funcionamiento de tu lógica sin instalaciones.
              </p>

              <div className="space-y-3 pt-2 text-slate-300 text-sm font-sans max-w-xl">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-orange-500/10 p-1.5 text-orange-400 border border-orange-500/20">
                    <IconCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Sin descargas ni entornos complejos</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                      Empieza a programar inmediatamente sin perder horas configurando terminales, dependencias o variables de sistema.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-amber-500/10 p-1.5 text-amber-400 border border-amber-500/20">
                    <IconCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Resultados y feedback al instante</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                      Visualiza de inmediato la salida de tu código y aprende de tus errores en el momento exacto en que ocurren.
                    </p>
                  </div>
                </div>
              </div>
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
                contentClassName="rounded-[23px] p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">
                    Tiempo para Comenzar
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                    0 Segundos Setup
                  </span>
                </div>

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

