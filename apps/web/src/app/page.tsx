'use client';

import React, { useEffect, useState } from 'react';
import { isAppHost, getAppUrl } from '@/lib/domain';
import { LandingPageView } from '@/views/landing/LandingPageView';
import AppPage from '@/app/app/page';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

/**
 * Pagina Principal (/):
 * - Si se ejecuta en el subdominio de la app (app.localhost / app.koda.academy):
 *   Delega a AppPage (Roadmap del estudiante o redireccion a /login),
 *   asegurando que las navegaciones client-side (router.replace('/')) funcionen de forma instantanea.
 * - Si contiene fragmento OAuth (#access_token= o #error=):
 *   Redirige inmediatamente al subdominio app (/login#...) para procesar y persistir la sesion en el origen correspondiente.
 * - Si se ejecuta en el dominio raiz (localhost:3000 / koda.academy):
 *   Sirve exclusivamente la Landing Page de Koda sin bloqueos ni secuestro de sesion.
 */
export default function HomePage() {
  const [isRedirectingOAuth, setIsRedirectingOAuth] = useState(false);

  const isExplicitLanding = typeof window !== 'undefined' && window.location.search.includes('landing=true');
  const isApp = typeof window !== 'undefined' ? isAppHost(window.location.host) : false;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
      setIsRedirectingOAuth(true);
      const isAppSubdomain = isAppHost(window.location.host);
      if (!isAppSubdomain) {
        window.location.replace(getAppUrl(`/login${hash}`));
      } else {
        window.location.replace(`/login${hash}`);
      }
    }
  }, []);

  if (isRedirectingOAuth) {
    return (
      <KodaLoadingScreen
        title="Iniciando sesión..."
        subtitle="Transfiriendo credenciales a la plataforma de aprendizaje..."
        terminalHint="> auth :: redirigiendo a plataforma app"
      />
    );
  }

  // Si se solicita expresamente ver la landing page en cualquier host
  if (isExplicitLanding) {
    return <LandingPageView />;
  }

  if (isApp) {
    return <AppPage />;
  }

  return <LandingPageView />;
}
