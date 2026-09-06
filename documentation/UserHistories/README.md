# KODA 🦊 — Backlog Jira-Ready de Historias de Usuario

> **Sistema Integral de Gestión Ágil para Koda (Plataforma Educativa Gamificada de Programación)**  
> Estructura oficial de Épicas, Definition of Done (DoD) global, historias de usuario refinadas y subtasks desglosadas por capa técnica.  
> 
> - **Sprint 0** → Épica 1 (Montado de Documentación y Gobernanza Técnica)  
> - **Sprint 1** → Épica 2 (Landing Page Informativa & Modo Próximamente para Despliegue)  
> - **Sprint 2+** → Épicas 3–10 (Monorepo, Auth, Motor Educativo, Gamificación, Certificación, etc.)

---

## 📑 Índice de Épicas Detalladas

Cada épica cuenta con su propio archivo independiente para lectura ergonómica y carga directa en Jira/Linear:

1. [**EPIC 1 — Montado de Documentación, Arquitectura y Gobernanza Técnica**](EPIC-01-montado-documentacion-y-gobernanza.md) (`Sprint 0 · 5 Stories · 18 SP`)
2. [**EPIC 2 — Landing Page Informativa y Modo Próximamente para Despliegue**](EPIC-02-landing-page-informativa-proximamente.md) (`Sprint 1 · 7 Stories · 22 SP`)

---

## ✅ DEFINITION OF DONE (DoD) — Aplica a TODAS las historias de usuario

Antes de mover cualquier Story a **"Done"** en el tablero de Jira, se deben cumplir **TODOS** estos puntos sin excepción:

- [ ] El código está alojado en una rama temática propia (`feat/`, `fix/`, `docs/`, `chore/`) creada a partir de `develop` (o rama base activa).
- [ ] Se abrió y aprobó un Pull Request hacia la rama base con al menos 1 revisión técnica formal.
- [ ] Los commits siguen estrictamente el formato Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- [ ] Los criterios de aceptación de la US están cumplidos al 100% y verificados manualmente por el desarrollador y/o QA.
- [ ] La suite de tipos compila sin errores (`pnpm --filter "@koda/types" build` exitoso).
- [ ] No hay advertencias críticas ni errores en la consola del navegador (`F12`) ni en los logs del servidor NestJS (`apps/api`).
- [ ] El backend compila con `nest build` y todos los endpoints nuevos están tipados y documentados en Swagger (`/api/docs`).
- [ ] El frontend compila con `next build` generando las páginas estáticas o dinámicas sin fallas de hidratación.
- [ ] Los componentes visuales respetan la paleta oficial (Dark Navy `#0B0F19`, Slate, Violeta, Acento Dorado/Naranja Koda 🦊) y son responsivos (Mobile, Tablet, Desktop).
- [ ] Las variables de entorno sensibles están documentadas en `.env.example` y los archivos `.env` reales **nunca** se suben a Git.
- [ ] La Story fue actualizada con sus evidencias y movida a "Done" en el tablero de gestión (Jira/Linear).
- [ ] El integrante responsable puede explicar detalladamente la arquitectura, código y pruebas de lo implementado.

---

## 📊 Matriz Resumen del Backlog

| Épica | Código | Sprint | Stories | SP Total | Estado | Archivo Detallado |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **Épica 1 — Documentación y Gobernanza** | `DOCS` | Sprint 0 | 5 | 18 | 🟢 Completada | [`EPIC-01-montado-documentacion-y-gobernanza.md`](EPIC-01-montado-documentacion-y-gobernanza.md) |
| **Épica 2 — Landing Page & Próximamente** | `LAND` | Sprint 1 | 7 | 22 | 🟡 Lista para Sprint | [`EPIC-02-landing-page-informativa-proximamente.md`](EPIC-02-landing-page-informativa-proximamente.md) |
| **Épica 3 — Autenticación y Perfiles** | `AUTH` | Sprint 2 | 4 | 14 | ⚪ Backlog | *En refinamiento* |
| **Épica 4 — Motor Educativo y Roadmap** | `LEARN` | Sprint 2 | 6 | 21 | ⚪ Backlog | *En refinamiento* |
| **Épica 5 — Cuaderno de Errores & Repaso** | `NOTE` | Sprint 3 | 3 | 9 | ⚪ Backlog | *En refinamiento* |
| **Épica 6 — Gamificación & Mascota Koda** | `GAMI` | Sprint 3 | 5 | 15 | ⚪ Backlog | *En refinamiento* |
| **Épica 7 — Motor de Certificados y QR** | `CERT` | Sprint 4 | 4 | 12 | ⚪ Backlog | *En refinamiento* |
| **Épica 8 — Despliegue Cloud y CI/CD** | `DEPL` | Sprint 4 | 4 | 11 | ⚪ Backlog | *En refinamiento* |
| **TOTAL INICIAL (Épicas 1 y 2)** | | | **12** | **40** | | |
