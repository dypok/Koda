'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SHOWCASE_SLIDES } from '@/models/auth/login-showcase.constants';

export const LoginShowcaseCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = SHOWCASE_SLIDES[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 select-none pointer-events-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <Image
          src="/brand/logo.svg"
          alt="KodaAcademy"
          width={498}
          height={185}
          className="h-8 w-auto object-contain"
          priority
        />
      </div>

      {/* Center Animated Slide Area (Sin badges) */}
      <div className="my-auto py-6 max-w-md space-y-5">
        <IconComponent
          className="w-10 h-10 transform-gpu transition-all duration-500"
          style={{ color: current.color }}
        />

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight transition-all duration-500">
            {current.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed transition-opacity duration-500">
            {current.description}
          </p>
        </div>
      </div>

      {/* Passive Visual Progress Indicators (NO INTERACTIVE) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {SHOWCASE_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className="h-1.5 rounded-full transition-all duration-500 bg-slate-800"
              style={{
                width: idx === currentIndex ? '36px' : '10px',
                backgroundColor: idx === currentIndex ? current.color : undefined,
              }}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Plataforma Interactiva de Aprendizaje
        </span>
      </div>
    </div>
  );
};
