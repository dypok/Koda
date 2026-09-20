# 🤖 Koda Monorepo — Catálogo de Autoskills para Agentes de IA y Desarrolladores

> Este directorio contiene los manifiestos oficiales de **Autoskills** diseñados para gobernar el flujo de trabajo de asistentes de IA (Google Antigravity, Cursor, Windsurf, Claude Code, GitHub Copilot) y desarrolladores humanos en el monorepo de Koda.

---

## 📋 Habilidades Disponibles

| Autoskill | Archivo | Rol Destino | Convención de Rama | Carpeta de Entregables |
|---|---|---|---|---|
| **Koda Backend Workflow** | [`koda-backend-workflow.md`](koda-backend-workflow.md) | Backend Engineer | `feat/backend-[nombre_hu]` | `documentation/done/backend/` |
| **Koda Frontend Workflow** | [`koda-frontend-workflow.md`](koda-frontend-workflow.md) | Frontend Developer | `feat/frontend-[nombre_hu]` | `documentation/done/frontend/` |

---

## ⚙️ Cómo Instalar / Activar en tu Entorno de IA

### 1. Google Antigravity (Recomendado)
Antigravity detecta e indexa automáticamente estas habilidades desde `.agents/skills/` en la raíz del proyecto. No requiere configuración manual.

### 2. Otros Asistentes (Cursor / Claude / Copilot)
Para configurar tu agente, indícale al iniciar tu sesión:
> *"Por favor lee e instala las reglas del archivo `autoskills/koda-backend-workflow.md` (o `koda-frontend-workflow.md`) para operar en este repositorio."*

---

## 🏛️ Reglas de Oro Transversales

1. **Aislamiento de Rol:** El desarrollador/agente de backend **NO** modifica `apps/web/`. El de frontend **NO** modifica `apps/api/` ni bases de datos sin acordar contratos en `packages/types/`.
2. **Evidencias Obligatorias:** Ninguna historia de usuario se considera terminada sin su documento en `documentation/done/[rol]/[rol]-[number]-[nombre].md`.
3. **Actualización de Backlog:** Marcar `[x]` en `documentation/UserHistories/EPIC-XX-*.md`.
4. **Registro en Changelog:** Anotar cada cambio en `documentation/changelog/[DD]-[MM]-[YYYY]-changelog.md`.
