'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check } from '@phosphor-icons/react';
import { GlareHover } from '@/components/ui/glare-hover';
import { LanguageOption } from '@/models/register/register.model';
import { cn } from '@/lib/utils';

const SCRAMBLE = '01#_*/&%<>~';

function useScramble(text: string, active: boolean) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = 10;
    const id = window.setInterval(() => {
      frame += 1;
      const done = Math.floor((frame / total) * text.length);
      let s = text.slice(0, done);
      for (let i = done; i < text.length; i += 1) {
        s += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      }
      setOut(s);
      if (frame >= total) {
        setOut(text);
        window.clearInterval(id);
      }
    }, 40);
    return () => {
      window.clearInterval(id);
      setOut(text);
    };
  }, [active, text]);
  return out;
}

interface LanguageCardProps {
  option: LanguageOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ option, isSelected, onSelect }) => {
  const IconComponent = option.icon;
  const isClickable = option.isAvailable;
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const timer = useRef<number | null>(null);
  const name = useScramble(option.name, hover && isClickable);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  // Al click el relleno se queda 650ms fundiéndose al fondo seleccionado.
  const handleSelect = () => {
    if (!isClickable) return;
    onSelect(option.id);
    setPressed(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPressed(false), 650);
  };

  return (
    <>
      <style>{`@keyframes card-pop{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    <GlareHover
      role="button"
      tabIndex={isClickable ? 0 : -1}
      aria-pressed={isSelected}
      aria-disabled={!isClickable}
      onClick={handleSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      glareColor={isClickable ? '#F97316' : '#64748B'}
      glareOpacity={isClickable ? 0.3 : 0}
      transitionDuration={600}
      className={cn(
        'group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border select-none text-left outline-none min-h-[102px] h-full transform-gpu',
        'transition-[border-color,background-color,box-shadow] duration-300 ease-out',
        isClickable && 'transition-transform duration-150 active:scale-[0.985]',
        isSelected
          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-2 ring-amber-500/50 cursor-pointer'
          : isClickable
          ? 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 cursor-pointer'
          : 'border-slate-800/40 bg-slate-900/30 opacity-60 cursor-not-allowed'
      )}
    >
      {/* Círculo expansivo optimizado con GPU scale y pointer-events-none */}
      {isClickable && (!isSelected || pressed) && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 transform-gpu',
            'transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
            pressed
              ? 'scale-[10] opacity-100'
              : 'scale-0 opacity-0 group-hover/glare:scale-[10] group-hover/glare:opacity-100'
          )}
        />
      )}
      {/* Icono con aceleración GPU */}
      <IconComponent
        className={cn(
          'w-8 h-8 shrink-0 mt-0.5 transition-transform duration-200 transform-gpu will-change-transform',
          isClickable ? 'group-hover:scale-105' : 'grayscale-[40%]'
        )}
        style={{ color: option.color }}
      />

      {/* Contenido con nombre estabilizado y badge */}
      <div className="flex-1 min-w-0 pr-2 relative z-0">
        <div className="flex items-center gap-2 mb-1.5 flex-nowrap">
          <h3 className="relative text-sm sm:text-base font-bold tracking-tight leading-none whitespace-nowrap">
            {/* Sizer invisible que mantiene el ancho idéntico a option.name en todo momento */}
            <span className="invisible select-none" aria-hidden="true">
              {option.name}
            </span>
            {/* Texto animado decode en hover sin alterar el layout */}
            <span
              className={cn(
                'absolute inset-0 flex items-center transition-colors duration-200',
                hover && isClickable ? 'text-amber-300 font-mono text-sm' : 'text-white'
              )}
            >
              {name}
            </span>
          </h3>
          {option.badge && (
            <span
              className={cn(
                'text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide whitespace-nowrap shrink-0',
                option.isAvailable
                  ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40'
                  : 'text-slate-400 bg-slate-800/70 border-slate-700/50'
              )}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-[13px] text-slate-300/85 leading-relaxed">
          {option.description}
        </p>
      </div>
    </GlareHover>
    </>
  );
};
