import React from 'react';
import { motion } from 'framer-motion';
import { IconX, IconCheck } from '@tabler/icons-react';

export const LiveCodeComparisonSection: React.FC = () => {
  return (
    <section
      id="codigo-en-vivo"
      className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#0e0c18] to-slate-950"
    >
      <div className="absolute top-1/2 right-6 lg:right-24 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.14)_0%,rgba(168,85,247,0.04)_45%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center space-y-6 w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <p className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-rose-400">
                  El Método Tradicional
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-sans">
                <li className="flex items-start gap-2.5">
                  <IconX className="w-4 h-4 text-rose-500/80 shrink-0 mt-0.5" />
                  <span>Instalar compiladores y paquetes pesados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconX className="w-4 h-4 text-rose-500/80 shrink-0 mt-0.5" />
                  <span>Errores de configuración en terminal y PATH</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconX className="w-4 h-4 text-rose-500/80 shrink-0 mt-0.5" />
                  <span>Horas perdidas antes de escribir código</span>
                </li>
              </ul>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-slate-800 via-slate-700/40 to-transparent" />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <p className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-emerald-400">
                  Con KodaAcademy
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 font-sans">
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Abre el navegador en cualquier computadora</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Ejecución instantánea y segura en la web</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Escribe y prueba código desde el primer segundo</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
