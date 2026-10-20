import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAppHost, getAppUrl } from '@/lib/domain';

// Rutas exclusivas de la aplicación de aprendizaje (Roadmap, Cursos, Auth, Perfil)
const APP_ONLY_PREFIXES = [
  '/app',
  '/curso',
  '/perfil',
  '/login',
  '/register',
  '/onboarding',
  '/nueva-clave',
  '/verificar',
  '/evaluaciones',
  '/ruta',
  '/modulo',
  '/modulos',
];

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname, search } = request.nextUrl;
  const isApp = isAppHost(host);

  // 1. CASO DOMINIO RAÍZ / NORMAL (Landing Page y Marketing)
  // ej. localhost:3000, koda.academy, koda.com, www.koda.com
  if (!isApp) {
    // Si el usuario intenta entrar a una ruta de la aplicación en el dominio normal,
    // lo redirigimos limpiamente con 307 al subdominio de la app (ej. app.localhost:3000/login)
    const isAppRoute = APP_ONLY_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (isAppRoute) {
      const targetUrl = getAppUrl(`${pathname}${search}`, host);
      return NextResponse.redirect(new URL(targetUrl), 307);
    }

    // Cualquier otra ruta en el dominio normal (/, /preview-*, etc.) se sirve como web pública
    return NextResponse.next();
  }

  // 2. CASO SUBDOMINIO DE LA APP (Plataforma de Aprendizaje y Auth)
  // ej. app.localhost:3000, app.koda.com, koda.app
  if (isApp) {
    // Si accede a la raíz (/) o a /ruta en el subdominio, reescribir internamente a /app (Roadmap)
    // manteniendo la URL limpia en el navegador (app.koda.com/ o app.localhost:3000/)
    if (pathname === '/' || pathname === '/ruta') {
      const url = request.nextUrl.clone();
      url.pathname = '/app';
      const res = NextResponse.rewrite(url);
      res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
      return res;
    }

    // Reescribir rutas de perfil para que apunten a /app/perfil de forma limpia
    if (pathname === '/perfil' || pathname.startsWith('/perfil/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/app${pathname}`;
      const res = NextResponse.rewrite(url);
      res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
      return res;
    }

    // Las rutas /curso, /login, /register, /onboarding, /evaluaciones se sirven directamente
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, icon.svg, icon.png
     * - assets de imágenes y multimedia
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav|ogg)$).*)',
  ],
};
