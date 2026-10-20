# Changelog: 20-10-2026

- [Tuesday]-[20/10/2026]-[06:25]-[Dylan Gamero] : Implement bidirectional section alias resolution helper, calibrate defensive maxStars sanitization, and fix completed lesson star rendering across PixiJS canvas and drawer to accurately aggregate module total stars.
- [Tuesday]-[20/10/2026]-[07:10]-[Dylan Gamero] : Implement dynamic module maxStars calculation, strict course-scoped section aliasing, cache purge for legacy un-scoped star keys, and calibrate Python 1 (24 stars) and Python 2 (32 stars) datasets.
- [Tuesday]-[20/10/2026]-[07:17]-[Dylan Gamero] : Fix cross-track boss alias leakage that marked Reto Wrangling (Data Analytics) and other mini-bosses as completed from Python 1 Guardian de la Logica, and purge leaked keys from cache.
- [Tuesday]-[20/10/2026]-[08:20]-[Dylan Gamero] : Decouple Landing Page on root domain and interactive Roadmap learning platform on app subdomain using Next.js 16 proxy rewrites, with shared session cookie detection and cross-origin link support.
- [Tuesday]-[20/10/2026]-[10:40]-[Dylan Gamero] : Stabilize Turbopack runtime by purging stale 16.4.0 dev process, scoping security headers away from Next.js internal chunks, injecting revalidation Cache-Control on dynamic rewrites, and optimizing package imports.
- [Tuesday]-[20/10/2026]-[11:02]-[Dylan Gamero] : Fix login and roadmap routing on app subdomain by delegating root route client-side transitions to AppPage, repairing cross-origin links with getAppUrl, adding login button in navbar, removing invalid cookie domain, and permitting subdomain preflight in NestJS CORS.
- [Tuesday]-[20/10/2026]-[12:39]-[Dylan Gamero] : Transfer OAuth hash tokens from root domain to app subdomain login, provision session in app origin local storage, and sanitize marketing CTA links with getAppUrl.
- [Tuesday]-[20/10/2026]-[12:42]-[Dylan Gamero] : Remove guest login button (entrar sin cuenta) and associated store handlers from LoginForm.
