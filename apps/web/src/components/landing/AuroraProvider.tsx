'use client';

import React, { useEffect } from 'react';

const HUES = [38, 160, 190];
const STORAGE_KEY = 'koda-aurora';

/** Rota el acento global cada 20s. Respeta reduced-motion y `koda-aurora=off`. */
export const AuroraProvider: React.FC = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id: ReturnType<typeof setInterval> | null = null;
    let i = 0;

    const startOrStop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
      let off = false;
      try {
        off = window.localStorage.getItem(STORAGE_KEY) === 'off';
      } catch {
        off = false;
      }
      if (off) {
        document.documentElement.style.setProperty('--koda-hue', '38');
        return;
      }
      id = setInterval(() => {
        i = (i + 1) % HUES.length;
        document.documentElement.style.setProperty('--koda-hue', String(HUES[i]));
      }, 20000);
    };

    startOrStop();
    window.addEventListener('koda-aurora-change', startOrStop);
    return () => {
      if (id) clearInterval(id);
      window.removeEventListener('koda-aurora-change', startOrStop);
    };
  }, []);

  return null;
};

export default AuroraProvider;
