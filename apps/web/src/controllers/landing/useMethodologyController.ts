import { useCallback } from 'react';
import { PILLARS } from '@/models/landing/methodology.model';

export function useMethodologyController() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return {
    pillars: PILLARS,
    scrollTo,
  };
}
