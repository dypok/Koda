# ADR-015: Gobernanza de Autoskills, Flujo de Ramas por Rol y Estructura de Entregables en documentation/done/

> **Estado:** Aprobado  
> **Fecha:** 2026-09-15  
> **Autores:** Daniel Echeverría & Equipo de Arquitectura Koda  
> **Trazabilidad:** `ADR-001`, `ADR-008`, `ADR-010`, `ADR-014`, `11_SYSTEM_ARCHITECTURE.md`, `RNF-019`  

---

## 1. Contexto y Problema

Para asegurar una ejecución ordenada y desacoplada entre los desarrolladores y agentes de IA asignados al proyecto Koda, era necesario formalizar:
1. Un estándar unificado de ramas por rol técnico (Frontend vs. Backend).
2. Un mecanismo de bitácoras y evidencias de tareas completadas antes de cerrar historias de usuario.
3. Manifiestos de habilidades automáticas (**Autoskills**) en la raíz del proyecto para que cualquier agente de IA o desarrollador pueda consumirlas e instalarlas de forma determinista.

---

## 2. Decisión Adoptada

1. **Directorio Raíz `autoskills/`:** Contiene los archivos `.md` de habilidades del proyecto (`koda-backend-workflow.md`, `koda-frontend-workflow.md`, `README.md`) y su espejo nativo en `.agents/skills/`.
2. **Nomenclatura Estricta de Ramas:**
   - Backend: `feat/backend-[nombre_hu]` (ej. `feat/backend-auth-01-supabase-auth`).
   - Frontend: `feat/frontend-[nombre_hu]` (ej. `feat/frontend-auth-02-onboarding-wizard`).
3. **Estructura de Entregables en `documentation/done/`:**
   - `documentation/done/backend/backend-[number]-[nombre].md`
   - `documentation/done/frontend/frontend-[number]-[nombre].md`
   - `documentation/done/other/other-[number]-[nombre].md` (DevOps, Database, Tooling, Infraestructura)
4. **Actualización de Backlog:** Cada historia finalizada debe marcar `[x]` en las subtareas de `documentation/UserHistories/EPIC-XX-*.md`.
5. **Aislamiento de Alcance:** El rol de backend tiene prohibido modificar `apps/web/`, y el de frontend `apps/api/` sin consenso previo en `@koda/types`.

---

## 3. Consecuencias

- **Positivas:** Cero solapamiento de código, trazabilidad 100% auditable por historia de usuario y portabilidad total de agentes IA entre colaboradores.
