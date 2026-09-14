import { useCallback } from 'react';
import { PILLARS } from '@/models/landing/methodology.model';
import { scrollToId } from '@/lib/scroll';

export function useMethodologyController() {
  const scrollTo = useCallback((id: string) => {
    scrollToId(id);
  }, []);

  return {
    pillars: PILLARS,
    scrollTo,
  };
}
