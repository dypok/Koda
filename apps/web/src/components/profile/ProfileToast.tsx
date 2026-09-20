'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ProfileToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const ProfileToast: React.FC<ProfileToastProps> = ({ toast, onClose }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-xl max-w-sm"
        >
          {toast.type === 'success' && (
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-400" weight="fill" />
          )}
          {toast.type === 'error' && (
            <WarningCircle className="h-5 w-5 flex-shrink-0 text-rose-400" weight="fill" />
          )}
          {toast.type === 'info' && (
            <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-amber-400 animate-ping" />
          )}

          <p className="text-sm font-medium text-slate-100 flex-1">{toast.text}</p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar notificación"
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
