'use client';

import React from 'react';
import { isAppHost } from '@/lib/domain';
import { LandingPageView } from '@/views/landing/LandingPageView';
import AppPage from '@/app/app/page';

/**
 * Página Principal (/):
 * - Si se ejecuta en el subdominio de la app (app.localhost / app.koda.academy):
 *   Delega a AppPage (Roadmap del estudiante o redirección a /login),
 *   asegurando que las navegaciones client-side (router.replace('/')) funcionen de forma instantánea.
 * - Si se ejecuta en el dominio raíz (localhost:3000 / koda.academy):
 *   Sirve exclusivamente la Landing Page de Koda sin bloqueos ni secuestro de sesión.
 */
export default function HomePage() {
  const isApp = typeof window !== 'undefined' ? isAppHost(window.location.host) : false;

  if (isApp) {
    return <AppPage />;
  }

  return <LandingPageView />;
}
