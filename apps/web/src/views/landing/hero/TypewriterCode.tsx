'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CODE = 'print("Hola, Koda")';
const OUTPUT = 'Hola, Koda';

/** Terminal que escribe código en loop con cursor y salida. */
export const TypewriterCode: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [chars, setChars] = useState(CODE.length);
  const [showOutput, setShowOutput] = useState(true);

  useEffect(() => {
    if (reduceMotion) {
      setChars(CODE.length);
      setShowOutput(true);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (i <= CODE.length) {
        setChars(i);
        setShowOutput(false);
        i += 1;
        timer = setTimeout(step, 55 + Math.random() * 60);
      } else {
        setShowOutput(true);
        timer = setTimeout(() => {
          i = 0;
          step();
        }, 3200);
      }
    };
    timer = setTimeout(step, 1200);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <div
      aria-label={`Ejemplo de código: ${CODE}. Salida: ${OUTPUT}`}
      className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur px-4 py-3 font-mono text-sm leading-relaxed"
    >
      <p className="flex items-center gap-2 text-slate-200">
        <span aria-hidden="true" className="text-amber-400 select-none">&gt;&gt;&gt;</span>
        <span>{CODE.slice(0, chars)}</span>
        <span aria-hidden="true" className="inline-block w-[8px] h-[18px] bg-amber-400 animate-pulse" />
      </p>
      <p className={`text-emerald-300 pl-8 transition-opacity duration-300 ${showOutput ? 'opacity-100' : 'opacity-0'}`}>
        {OUTPUT}
      </p>
    </div>
  );
};

export default TypewriterCode;
