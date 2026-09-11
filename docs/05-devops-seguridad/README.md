# 🛡️ Dominio 5 — Seguridad & DevOps

> **Modelo de amenazas STRIDE, estrategia de testing integral, operaciones de despliegue cloud y telemetría analítica de Koda 🦊.**

---

## 📑 Documentos del Dominio

| Documento | Título | Propósito Principal |
|---|---|---|
| [**19_SECURITY.md**](19_SECURITY.md) | Especificación de Seguridad | Modelo de amenazas STRIDE, sesiones JWT rotativas, sanitización OWASP, rate limiting y protección de datos sensibles. |
| [**20_TESTING.md**](20_TESTING.md) | Estrategia de Pruebas | Pirámide de pruebas (Unit, Integration, E2E), cobertura $\ge 70\%$, casos de prueba normativos TC-001 a TC-032. |
| [**21_DEPLOYMENT.md**](21_DEPLOYMENT.md) | Guía de Despliegue y Operaciones | Configuración Docker Compose, entornos dev/staging/prod, variables de entorno y estrategia de respaldos RPO/RTO. |
| [**26_ANALYTICS.md**](26_ANALYTICS.md) | Métricas y Analítica | Eventos origen, privacidad por diseño (sin fuga de PII), catálogo de métricas M-01 a M-16 y tableros operativos. |

---

## 🚀 Despliegue y Calidad Continua
Todos los cambios en el monorepo deben validar la suite de pruebas unitarias (`pnpm test`), tipado estricto (`pnpm typecheck`) y linting (`pnpm lint`) antes de integrarse a la rama principal.
