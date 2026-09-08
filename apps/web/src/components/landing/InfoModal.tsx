'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0d121f] via-slate-950 to-[#0a0d16] shadow-2xl overflow-hidden z-10"
        >
          <div className="absolute top-0 right-1/4 w-96 h-48 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_70%)] blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#182030] border border-slate-800 overflow-hidden shadow-sm">
                <Image
                  src="/logo.png"
                  alt="KodaAcademy Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h3 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>KodaAcademy</span>
                <span className="text-xs font-normal text-slate-500 font-sans">· Centro de Información</span>
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <InfoModalSidebar
              categories={categories}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans text-slate-300 text-sm leading-relaxed space-y-6">
              <InfoModalContent activeTab={activeTab} />
            </main>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InfoModal;
