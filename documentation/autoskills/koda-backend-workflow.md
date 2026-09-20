---
name: koda-backend-workflow
description: >-
  Gobierna el flujo de trabajo de desarrollo backend en Koda: nomenclatura de ramas
  feat/backend-[nombre_hu], aislamiento estricto (prohibido tocar apps/web/), registro obligatorio
  de entregables en documentation/done/backend/backend-[number]-[nombre].md y actualizacion de checklists en EPIC-XX.md.
---

# 🦊 Koda Backend Workflow Skill

> **Rol:** Backend Engineer / Backend AI Assistant  
> **Alcance:** `apps/api/`, `packages/types/`, `supabase/`, `docs/`, `docker-compose.yml`  
> **Prohibición Estricta:** **NUNCA modificar `apps/web/`**

---

## 📋 Protocolo de Trabajo Obligatorio

Cada vez que vayas a implementar una Historia de Usuario (HU) o tarea de backend, debes ejecutar estrictamente los siguientes pasos:

### 1. Nomenclatura de Rama
Crea y trabaja en una rama temática a partir de `develop` con el formato:
```bash
git checkout -b feat/backend-[nombre_hu]
```
*Ejemplos:* `feat/backend-auth-01-supabase-auth`, `feat/backend-auth-03-perfil-usuario`, `feat/backend-learn-01-roadmap-graph`.

---

### 2. Archivo de Evidencias en `documentation/done/backend/`
Antes o durante la implementación, crea el archivo de seguimiento y entregables:
$$\text{documentation/done/backend/backend-}[\text{number}]-[\text{nombre}]\text{.md}$$
*Ejemplo:* `documentation/done/backend/backend-01-auth-supabase-setup.md`.

El archivo debe contener:
- **ID de HU y Épica:** Código y título.
- **Rama:** Nombre de la rama.
- **Resumen Arquitectónico:** Capas hexagonales tocadas (`domain/`, `application/`, `infra/`, `presentation/`).
- **Contratos y Endpoints:** Rutas REST, Resolvers GraphQL, DTOs compartidos.
- **Modelos de Persistencia:** Tablas Prisma / Supabase o esquemas Mongo.
- **Pruebas y Verificación:** Comandos ejecutados y resultados (build, lint, tests).

---

### 3. Actualización de Backlog y Checklists de Épicas
Al completar la implementación:
1. Abre el archivo de la épica correspondiente en `documentation/UserHistories/EPIC-XX-*.md`.
2. Marca con `[x]` cada subtarea de backend completada.
3. Si todos los criterios de la HU para backend están listos, actualiza el estado de la HU.

---

### 4. Bitácora Diaria
Registra la entrada formal en:
`documentation/changelog/[DD]-[MM]-[YYYY]-changelog.md`
Formato: `-[Day]-[DD/MM/YYYY]-[HH:MM] - [Author] : [Description]`

---

### 5. Convención de Commits
Sigue Conventional Commits:
- `feat(auth): ...`
- `feat(prisma): ...`
- `fix(api): ...`
- `refactor(domain): ...`
