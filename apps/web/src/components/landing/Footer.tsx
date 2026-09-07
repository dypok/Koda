'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconArticle,
} from '@tabler/icons-react';
import { InfoModal, InfoModalTab } from './InfoModal';

export const Footer: React.FC = () => {
  const [modalTab, setModalTab] = useState<InfoModalTab | null>(null);

  const openModal = (tab: InfoModalTab) => {
    setModalTab(tab);
  };

  const closeModal = () => {
    setModalTab(null);
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs sm:text-sm overflow-hidden">
      {/* Línea luminosa de acento superior tenue */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />

      {/* Resplandor ambiental de fondo cálido (GPU Layer) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[750px] h-[200px] bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.06)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Columna 1: Marca & Misión (md:col-span-3) */}
          <div className="md:col-span-3 space-y-4">
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

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed font-sans">
              Plataforma interactiva y gratuita para aprender a programar paso a paso. Sin frustración, a tu propio ritmo y con práctica directa en tu navegador.
            </p>

            <div className="text-[11px] text-slate-500 font-sans pt-1">
              © {new Date().getFullYear()} KodaAcademy Inc.
            </div>
          </div>

          {/* Columna 2: Ayuda y Soporte (md:col-span-3) */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Ayuda y Soporte
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <button
                  onClick={() => openModal('faqs')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Preguntas Frecuentes (FAQs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('schools')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Koda para Escuelas
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('tests')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Certificación & Evaluaciones
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Privacidad y Términos (md:col-span-3) */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Privacidad y Términos
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <button
                  onClick={() => openModal('guidelines')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Normas de la Comunidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('terms')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Términos de Servicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('privacy')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('data-rights')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  No Vender ni Compartir mi Información
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 4: Social (md:col-span-3) */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Social
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <button
                  onClick={() => openModal('social')}
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <IconArticle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Blog Oficial</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('social')}
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <IconBrandInstagram className="w-3.5 h-3.5 text-slate-500" />
                  <span>Instagram</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('social')}
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <IconBrandTiktok className="w-3.5 h-3.5 text-slate-500" />
                  <span>TikTok</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('social')}
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <IconBrandX className="w-3.5 h-3.5 text-slate-500" />
                  <span>Twitter / X</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('social')}
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <IconBrandYoutube className="w-3.5 h-3.5 text-slate-500" />
                  <span>YouTube</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('social')}
                  className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <IconBrandLinkedin className="w-3.5 h-3.5 text-slate-500" />
                  <span>LinkedIn</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p>© {new Date().getFullYear()} KodaAcademy. Todos los derechos reservados.</p>
        </div>
      </motion.div>

      {/* Modal Institucional con Tabs Temáticos */}
      <InfoModal
        isOpen={modalTab !== null}
        onClose={closeModal}
        initialTab={modalTab || 'faqs'}
      />
    </footer>
  );
};

export default Footer;
