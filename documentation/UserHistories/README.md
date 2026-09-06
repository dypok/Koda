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
3. [**EPIC 3 — Autenticación, Perfiles de Usuario y Onboarding**](EPIC-03-autenticacion-perfiles-onboarding.md) (`Sprint 2 · 4 Stories · 16 SP`)
4. [**EPIC 4 — Motor de Aprendizaje y Hoja de Ruta (Roadmap) Python 3.12**](EPIC-04-motor-aprendizaje-roadmap-python.md) (`Sprint 2 · 5 Stories · 21 SP`)
5. [**EPIC 5 — Workspace de Lección Atómica y Práctica Interactiva**](EPIC-05-workspace-leccion-practica-interactiva.md) (`Sprint 3 · 5 Stories · 20 SP`)
6. [**EPIC 6 — Sistema de Evaluación: Quizzes y Exámenes Finales**](EPIC-06-sistema-evaluacion-quizzes-examenes.md) (`Sprint 3 · 4 Stories · 15 SP`)
7. [**EPIC 7 — Cuaderno de Errores Persistente y Repaso Adaptativo**](EPIC-07-cuaderno-errores-repaso-adaptativo.md) (`Sprint 3 · 3 Stories · 13 SP`)
8. [**EPIC 8 — Gamificación, Economía XP, Rachas y Mascota Koda 🦊**](EPIC-08-gamificacion-rachas-mascota-koda.md) (`Sprint 4 · 4 Stories · 18 SP`)
9. [**EPIC 9 — Pipeline de Certificación, Generación PDF, QR y Google Drive**](EPIC-09-certificacion-pdf-qr-google-drive.md) (`Sprint 4 · 4 Stories · 18 SP`)
10. [**EPIC 10 — Monetización, Consola de Administración y Despliegue Cloud**](EPIC-10-monetizacion-admin-despliegue.md) (`Sprint 5 · 4 Stories · 16 SP`)

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

## 📊 Matriz Resumen del Backlog Koda

| Épica | Código | Sprint | Stories | SP Total | Estado | Archivo Detallado |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **Épica 1 — Documentación y Gobernanza** | `DOCS` | Sprint 0 | 5 | 18 | 🟢 Completada | [`EPIC-01-montado-documentacion-y-gobernanza.md`](EPIC-01-montado-documentacion-y-gobernanza.md) |
| **Épica 2 — Landing Page & Próximamente** | `LAND` | Sprint 1 | 7 | 22 | 🟡 Lista para Sprint | [`EPIC-02-landing-page-informativa-proximamente.md`](EPIC-02-landing-page-informativa-proximamente.md) |
| **Épica 3 — Autenticación y Perfiles** | `AUTH` | Sprint 2 | 4 | 16 | ⚪ Refinada | [`EPIC-03-autenticacion-perfiles-onboarding.md`](EPIC-03-autenticacion-perfiles-onboarding.md) |
| **Épica 4 — Motor de Aprendizaje & Roadmap** | `LEARN` | Sprint 2 | 5 | 21 | ⚪ Refinada | [`EPIC-04-motor-aprendizaje-roadmap-python.md`](EPIC-04-motor-aprendizaje-roadmap-python.md) |
| **Épica 5 — Workspace de Lección Atómica** | `LESS` | Sprint 3 | 5 | 20 | ⚪ Refinada | [`EPIC-05-workspace-leccion-practica-interactiva.md`](EPIC-05-workspace-leccion-practica-interactiva.md) |
| **Épica 6 — Sistema de Evaluación & Quizzes** | `EVAL` | Sprint 3 | 4 | 15 | ⚪ Refinada | [`EPIC-06-sistema-evaluacion-quizzes-examenes.md`](EPIC-06-sistema-evaluacion-quizzes-examenes.md) |
| **Épica 7 — Cuaderno de Errores & Repaso** | `NOTE` | Sprint 3 | 3 | 13 | ⚪ Refinada | [`EPIC-07-cuaderno-errores-repaso-adaptativo.md`](EPIC-07-cuaderno-errores-repaso-adaptativo.md) |
| **Épica 8 — Gamificación & Mascota Koda 🦊** | `GAMI` | Sprint 4 | 4 | 18 | ⚪ Refinada | [`EPIC-08-gamificacion-rachas-mascota-koda.md`](EPIC-08-gamificacion-rachas-mascota-koda.md) |
| **Épica 9 — Certificación, PDF & Drive Storage** | `CERT` | Sprint 4 | 4 | 18 | ⚪ Refinada | [`EPIC-09-certificacion-pdf-qr-google-drive.md`](EPIC-09-certificacion-pdf-qr-google-drive.md) |
| **Épica 10 — Monetización, Admin & Despliegue** | `MONA` | Sprint 5 | 4 | 16 | ⚪ Refinada | [`EPIC-10-monetizacion-admin-despliegue.md`](EPIC-10-monetizacion-admin-despliegue.md) |
| **TOTAL PLANIFICADO** | | | **45** | **177** | | |
