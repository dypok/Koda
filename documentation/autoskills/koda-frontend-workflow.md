---
name: koda-frontend-workflow
description: >-
  Gobierna el flujo de trabajo de desarrollo frontend en Koda: nomenclatura de ramas
  feat/frontend-[nombre_hu], aislamiento estricto (prohibido tocar apps/api/ o bases de datos sin consenso en types),
  registro obligatorio de entregables en documentation/done/frontend/frontend-[number]-[nombre].md y actualizacion de checklists en EPIC-XX.md.
---

# 🦊 Koda Frontend Workflow Skill

> **Rol:** Frontend Developer / Frontend AI Assistant  
> **Alcance:** `apps/web/`, `packages/types/`, `content/`, `docs/02-requisitos-ux/`  
> **Prohibición Estricta:** **NUNCA modificar `apps/api/` ni migraciones de base de datos**

---

## 📋 Protocolo de Trabajo Obligatorio

Cada vez que vayas a implementar una Historia de Usuario (HU) o tarea de frontend, debes ejecutar estrictamente los siguientes pasos:

### 1. Nomenclatura de Rama
Crea y trabaja en una rama temática a partir de `develop` con el formato:
```bash
git checkout -b feat/frontend-[nombre_hu]
```
*Ejemplos:* `feat/frontend-auth-02-onboarding-wizard`, `feat/frontend-auth-03-perfil-view`, `feat/frontend-learn-01-roadmap-view`.

---

### 2. Archivo de Evidencias en `documentation/done/frontend/`
Antes o durante la implementación, crea el archivo de seguimiento y entregables:
$$\text{documentation/done/frontend/frontend-}[\text{number}]-[\text{nombre}]\text{.md}$$
*Ejemplo:* `documentation/done/frontend/frontend-01-onboarding-wizard.md`.

El archivo debe contener:
- **ID de HU y Épica:** Código y título.
- **Rama:** Nombre de la rama.
- **Rutas y Vistas (`apps/web/src/app/` o `src/views/`):** Páginas y vistas creadas/modificadas.
- **Componentes y Stores (`components/`, `stores/`):** Componentes UI, estados Zustand y hooks.
- **Consumo de API:** Queries GraphQL o llamadas REST tipadas con `@koda/types`.
- **Pruebas y Verificación:** `pnpm --filter web build`, `pnpm --filter web exec tsc --noEmit`.

---

### 3. Actualización de Backlog y Checklists de Épicas
Al completar la implementación:
1. Abre el archivo de la épica correspondiente en `documentation/UserHistories/EPIC-XX-*.md`.
2. Marca con `[x]` cada subtarea de frontend completada.
3. Si todos los criterios de la HU para frontend están listos, actualiza el estado de la HU.

---

### 4. Bitácora Diaria
Registra la entrada formal en:
`documentation/changelog/[DD]-[MM]-[YYYY]-changelog.md`
Formato: `-[Day]-[DD/MM/YYYY]-[HH:MM] - [Author] : [Description]`

---

### 5. Convención de Commits
Sigue Conventional Commits:
- `feat(landing): ...`
- `feat(onboarding): ...`
- `feat(perfil): ...`
- `fix(web): ...`
