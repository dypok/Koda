/**
 * Utilidades de detección y generación de URLs para arquitectura multi-dominio/subdominio.
 * Separa la Landing Page (dominio raíz) de la Aplicación de Aprendizaje (subdominio app).
 */

export function isAppHost(host: string | null | undefined): boolean {
  if (!host) return false;
  
  // Limpiar puerto si viene incluido (ej. app.localhost:3000 -> app.localhost)
  const hostname = host.split(':')[0].toLowerCase();

  // Si existe variable de entorno explícita para el host de la app
  const envAppHost = process.env.NEXT_PUBLIC_APP_HOST;
  if (envAppHost && hostname === envAppHost.toLowerCase()) {
    return true;
  }

  // 1. Detección en desarrollo local
  if (hostname.startsWith('app.localhost') || hostname === 'app.localhost') {
    return true;
  }

  // 2. Subdominio estándar app.* (ej. app.koda.com, app.koda.academy)
  if (hostname.startsWith('app.')) {
    return true;
  }

  // 3. Dominio TLD .app (ej. koda.app)
  if (hostname.endsWith('.app') || hostname === 'koda.app') {
    return true;
  }

  return false;
}

/**
 * Obtiene la URL base del subdominio de la aplicación (Roadmap, Workspace, Perfil, etc.)
 */
export function getAppBaseUrl(currentHost?: string | null): string {
  // 1. Si se proporciona currentHost (ej. en el proxy o servidor)
  if (currentHost) {
    const [rawHost, port] = currentHost.split(':');
    const portSuffix = port ? `:${port}` : '';
    const cleanHost = rawHost.toLowerCase();

    if (cleanHost.startsWith('app.') || cleanHost.endsWith('.app') || cleanHost === 'app.localhost') {
      const proto = cleanHost.includes('localhost') ? 'http:' : 'https:';
      return `${proto}//${cleanHost}${portSuffix}`;
    }

    if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
      return `http://app.localhost${portSuffix}`;
    }

    return `https://app.${cleanHost}${portSuffix}`;
  }

  // 2. Si se ejecuta en el navegador (cliente)
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const portSuffix = port ? `:${port}` : '';

    if (hostname.startsWith('app.') || hostname.endsWith('.app') || hostname === 'app.localhost') {
      return `${protocol}//${hostname}${portSuffix}`;
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//app.localhost${portSuffix}`;
    }

    // Dominio en producción
    return `${protocol}//app.${hostname}${portSuffix}`;
  }

  // 3. Variable de entorno configurada para producción
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  // Fallback seguro por defecto
  return 'http://app.localhost:3000';
}

/**
 * Obtiene la URL base del dominio raíz (Landing Page, marketing)
 */
export function getRootBaseUrl(currentHost?: string | null): string {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const portSuffix = port ? `:${port}` : '';

    if (hostname.startsWith('app.localhost')) {
      return `${protocol}//localhost${portSuffix}`;
    }

    if (hostname.startsWith('app.')) {
      const rootHost = hostname.replace(/^app\./, '');
      return `${protocol}//${rootHost}${portSuffix}`;
    }

    return `${protocol}//${hostname}${portSuffix}`;
  }

  if (currentHost) {
    const [rawHost, port] = currentHost.split(':');
    const portSuffix = port ? `:${port}` : '';
    const cleanHost = rawHost.toLowerCase();

    if (cleanHost.startsWith('app.localhost')) {
      return `http://localhost${portSuffix}`;
    }

    if (cleanHost.startsWith('app.')) {
      const rootHost = cleanHost.replace(/^app\./, '');
      return `https://${rootHost}${portSuffix}`;
    }

    const proto = cleanHost.includes('localhost') ? 'http:' : 'https:';
    return `${proto}//${cleanHost}${portSuffix}`;
  }

  return 'http://localhost:3000';
}

/**
 * Construye una URL completa hacia una ruta dentro del subdominio de la app.
 */
export function getAppUrl(path: string, currentHost?: string | null): string {
  const base = getAppBaseUrl(currentHost);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/**
 * Guarda o borra la cookie centinela de sesión compartida entre el dominio principal y el subdominio.
 */
export function setSessionCookie(active: boolean): void {
  if (typeof document === 'undefined') return;

  if (!active) {
    document.cookie = 'koda_session=; path=/; max-age=0; SameSite=Lax';
    const hostname = window.location.hostname;
    if (hostname.includes('.')) {
      const parts = hostname.split('.');
      const rootDomain = parts.slice(-2).join('.');
      document.cookie = `koda_session=; path=/; max-age=0; domain=.${rootDomain}; SameSite=Lax`;
    }
    return;
  }

  // Cookie activa por 30 días
  const maxAge = 30 * 24 * 60 * 60;
  const hostname = window.location.hostname;

  // En producción, compartir con el dominio raíz (.koda.com o .koda.academy)
  if (hostname.includes('.') && !hostname.endsWith('localhost')) {
    const parts = hostname.split('.');
    const rootDomain = parts.slice(-2).join('.');
    document.cookie = `koda_session=1; path=/; max-age=${maxAge}; domain=.${rootDomain}; SameSite=Lax`;
  } else if (hostname.endsWith('localhost')) {
    document.cookie = `koda_session=1; path=/; max-age=${maxAge}; domain=.localhost; SameSite=Lax`;
    document.cookie = `koda_session=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `koda_session=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

/**
 * Determina si existe una sesión activa según la cookie de sesión.
 */
export function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((item) => item.trim().startsWith('koda_session=1'));
}

