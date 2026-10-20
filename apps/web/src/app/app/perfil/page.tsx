'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { RoadmapDynamicBackground } from '@/components/roadmap/RoadmapDynamicBackground';
import { ProfileSettingsModal, SettingsTab } from '@/components/profile/ProfileSettingsModal';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, initAuth } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(true);
  const [tab] = useState<SettingsTab>('profile');

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleClose = () => {
    setModalOpen(false);
    router.push('/');
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <RoadmapDynamicBackground />

      {/* Barra superior de navegación */}
      <header className="fixed top-4 left-4 z-20">
        <button
          type="button"
          onClick={handleClose}
          className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-xl hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Roadmap</span>
        </button>
      </header>

      {/* Modal / Vista de Configuración */}
      <ProfileSettingsModal
        isOpen={modalOpen}
        onClose={handleClose}
        initialTab={tab}
      />
    </div>
  );
}
