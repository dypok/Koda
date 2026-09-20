'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';
import { LoginShowcaseCarousel } from '@/views/login/LoginShowcaseCarousel';
import { LoginForm } from '@/views/login/LoginForm';
import { useAuthStore } from '@/stores/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      if (user && user.onboardingCompleted === false) {
        router.replace('/register');
      } else {
        router.replace('/');
      }
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  if (hasHydrated && isAuthenticated) {
    return (
      <KodaLoadingScreen
        title="Redirigiendo a tu espacio..."
        subtitle="Preparando tu ruta de aprendizaje..."
        terminalHint="> auth :: sesion_activa"
      />
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-transparent text-slate-100 flex flex-col lg:flex-row selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <HeroSkyBackground starCount={160} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Left Section: Ambient Non-Interactive Showcase Carousel */}
      <section className="hidden lg:flex lg:w-5/12 min-h-screen border-r border-slate-800/30 relative z-10 bg-slate-950/20 backdrop-blur-[1px]">
        <LoginShowcaseCarousel />
      </section>

      {/* Right Section: Integrated Login Form (Made Bigger: 7/12 width) */}
      <section className="w-full lg:w-7/12 min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-20 relative z-10">
        <LoginForm />
      </section>
    </div>
  );
}
