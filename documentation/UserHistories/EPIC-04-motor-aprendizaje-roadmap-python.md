# 🔵 EPIC 4 — Motor de Aprendizaje, Grafo DAG Multi-Rama y Hoja de Ruta
`Sprint 2 · v2.0 · Color Jira: Azul · Código: LEARN`

> Esta épica materializa el **Learning Engine** de Koda (`docs/03-pedagogia-contenido/14_LEARNING_SYSTEM.md`, `ADR-007`, `ADR-008`, `ADR-009`): la visualización en Grafo Dirigido Acíclico (DAG) interactivo con Paneo y Zoom a 120 FPS, soporte multi-rama de especialización profesional (*Frontend, Backend, DevOps y Python*), compuertas maestras *Apex Master Gate*, candados estandarizados con badges compactas `RQ {requisito}`, sistema formativo de 1 a 3 estrellas (⭐) y persistencia híbrida políglota (MongoDB para currículo + Supabase PostgreSQL para progreso).

---

### LEARN-01 — Lienzo Interactivo de Grafo DAG con Paneo y Zoom (50%–200%) a 120 FPS
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead  
**Rama:** `feat/roadmap-pan-zoom-dag`  
**Trazabilidad:** `ADR-007`, `docs/02-requisitos-ux/27_UI_UX_SPECIFICATION.md`

**Historia de usuario:**
> "Como estudiante, quiero navegar por mi hoja de ruta como un grafo espacial interactivo con paneo fluido y zoom de 50% a 200%,
> para explorar rutas de carrera sin restricciones de layout vertical, visualizando mis conexiones activas y selladas a 120 FPS."

**Criterios de aceptación:**
- Lienzo infinito/delimitado con Paneo (arrastre por ratón/touch) y Zoom de 0.5x a 2.0x con clamping suave (`useRoadmapPanZoom.ts`).
- Aceleración por hardware `will-change: transform` ejecutándose 100% en el compositor de la GPU sin recálculos de layout en CPU.
- Discriminación estricta entre arrastre (drag) y clic para evitar aperturas accidentales de módulos al navegar.
- Controles flotantes en lienzo (`RoadmapCanvasControls.tsx`): Zoom In (+10%), Zoom Out (-10%), y botón de recentrado focal al 100% en el nodo activo.
- Flujos láser SVG direccionales animados de izquierda a derecha en GPU (`RoadmapSvgPaths.tsx`) para enlaces desbloqueados, y derivas standby punteadas para enlaces sellados.
- Fondo espacial con constelaciones estáticas y partículas cósmicas desfasadas a 120 FPS (`RoadmapAmbientStars.tsx`).

**Subtasks:**
- [x] [FRONTEND] Implementar hook `useRoadmapPanZoom.ts` con manejo de punteros, rueda del ratón y límites espaciales (ADR-007).
- [x] [FRONTEND] Integrar aceleración `transform` y discriminador de arrastre vs. clic en `RoadmapCanvas.tsx`.
- [x] [FRONTEND] Implementar controles de zoom y botón de recentrado focal en `RoadmapCanvasControls.tsx`.
- [x] [FRONTEND] Optimizar flujos láser SVG vectoriales orientados hacia adelante en `RoadmapSvgPaths.tsx`.
- [x] [FRONTEND] Modularizar canvas de estrellas ambientales y partículas a 120 FPS en `RoadmapAmbientStars.tsx`.

---

### LEARN-02 — Especialización Profesional Multi-Rama (Frontend, Backend, DevOps) y Apex Master Gate
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Fullstack Developer  
**Rama:** `feat/roadmap-career-branches`  
**Trazabilidad:** `ADR-007`, `ADR-009`, `docs/01-producto-negocio/04_SCOPE.md`

**Historia de usuario:**
> "Como estudiante, quiero elegir y alternar entre distintas rutas profesionales (Frontend, Backend, DevOps, Python),
> para orientar mi perfil técnico hacia especializaciones de mercado y aspirar a desbloquear el Apex Master Gate de cada rama."

**Criterios de aceptación:**
- Soporte para 4 ramas profesionales independientes con sus respectivos cursos y proyectos terminales:
  1. **Frontend Track:** HTML Semántico $\to$ CSS Moderno $\to$ JS DOM $\to$ React 19 $\to$ Tailwind $\to$ Apex Frontend Gate.
  2. **Backend Track:** Python Backend $\to$ SQL Relacional $\to$ APIs REST $\to$ FastAPI $\to$ Go Concurrente $\to$ Apex Backend Gate.
  3. **DevOps Track:** Linux & Shell $\to$ Git CI/CD $\to$ Docker Containerization $\to$ Kubernetes $\to$ Cloud & Terraform $\to$ Apex DevOps Gate.
  4. **Python Track (MVP Insignia):** 12 Módulos canónicos desde Fundamentos hasta Proyecto Integrador.
- Selector dinámico de carreras en el Asidebar (`RoadmapSidebarBranches.tsx`) conectado reactivamente a Zustand (`roadmap.store.ts`).
- Nodo terminal **Apex Master Gate**: diseño imponente con perímetro de advertencia y pulsación en contrafase, desbloqueable únicamente al completar el 100% de los cursos previos de la rama.
- Consulta de la estructura de cursos desde MongoDB (`ADR-009`) mediante endpoint `GET /api/v1/content/tracks/:trackSlug`.

**Subtasks:**
- [x] [FRONTEND] Crear datasets curriculares mock (`frontend-track.mock.ts`, `backend-track.mock.ts`, `devops-track.mock.ts`, `python-courses-graph.mock.ts`).
- [x] [FRONTEND] Implementar conmutador de ramas en `RoadmapSidebarBranches.tsx` y sincronizar con `roadmap.store.ts`.
- [x] [BACKEND] Modelo Mongoose `TrackSchema` y `CourseSchema` en NestJS `ContentModule` para servir el árbol DAG desde MongoDB.
- [x] [BACKEND] Endpoint `GET /api/v1/content/tracks/:slug` con resolución de dependencias DAG y adaptadores primarios GraphQL en `/graphql`.

---

### LEARN-03 — Desbloqueo Progresivo con Candados Estandarizados y Prerrequisitos Compactos `RQ {req}`
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Developer + Backend Developer  
**Rama:** `feat/roadmap-prerequisites-locks`  
**Trazabilidad:** `ADR-007`, `docs/03-pedagogia-contenido/14_LEARNING_SYSTEM.md`

**Historia de usuario:**
> "Como estudiante, quiero ver claramente qué nodo está bloqueado y cuál es su prerrequisito específico mediante una etiqueta compacta 'RQ',
> para entender exactamente qué curso debo aprobar para desbloquear nuevos contenidos sin ambigüedad."

**Criterios de aceptación:**
- Todos los nodos sellados muestran de forma uniforme el ícono de candado (`IconLock`) y la badge compacta `RQ {requisito}` (ej. `RQ HTML`, `RQ CSS`, `RQ JS DOM`, `RQ PYTHON`, `RQ SQL`, `RQ DOCKER`).
- Reglas canónicas invariantes (`RF-MOD-003`, `14` §4):
  - El nodo inicial de cada rama está desbloqueado por defecto (`status: 'current'`).
  - Un curso $C_k$ se desbloquea **únicamente si** todos sus prerrequisitos declarados en el grafo DAG tienen estado aprobado ($\ge 1$ estrella en todas las secciones o examen final aprobado $\ge 80\%$).
- Asidebar reactivo (`RoadmapSidebarGoal.tsx`): widget de "Siguiente Hito" conectado dinámicamente a la rama activa para exhibir el próximo curso bloqueado con su recompensa XP y badge `RQ`.
- Seguridad en backend: endpoint `GET /api/v1/content/courses/:id` valida en Supabase PostgreSQL el estado de prerrequisitos del usuario antes de autorizar acceso a lecciones.

**Subtasks:**
- [x] [FRONTEND] Estandarizar renderizado de candados y etiquetas `RQ {requisito}` en `RoadmapGraphNode.tsx`.
- [x] [FRONTEND] Conectar widget de Siguiente Hito en `RoadmapSidebarGoal.tsx` para reflejar el curso bloqueado real de la rama activa.
- [ ] [BACKEND] Guard de NestJS `PrerequisitesGuard` que verifique en Supabase PostgreSQL el cumplimiento de dependencias antes de servir lecciones.
- [ ] [TEST] Pruebas unitarias en Jest para validación de grafos DAG sin ciclos y evaluación de prerrequisitos múltiples.

---

### LEARN-04 — Sistema de Calificación de 1 a 3 Estrellas (⭐) por Sección
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Fullstack Developer  
**Rama:** `feature/sistema-estrellas-seccion`  
**Trazabilidad:** `16_GAMIFICATION.md`, `12_DATABASE_DESIGN.md`

**Historia de usuario:**
> "Como estudiante, quiero recibir de 1 a 3 estrellas según la precisión de mis respuestas en cada sección,
> para tener una métrica clara de excelencia y motivarme a rejugar secciones para alcanzar la perfección (3⭐)."

**Criterios de aceptación:**
- Asignación determinista de estrellas según porcentaje de aciertos en primera ronda (`16` §4):
  - ⭐⭐⭐ **(3 Estrellas):** 100% de ejercicios correctos al primer intento (perfección).
  - ⭐⭐ **(2 Estrellas):** 80% a 99% de aciertos.
  - ⭐ **(1 Estrella):** 70% a 79% de aciertos (mínimo para aprobar).
  - **0 Estrellas (< 70%):** Sección no aprobada; debe repetirse.
- Persistencia de la mejor marca histórica en Supabase PostgreSQL (`user_section_stars`): reintentar una sección nunca reduce las estrellas ganadas.
- Animación visual de concesión de estrellas al finalizar la sección con sonido y confeti si se logra 3⭐.

**Subtasks:**
- [ ] [BD] Tabla `user_section_stars (user_id, section_slug, stars_earned, best_score, attempts_count)` en Supabase PostgreSQL.
- [ ] [BACKEND] Algoritmo en `ProgressService` (NestJS) que calcule las estrellas y persista la marca histórica.
- [ ] [FRONTEND] Componente `StarRatingDisplay.tsx` con animación escalonada de estrellas doradas en resumen de lección.

---

### LEARN-05 — Persistencia Híbrida de Progreso (Supabase PostgreSQL + MongoDB)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead + Database Engineer  
**Rama:** `feature/persistencia-hibrida-poliglota`  
**Trazabilidad:** `ADR-008`, `ADR-009`, `docs/04-arquitectura-backend/12_DATABASE_DESIGN.md`

**Historia de usuario:**
> "Como arquitecto del sistema, quiero desacoplar el almacenamiento de currículo (MongoDB) del progreso transaccional de los estudiantes (Supabase PostgreSQL),
> para garantizar que las lecturas masivas de cursos no degraden las transacciones críticas de usuario, manteniendo tiempos p95 < 50 ms."

**Criterios de aceptación:**
- **Supabase (PostgreSQL 15+):** Custodia de `auth.users`, `user_profiles`, `user_module_progress`, `user_section_stars`, `xp_transactions`, `streaks` y `certificates`.
- **MongoDB:** Almacena colecciones `tracks`, `courses`, `modules`, `sections` y `lessons` con entrega documental en $O(1)$.
- Enlace lógico mediante identificadores inmutables en formato slug (`course_slug`, `section_slug`, `lesson_slug`) en PostgreSQL, sin acoplamiento de claves foráneas directas entre motores.
- Detección y prevención de duplicados en intentos mediante cabecera `Idempotency-Key` en endpoints de respuesta.

**Subtasks:**
- [ ] [BACKEND] Configurar `@nestjs/mongoose` en `apps/api` con schemas de Mongoose para `Track`, `Course`, `Module`, `Lesson`.
- [ ] [BACKEND] Integrar cliente de Supabase / TypeORM en `ProgressModule` para actualización transaccional de estrellas y XP.
- [ ] [BACKEND] Endpoint `GET /api/v1/learning/roadmap/progress` que fusiona la telemetría de Supabase con los nodos de MongoDB.
- [ ] [TEST] Test de rendimiento verificando latencia p95 < 40 ms en la entrega de la hoja de ruta combinada.
