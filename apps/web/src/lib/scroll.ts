import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

/** Scroll suave a un anchor: usa Lenis si está activo, si no el nativo. */
export function scrollToId(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -80, duration: 1.4 });
  } else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollIntoView({ behavior: 'auto' });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  return true;
}
