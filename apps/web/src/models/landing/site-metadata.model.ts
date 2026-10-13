import type { Metadata, Viewport } from 'next';

export const siteViewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
};

export const siteMetadata: Metadata = {
  metadataBase: new URL('https://koda.app'),
  title: 'KodaAcademy — Aprende a Programar como juegas',
  description:
    'Plataforma interactiva de aprendizaje de programación con micro-lecciones prácticas, ejecución de código en vivo y certificación oficial con código QR. Aprende a programar desde cero a tu propio ritmo.',
  keywords: [
    'kodaacademy',
    'koda academy',
    'aprender a programar',
    'plataforma interactiva de programacion',
    'aprender a codificar',
    'lenguajes de programacion',
    'cursos de programacion',
    'koda',
    'gamificacion educativa',
    'certificacion de programacion',
  ],
  authors: [{ name: 'Equipo KodaAcademy' }],
  creator: 'KodaAcademy',
  icons: {
    icon: [
      { url: '/icon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=2' },
      { url: '/icon.png?v=2', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icon.png?v=2',
  },
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: 'https://koda.app',
    title: 'KodaAcademy — Aprende a Programar como juegas',
    description:
      'Plataforma interactiva de programación con micro-lecciones de práctica inmediata y certificación digital. Aprende a programar desde cero a tu propio ritmo.',
    siteName: 'KodaAcademy',
    images: [
      {
        // TODO(diseño): generar og-image.png 1200x630 de marca y revertir este fallback.
        url: '/icon.png',
        alt: 'KodaAcademy — Plataforma Interactiva de Programación',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KodaAcademy — Aprende a Programar como juegas',
    description:
      'Plataforma interactiva de programación con micro-lecciones de práctica inmediata y certificación digital. Aprende a programar desde cero a tu propio ritmo.',
    images: ['/icon.png'],
  },
};
