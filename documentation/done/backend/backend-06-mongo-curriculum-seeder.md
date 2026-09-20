# Entregable Backend: Inicialización y Seed Idempotente del Currículo en MongoDB

- **ID Entregable:** DB-SEED-01 / CURRICULUM-01
- **Épica:** Épica 4 - Currículo, Grafo DAG y Motor de Aprendizaje
- **Rama:** `feat/backend-mongo-curriculum-seed`
- **Autor:** Dylan Gamero
- **Fecha:** 20/09/2026
- **Estado:** ✅ Backend Completado al 100% · ⚪ Frontend delimitado (lectura vía GraphQL / REST API)
- **Trazabilidad:** `ADR-007` (Árbol de Aprendizaje como Grafo Acíclico Dirigido DAG), `ADR-009` (Persistencia Híbrida Supabase + MongoDB), `ADR-015` (Flujo Backend Koda)

---

## 1. Resumen de la Implementación Backend

En estricto cumplimiento de la arquitectura de datos y gobernanza Koda:
1. **Aislamiento Estricto de Código:** **0 archivos modificados en `apps/web/`**. Los esquemas y persistencia del currículo se gestionan exclusivamente en backend (`apps/api`) y la infraestructura Docker.
2. **Persistencia Híbrida Políglota (ADR-009):** El currículo pedagógico, el grafo de habilidades DAG, las micro-lecciones y los bancos de preguntas residen en MongoDB mediante Mongoose (`TrackModel`, `CourseModel`, `ModuleModel`, `SectionModel`, `LessonModel`, `QuestionBankModel`, `VisualEffectModel`), manteniendo la base relacional de Supabase (PostgreSQL) reservada para identidad, autenticación, perfiles y transacciones gamificadas.
3. **Grafo Acíclico Dirigido (DAG - ADR-007):** Los cursos implementan topología de grafo con niveles (`tier`), carriles (`lane`), relaciones de dependencia (`prerequisites`) y efectos de borde visual con GPU (`visual_effect_id`).
4. **Tríada Evaluativa Estricta:** Cada micro-lección seeded incorpora de manera no negociable los 3 pilares evaluativos de Koda:
   - **Teoría Concisa:** Markdown pedagógico estructurado con snippets de código.
   - **Ítem 1 (interactive_console):** Reto en terminal interactiva con código inicial (`starter_code`), solución canónica (`solution`), snippets pre/post ejecución y casos de prueba automatizados (`test_cases` visibles y ocultos).
   - **Ítem 2 (quiz):** Pregunta conceptual de opción múltiple estrictamente validada a 4 opciones (`a`, `b`, `c`, `d`) con explicación y respuesta correcta.
   - **Ítem 3 (prediction / bug_hunt):** Desafío de predicción de salida de terminal o detección/corrección de bug con código defectuoso y pista.
5. **Idempotencia y Dockerización:** El script de seeding (`pnpm --filter api db:seed`) y el script de inicialización nativo para Docker (`docker/mongo-init/01-init-mongo.js`) ejecutan operaciones de `upsert` basadas en slug y claves únicas, garantizando que el entorno pueda reiniciarse sin duplicación de documentos.

---

## 2. Componentes Creados y Modificados

### A. Datos Canónicos del Currículo
- **`apps/api/src/database/seeds/python-curriculum.data.ts`:**
  - **4 Tracks:** `python` (Especialidad Python & Backend), `frontend` (Frontend Web Moderno), `backend` (Arquitectura de Servidores), `devops` (Infraestructura y Cloud).
  - **6 Cursos DAG:** `python-core`, `frontend-core`, `backend-core`, `devops-core`, `fastapi-async`, `django-enterprise` con posiciones en tier/lane y prerequisitos definidos.
  - **12 Módulos Python:** Desde Fundamentos (`py_mod_01`) hasta Testing y Calidad (`py_mod_12`).
  - **8 Secciones para Módulo 1:** Sintaxis, Variables y Tipos (`py-m01-s01` a `py-m01-s08`).
  - **6 Lecciones con Tríada Evaluativa:** Variables y Asignación Dinámica (`py-m01-s01-l01`, `py-m01-s01-l02`), Tipos de Datos Primitivos (`py-m01-s02-l01`, `py-m01-s02-l02`), Entrada y Salida Estándar (`py-m01-s03-l01`, `py-m01-s03-l02`).
  - **3 Bancos de Preguntas Estratificados:** Fácil (`py-m01-qb-easy`), Medio (`py-m01-qb-medium`), Difícil (`py-m01-qb-hard`).
  - **5 Efectos Visuales para el DAG:** `fx-neon-pulse`, `fx-electric-cyan`, `fx-matrix-rain`, `fx-gold-amber`, `fx-crimson-streak`.

### B. Orquestador de Seeding (Mongoose)
- **`apps/api/src/database/seed.ts`:**
  - Conexión dinámica a `DATABASE_MONGO_URL` o fallback a `mongodb://localhost:27017/koda`.
  - Operaciones `bulkWrite` y `updateOne` con `{ upsert: true }` para todas las 7 colecciones.
  - Reporte de estado en consola e invocable directamente mediante `pnpm --filter api db:seed`.

### C. Automatización Docker
- **`docker/mongo-init/01-init-mongo.js`:**
  - Script mongosh que se ejecuta automáticamente cuando el contenedor `koda-mongo` se inicializa por primera vez.
  - Crea índices únicos sobre campos `slug` e `id` en las 7 colecciones.
  - Inserta los documentos semilla del currículo de manera idempotente.
- **`docker-compose.yml`:**
  - Montaje de volumen de solo lectura en el servicio `mongo`:
    `- ./docker/mongo-init:/docker-entrypoint-initdb.d:ro`

---

## 3. Estado de Colecciones Pobladas (MongoDB)

Verificación realizada contra base de datos `koda` en el contenedor `koda-mongo`:

| Colección | Documentos | Estado |
|---|---|---|
| `tracks` | 4 | ✅ Activo |
| `courses` | 6 | ✅ Activo (Topología DAG validada) |
| `modules` | 12 | ✅ Activo (Python 3.12 completo) |
| `sections` | 8 | ✅ Activo (Módulo 1) |
| `lessons` | 6 | ✅ Activo (Tríada Evaluativa completa) |
| `question_banks` | 3 | ✅ Activo (Estratificación Easy/Med/Hard) |
| `visual_effects` | 5 | ✅ Activo (GPU Shaders / Canvas) |

---

## 4. Guía de Ejecución y Verificación

### Seeding vía NestJS / Mongoose:
```bash
pnpm --filter api db:seed
```

### Verificación directa en MongoDB con `mongosh`:
```bash
docker exec -it koda-mongo mongosh koda --eval "
  console.log('--- Resumen Colecciones Koda ---');
  ['tracks', 'courses', 'modules', 'sections', 'lessons', 'question_banks', 'visual_effects'].forEach(c => {
    console.log(c + ':', db[c].countDocuments());
  });
"
```

### Inicialización en entornos nuevos:
Al iniciar Docker Compose desde cero con un volumen limpio:
```bash
docker compose down -v
docker compose up -d
# mongo ejecuta automáticamente /docker-entrypoint-initdb.d/01-init-mongo.js
```
