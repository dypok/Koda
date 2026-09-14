import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { InfoModalTab, MODAL_CATEGORIES } from '@/models/landing/info-modal.model';

export function useInfoModalController(
  isOpen: boolean,
  onClose: () => void,
  initialTab: InfoModalTab = 'faqs'
) {
  const [activeTab, setActiveTab] = useState<InfoModalTab>(initialTab);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const prevOverflow = useRef('');
  const prevActive = useRef<Element | null>(null);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    prevOverflow.current = document.body.style.overflow;
    prevActive.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow.current;
      window.removeEventListener('keydown', handleKeyDown);
      const prev = prevActive.current as HTMLElement | null;
      prev?.focus?.();
    };
  }, [isOpen]);

  const openTab = useCallback((tab: InfoModalTab) => {
    setActiveTab(tab);
  }, []);

  const categories = useMemo(() => MODAL_CATEGORIES, []);

  return {
    activeTab,
    setActiveTab: openTab,
    categories,
  };
}
