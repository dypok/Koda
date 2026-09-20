'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SHOWCASE_SLIDES } from '@/models/auth/login-showcase.constants';

export const LoginShowcaseCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = SHOWCASE_SLIDES[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pointer-events-none">
        <Image
          src="/brand/logo.svg"
          alt="KodaAcademy"
          width={498}
          height={185}
          className="h-8 w-auto object-contain"
          priority
        />
      </div>

      {/* Center Animated Slide Area con transiciones fluidas */}
      <div className="my-auto py-6 max-w-md min-h-[280px] flex flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Icono con halo luminoso al color de la temática */}
            <div className="relative inline-flex items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl blur-xl opacity-35 transition-colors duration-500"
                style={{ backgroundColor: current.color }}
              />
              <div className="relative p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-lg">
                <IconComponent
                  className="w-8 h-8 transform-gpu"
                  style={{ color: current.color }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {current.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {current.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicadores de progreso interactivos y animados */}
      <div className="flex items-center gap-2">
        {SHOWCASE_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Ir al aviso ${idx + 1}: ${slide.title}`}
            onClick={() => setCurrentIndex(idx)}
            className="h-1.5 rounded-full transition-all duration-500 bg-slate-800 hover:bg-slate-700 cursor-pointer focus:outline-none"
            style={{
              width: idx === currentIndex ? '36px' : '10px',
              backgroundColor: idx === currentIndex ? current.color : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};
