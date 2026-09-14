'use client';

import React, { useEffect } from 'react';

const HUES = [38, 160, 190];
const STORAGE_KEY = 'koda-aurora';

/** Rota el acento global cada 20s. Respeta reduced-motion y `koda-aurora=off`. */
export const AuroraProvider: React.FC = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let off = false;
    try {
      off = window.localStorage.getItem(STORAGE_KEY) === 'off';
    } catch {
      off = false;
    }
    if (off) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % HUES.length;
      document.documentElement.style.setProperty('--koda-hue', String(HUES[i]));
    }, 20000);
    return () => clearInterval(id);
  }, []);

  return null;
};

export default AuroraProvider;
