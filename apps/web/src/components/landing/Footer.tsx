'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  IconBrandGithub,
  IconQrcode,
  IconArrowUp,
  IconSparkles,
  IconExternalLink,
} from '@tabler/icons-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs sm:text-sm overflow-hidden">
      {/* Línea luminosa de acento superior tenue */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />

      {/* Resplandor ambiental de fondo cálido */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[750px] h-[220px] bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.06),transparent_70%)] blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-18 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Columna 1: Marca & Misión (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#182030] border border-slate-800 group-hover:border-amber-500/40 group-hover:scale-105 transition-all overflow-hidden shadow-sm">
                <Image
                  src="/logo.png"
                  alt="KodaAcademy Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                KodaAcademy
              </span>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-sans">
              La plataforma interactiva y gratuita diseñada para aprender a programar de verdad. Domina la lógica universal del código mediante micro-retos guiados, constancia diaria y ejecución directa en tu navegador.
            </p>

            {/* Badge de estado y track oficial */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span>Plataforma Activa</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">Track Inaugural: Python 3.12</span>
            </div>
          </div>

          {/* Columna 2: Método Koda (md:col-span-3) */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Método Koda
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <button
                  onClick={() => scrollTo('rachas')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Rachas Diarias (15 min)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('roadmap')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Roadmap Claro Paso a Paso
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('codigo-real')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Código Real en Vivo (4x Retención)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('pistas')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Pistas Inteligentes sin Spoilers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('propuesta-valor')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  100% Gratuito y Libre
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Ecosistema & Recursos (md:col-span-2) */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Ecosistema
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <a
                  href="https://github.com/nastex123/DuolingoProgramacion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors group"
                >
                  <IconBrandGithub className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                  <span>Código Abierto</span>
                  <IconExternalLink className="w-3 h-3 text-slate-600 group-hover:text-amber-400/80 transition-colors" />
                </a>
              </li>
              <li>
                <Link
                  href="/verificar"
                  className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors group"
                >
                  <IconQrcode className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                  <span>Verificar Certificados</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('metodologia')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Pathway Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 4: Navegación & Scroll to Top (md:col-span-2) */}
          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                Navegación
              </h4>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-sans text-slate-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 group cursor-pointer shadow-sm w-fit"
              >
                <span>Volver al inicio</span>
                <IconArrowUp className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1 font-sans">
              <p>Next.js 15 & React 19</p>
              <p>Tailwind CSS & Framer Motion</p>
            </div>
          </div>
        </div>

        {/* Fila Inferior / Copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p>© {new Date().getFullYear()} KodaAcademy. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <IconSparkles className="w-3.5 h-3.5 text-amber-400" />
              Aprende a programar como juegas
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
