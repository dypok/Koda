'use client';

import React from 'react';
import { LandingPageView } from '@/views/landing/LandingPageView';

/**
 * Página Principal (Dominio Raíz: localhost:3000 / koda.com)
 * Sirve exclusivamente la Landing Page de Koda sin bloqueos ni secuestro de sesión.
 */
export default function HomePage() {
  return <LandingPageView />;
}
