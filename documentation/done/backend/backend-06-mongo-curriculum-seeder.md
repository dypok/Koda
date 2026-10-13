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

### A. Datos Canónicos Declarativos en `content/`
- **Archivos semilla eliminados por obsolescencia:** Se suprimieron `content/languages/python/roadmap-courses.seed.json` y `roadmap-lessons.seed.json` (que usaban coordenadas de píxeles fijas y carecían de la Tríada Evaluativa).
- **Archivos declarativos JSON desacoplados (P-01 / P-04):**
  - `content/tracks.json`: 4 Tracks (`python`, `frontend`, `backend`, `devops`).
  - `content/visual-effects.json`: 5 Efectos de aristas GPU (`laser_flow_fast`, `energy_beam_solid`, etc.).
  - `content/courses.json`: 6 Cursos DAG (`python-core`, `frontend-core`, `backend-core`, `devops-core`, `fastapi-async`, `django-enterprise`).
  - `content/courses/python-core/modules.json`: 12 Módulos canónicos de Python 3.12.
  - `content/courses/python-core/sections.json`: 8 Secciones del Módulo 01.
  - `content/courses/python-core/lessons.json`: 6 Micro-lecciones con Tríada Evaluativa completa (consola interactiva + test cases, quiz conceptual A/B/C/D y predicción).
  - `content/courses/python-core/question-banks.json`: 3 Bancos de preguntas (easy, medium, hard).

### B. Orquestador de Seeding Dinámico (Mongoose)
- **`apps/api/src/database/seed.ts`:**
  - Escaneo recursivo automático de todos los archivos `.json` en `content/` y subcarpetas (`content/courses/<curso>/*`).
  - Detección polimórfica y tipado por estructura o nombre de archivo (tracks, courses, modules, sections, lessons, question_banks, visual_effects).
  - Inserción idempotente con `upsert: true` a través de Mongoose.
  - Permite a creadores de contenido añadir nuevos cursos o lecciones simplemente creando carpetas o JSONs en `content/` sin modificar código TypeScript.
  - Fallback a seeds estáticos en memoria en caso de no detectarse el directorio `content/`.

### C. Automatización Docker
- **`docker/mongo-init/01-init-mongo.js`:**
  - Script mongosh ejecutado al inicializar el contenedor `koda-mongo`.
  - Crea índices únicos sobre campos clave en las 7 colecciones.
  - Escanea dinámicamente `/content` si está montado e inserta todos los JSONs de forma idempotente.
- **`docker-compose.yml`:**
  - Montajes de volúmenes de solo lectura:
    ```yaml
    volumes:
      - koda_mongo_data:/data/db
      - ./docker/mongo-init:/docker-entrypoint-initdb.d:ro
      - ./content:/content:ro
    ```

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
