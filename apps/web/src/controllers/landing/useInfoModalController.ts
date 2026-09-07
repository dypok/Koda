import { useState, useEffect } from 'react';
import { InfoModalTab, MODAL_CATEGORIES } from '@/models/landing/info-modal.model';

export function useInfoModalController(
  isOpen: boolean,
  onClose: () => void,
  initialTab: InfoModalTab = 'faqs'
) {
  const [activeTab, setActiveTab] = useState<InfoModalTab>(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return {
    activeTab,
    setActiveTab,
    categories: MODAL_CATEGORIES,
  };
}
