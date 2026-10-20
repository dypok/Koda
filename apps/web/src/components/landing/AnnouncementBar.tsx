'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Sparkle } from '@phosphor-icons/react';
import { getAppUrl } from '@/lib/domain';

const STORAGE_KEY = 'koda-announce-dismissed';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // sin almacenamiento, solo se oculta en sesión
    }
  };

  return (
    <div className="relative z-40 flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 text-center text-[13px] font-semibold text-slate-950">
      <Sparkle aria-hidden="true" className="h-4 w-4 shrink-0" />
      <p>
        Módulo 02 · Variables y Tipos ya disponible.{' '}
        <Link href={getAppUrl('/register')} className="underline underline-offset-2 hover:opacity-80">
          Empezar gratis
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar anuncio"
        className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-slate-950/10"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
