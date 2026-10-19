'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { KodaMascot } from '@/components/brand/KodaMascot';
import { X } from '@phosphor-icons/react';
import { InfoModalTab } from '@/models/landing/info-modal.model';
import { useInfoModalController } from '@/controllers/landing/useInfoModalController';
import { InfoModalSidebar } from '@/views/landing/info-modal/InfoModalSidebar';
import { InfoModalContent } from '@/views/landing/info-modal/InfoModalContent';

export type { InfoModalTab } from '@/models/landing/info-modal.model';

export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: InfoModalTab;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faqs',
}) => {
  const { activeTab, setActiveTab, categories } = useInfoModalController(
    isOpen,
    onClose,
    initialTab
  );
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  const onTrapTab = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="absolute inset-0"
        />

        <motion.div
          ref={dialogRef}
          onKeyDown={onTrapTab}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-title"
          className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden z-10"
        >
          <div className="absolute top-0 right-1/4 w-96 h-48 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_70%)] blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#182030] border border-slate-800 p-0.5 overflow-hidden shadow-sm">
                <KodaMascot
                  state="idle"
                  size={28}
                />
              </div>
              <h3 id="info-title" className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>KodaAcademy</span>
                <span className="text-xs font-normal text-slate-500 font-sans">· Centro de Información</span>
              </h3>
            </div>

            <button
              ref={closeRef}
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Cerrar modal (Esc)"
            >
              <X aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <InfoModalSidebar
              categories={categories}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
            <main ref={mainRef} className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans text-slate-300 text-sm leading-relaxed space-y-6">
              <InfoModalContent key={activeTab} activeTab={activeTab} />
            </main>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;
