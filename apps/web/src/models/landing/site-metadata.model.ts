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
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icon.png',
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
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KodaAcademy — Plataforma Interactiva de Programación',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KodaAcademy — Aprende a Programar como juegas',
    description:
      'Plataforma interactiva de programación con micro-lecciones de práctica inmediata y certificación digital. Aprende a programar desde cero a tu propio ritmo.',
    images: ['/og-image.png'],
  },
};
