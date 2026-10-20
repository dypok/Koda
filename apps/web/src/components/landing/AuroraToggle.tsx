'use client';

import React, { useEffect, useState } from 'react';
import { Palette } from '@phosphor-icons/react';

const STORAGE_KEY = 'koda-aurora';

/** Pausa/fija la aurora en ámbar. Persiste en localStorage. */
export const AuroraToggle: React.FC = () => {
  const [off, setOff] = useState(false);

  useEffect(() => {
    try {
      setOff(window.localStorage.getItem(STORAGE_KEY) === 'off');
    } catch {
      setOff(false);
    }
  }, []);

  const toggle = () => {
    const next = !off;
    setOff(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'off' : 'on');
    } catch {
      // sin almacenamiento, solo sesión
    }
    if (next) document.documentElement.style.setProperty('--koda-hue', '38');
    window.dispatchEvent(new CustomEvent('koda-aurora-change', { detail: { off: next } }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!off}
      aria-label={off ? 'Activar aurora de color' : 'Fijar acento ámbar'}
      title={off ? 'Activar aurora de color' : 'Fijar acento ámbar'}
      className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full border border-slate-800 text-slate-500 transition-colors hover:border-amber-400/50 hover:text-amber-300"
    >
      <Palette aria-hidden="true" className="w-3.5 h-3.5" />
    </button>
  );
};

export default AuroraToggle;
