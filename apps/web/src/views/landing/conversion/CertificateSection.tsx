'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, QrCode, ShieldCheck } from 'lucide-react';
import { Highlight } from '@/components/ui/highlight';
import { WeatherLayer } from '@/components/landing/WeatherLayer';

export const CertificateSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="certificado-title" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-slate-950">
      <WeatherLayer type="dust" count={12} />
      <div aria-hidden="true" data-glow="-10" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-5 text-left"
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400">
              Acreditación real
            </p>
            <h2 id="certificado-title" className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Certificado con QR{' '}
              <Highlight>
                verificable
              </Highlight>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
              Al completar Python recibes un certificado con código único y QR que cualquiera
              puede verificar. Sin letra pequeña, sin costo extra.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <BadgeCheck aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                Código único por certificado, imposible de falsificar a simple vista
              </li>
              <li className="flex items-start gap-2.5">
                <QrCode aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                QR que abre la ficha pública de verificación
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                PDF descargable para tu portafolio y LinkedIn
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="rounded-2xl border border-emerald-400/25 bg-gradient-to-b from-slate-900 to-slate-950 p-6 space-y-4 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.35)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Certificado de ejemplo
                </p>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                  <BadgeCheck aria-hidden="true" className="w-3.5 h-3.5" />
                  Oficial
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-center space-y-1">
                <p className="font-display text-xl font-bold text-white">Python 3.12 · Fundamentos</p>
                <p className="text-xs text-slate-400">Otorgado a Estudiante Koda · 2026</p>
                <p className="font-mono text-sm font-bold text-amber-300 pt-2">KODA-PY-000001</p>
              </div>
              <Link
                href="/register"
                className="flex min-h-[48px] items-center justify-center rounded-xl bg-emerald-400 px-4 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-300"
              >
                Quiero el mío
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CertificateSection;
