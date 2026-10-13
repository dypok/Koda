'use client';

import { useEffect, useState } from 'react';

export type LandingLang = 'es' | 'en';

const STORAGE_KEY = 'koda-lang';

export interface HeroStrings {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  titleB: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string;
}

const STRINGS: Record<LandingLang, HeroStrings> = {
  es: {
    eyebrow: 'Micro-lecciones de Python 3.12 y Lua · 40–70 palabras',
    titleA: 'Aprende a programar',
    titleAccent: 'como juegas',
    titleB: '. Cero frustración.',
    sub: 'Tú lees una idea corta, la ves en código real y la practicas al instante. Si fallas, recibes una pista sin spoilers y la repasas al final. Así avanzas por 12 módulos sin muros de texto.',
    ctaPrimary: 'Comenzar Ahora',
    ctaSecondary: 'Ya tengo una cuenta',
    trust: 'Gratis · Sin instalación · Python 3.12 y Lua · +10 XP por sección',
  },
  en: {
    eyebrow: 'Python 3.12 and Lua micro-lessons · 40–70 words',
    titleA: 'Learn to code',
    titleAccent: 'like you play',
    titleB: '. Zero frustration.',
    sub: 'You read one short idea, see it in real code and practice it instantly. If you fail, you get a spoiler-free hint and review it at the end. That is how you move through 12 modules with no walls of text.',
    ctaPrimary: 'Start Now',
    ctaSecondary: 'I already have an account',
    trust: 'Free · No setup · Python 3.12 and Lua · +10 XP per section',
  },
};

function readLang(): LandingLang {
  if (typeof window === 'undefined') return 'es';
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

/** Diccionario ES/EN del hero; reacciona a cambios de `koda-lang`. */
export function useHeroStrings(): HeroStrings {
  const [lang, setLang] = useState<LandingLang>('es');

  useEffect(() => {
    setLang(readLang());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLang(readLang());
    };
    const onFocus = () => setLang(readLang());
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return STRINGS[lang];
}
