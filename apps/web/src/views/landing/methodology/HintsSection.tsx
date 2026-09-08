import React from 'react';
import { motion } from 'framer-motion';

export const HintsSection: React.FC = () => (
  <section id="pistas" className="py-28 md:py-36 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#0a0d18] to-slate-950">
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14)_0%,rgba(99,102,241,0.04)_40%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1)_0%,rgba(234,88,12,0.03)_45%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 pointer-events-none select-none opacity-20 hidden sm:block">
      <svg className="w-full h-full" viewBox="0 0 800 300" fill="none">
        <defs>
          <linearGradient id="pistaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 120 80 Q 280 150 400 150" stroke="url(#pistaGrad1)" strokeWidth="1" strokeDasharray="6 6" />
        <path d="M 680 80 Q 520 150 400 150" stroke="url(#pistaGrad1)" strokeWidth="1" strokeDasharray="6 6" />
        <path d="M 400 30 L 400 150" stroke="url(#pistaGrad1)" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="120" cy="80" r="3" fill="#f59e0b" fillOpacity="0.7" />
        <circle cx="680" cy="80" r="3" fill="#f59e0b" fillOpacity="0.7" />
        <circle cx="400" cy="30" r="3" fill="#fbbf24" fillOpacity="0.8" />
        <circle cx="400" cy="150" r="4" fill="#fbbf24" />
      </svg>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative"
    >
      <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
        Pistas que te enseñan a{' '}
        <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
          pensar
        </span>
        , no spoilers
      </h3>

      <p className="text-slate-400 text-base sm:text-xl leading-relaxed font-sans max-w-2xl mx-auto">
        Si te equivocas, Koda no te regala la respuesta ni te deja frustrado con un error incomprensible. Te orienta con preguntas guía para que descubras la lógica por ti mismo y pienses como ingeniero.
      </p>

      <div className="pt-4 max-w-md mx-auto">
        <p className="text-xs sm:text-sm font-sans italic text-slate-400/80 border-t border-slate-900 pt-4">
          "El objetivo no es que copies código, es que entiendas cómo resolverlo."
        </p>
      </div>
    </motion.div>
  </section>
);
