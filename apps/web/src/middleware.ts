import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON_MODE !== 'false'; // Default to true if not explicitly false

  const pathname = request.nextUrl.pathname;

  // Protected paths that require the platform to be officially open
  const restrictedPaths = ['/app', '/dashboard', '/learn', '/admin', '/login', '/registro'];
  const isRestricted = restrictedPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isComingSoon && isRestricted) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('notice', 'coming-soon');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/:path*',
    '/dashboard/:path*',
    '/learn/:path*',
    '/admin/:path*',
    '/login',
    '/registro',
  ],
};
