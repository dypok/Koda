# 🔵 EPIC 4 — Motor de Aprendizaje, Grafo DAG Multi-Rama y Hoja de Ruta
`Sprint 2 · v2.1 · Color Jira: Azul · Código: LEARN`

> Esta épica materializa el **Learning Engine** de Koda (`docs/03-pedagogia-contenido/14_LEARNING_SYSTEM.md`, `ADR-007`, `ADR-008`, `ADR-009`, `ADR-010`, `ADR-011`): la visualización en Grafo Dirigido Acíclico (DAG) interactivo con Paneo y Zoom a 120 FPS, **Topología de Rejilla Relativa (Tier/Lane)** sin coordenadas absolutas estáticas, aristas con **Catálogo de Efectos Visuales GPU**, soporte multi-rama de especialización profesional (*Frontend, Backend, DevOps y Python*), compuertas maestras *Apex Master Gate*, candados estandarizados `RQ {requisito}`, sistema formativo de 1 a 3 estrellas (⭐) vinculado a la **Tríada Evaluativa** y persistencia híbrida políglota (MongoDB para currículo + Supabase PostgreSQL para progreso).

---

### LEARN-01 — Lienzo Interactivo de Grafo DAG con Topología Tier/Lane, Paneo/Zoom y Shaders GPU
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead  
**Rama:** `feat/roadmap-pan-zoom-dag`  
**Trazabilidad:** `ADR-007`, `ADR-010`, `docs/02-requisitos-ux/27_UI_UX_SPECIFICATION.md`

**Historia de usuario:**
> "Como estudiante, quiero navegar por mi hoja de ruta como un grafo espacial interactivo con paneo fluido, zoom de 50% a 200% y conexiones animadas en GPU basadas en niveles relativos (tier/lane),
> para explorar rutas de carrera sin restricciones de coordenadas rígidas, visualizando mis conexiones activas y selladas a 120 FPS."

**Criterios de aceptación:**
- **Topología de Rejilla Relativa (Tier/Lane):**
  - Cada curso se posiciona en una rejilla elástica mediante `tier` (profundidad secuencial: 0, 1, 2, ...) y `lane` (carril horizontal: -2, -1, 0, 1, 2), permitiendo crecimiento y ramas divergentes sin necesidad de fijar coordenadas `(x, y)` fijas en la base de datos.
- **Lienzo Interactivo con Paneo y Zoom:**
  - Paneo suave por arrastre y Zoom de 0.5x a 2.0x con clamping (`useRoadmapPanZoom.ts`).
  - Aceleración por hardware `will-change: transform` ejecutándose 100% en el compositor de la GPU sin recálculos de layout en CPU.
  - Discriminación estricta entre arrastre (drag) y clic para evitar aperturas accidentales de módulos al navegar.
  - Controles flotantes en lienzo (`RoadmapCanvasControls.tsx`): Zoom In (+10%), Zoom Out (-10%), y botón de recentrado focal al 100% en el nodo activo.
- **Aristas con Efectos Visuales GPU (`ADR-010`):**
  - Enlaces dirigidos (`edges`) con código de efecto visual renderizado (`visual_effect_code`):
    - `laser_flow_fast`: Flujo láser de alta energía para conexiones activas directas.
    - `energy_beam_solid`: Haz de plasma sólido brillante.
    - `dotted_amber_pulse`: Pulso ámbar discontinuo para prerrequisitos en progreso.
- Fondo espacial con constelaciones estáticas y partículas cósmicas desfasadas a 120 FPS (`RoadmapAmbientStars.tsx`).

**Subtasks:**
- [x] [FRONTEND] Implementar hook `useRoadmapPanZoom.ts` con manejo de punteros, rueda del ratón y límites espaciales (ADR-007).
- [x] [FRONTEND] Integrar aceleración `transform` y discriminador de arrastre vs. clic en `RoadmapCanvas.tsx`.
- [x] [FRONTEND] Implementar controles de zoom y botón de recentrado focal en `RoadmapCanvasControls.tsx`.
- [x] [FRONTEND] Optimizar renderizado de aristas con topología tier/lane y flujos vectoriales GPU en `RoadmapSvgPaths.tsx`.
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
  1. **Python Track (MVP Insignia):** Pista fundacional obligatoria tier 0 con 12 Módulos canónicos desde Fundamentos hasta Proyecto Integrador.
  2. **Frontend Track:** HTML Semántico $\to$ CSS Moderno $\to$ JS DOM $\to$ React 19 $\to$ Tailwind $\to$ Apex Frontend Gate.
  3. **Backend Track:** Python Backend $\to$ SQL Relacional $\to$ APIs REST $\to$ FastAPI $\to$ Go Concurrente $\to$ Apex Backend Gate.
  4. **DevOps Track:** Linux & Shell $\to$ Git CI/CD $\to$ Docker Containerization $\to$ Kubernetes $\to$ Cloud & Terraform $\to$ Apex DevOps Gate.
- Selector dinámico de carreras en el Asidebar (`RoadmapSidebarBranches.tsx`) conectado reactivamente a Zustand (`roadmap.store.ts`).
- Nodo terminal **Apex Master Gate**: diseño imponente con perímetro de advertencia y pulsación en contrafase, desbloqueable únicamente al completar el 100% de los cursos previos de la rama.
- Consulta de la estructura de cursos y grafo DAG desde MongoDB (`ADR-009`) mediante la consulta **GraphQL (`Query roadmapGraph(branch: CareerBranch!)`)** con entrega de nodos, edges y prerrequisitos en un solo viaje de red (`ADR-012`).

**Subtasks:**
- [x] [FRONTEND] Crear datasets curriculares mock (`frontend-track.mock.ts`, `backend-track.mock.ts`, `devops-track.mock.ts`, `python-courses-graph.mock.ts`).
- [x] [FRONTEND] Implementar conmutador de ramas en `RoadmapSidebarBranches.tsx` y sincronizar con `roadmap.store.ts`.
- [x] [FRONTEND] Diseñar nodo visual terminal `Apex Master Gate` con estilos de alta jerarquía y compuerta final.
- [x] [BACKEND] Modelos Mongoose `TrackSchema`, `CourseSchema` con topología `tier`/`lane` y `VisualEffectSchema` en `apps/api/src/database/schemas/`.
- [ ] [BACKEND] Definir puerto `ICourseRepository` en capa de dominio y adaptador `MongoCourseRepository` en infraestructura (`ADR-010`).
- [ ] [BACKEND] Resolver GraphQL `LearningResolver` con `Query roadmapGraph(branch)` y DataLoader para resolver dependencias DAG sin N+1 (`ADR-012`).
- [ ] [BACKEND] Endpoint REST `GET /api/v1/content/tracks/:slug` con resolución de dependencias DAG.

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
- Seguridad en backend: endpoint `GET /api/v1/content/courses/:id` valida en Supabase PostgreSQL (`user_module_progress`) el estado de prerrequisitos del usuario antes de autorizar acceso a lecciones.

**Subtasks:**
- [x] [FRONTEND] Estandarizar renderizado de candados y etiquetas `RQ {requisito}` en `RoadmapGraphNode.tsx`.
- [x] [FRONTEND] Conectar widget de Siguiente Hito en `RoadmapSidebarGoal.tsx` para reflejar el curso bloqueado real de la rama activa.
- [ ] [BACKEND] Guard de NestJS `PrerequisitesGuard` que verifique en Supabase PostgreSQL el cumplimiento de dependencias antes de servir lecciones.
- [ ] [TEST] Pruebas unitarias en Jest para validación de grafos DAG sin ciclos y evaluación de prerrequisitos múltiples.

---

### LEARN-04 — Sistema de Calificación de 1 a 3 Estrellas (⭐) Vinculado a la Tríada Evaluativa
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Fullstack Developer  
**Rama:** `feature/sistema-estrellas-seccion`  
**Trazabilidad:** `16_GAMIFICATION.md`, `12_DATABASE_DESIGN.md`, `ADR-011`

**Historia de usuario:**
> "Como estudiante, quiero recibir de 1 a 3 estrellas según mi desempeño en los 3 ítems de la lección (código en consola, quiz conceptual y predicción de salida),
> para tener una métrica formativa clara y motivarme a rejugar secciones hasta alcanzar la maestría (3⭐)."

**Criterios de aceptación:**
- Cada micro-lección evalúa la **Tríada Evaluativa** (`ADR-011`): Ítem 1 (Consola interactiva), Ítem 2 (Quiz de 4 opciones $A, B, C, D$) e Ítem 3 (Predicción de salida / Bug Hunt).
- La calificación en estrellas de la sección (1 a 3⭐) se calcula de forma estricta y transparente:
  - ⭐⭐⭐ **(3 Estrellas - Perfección):** El estudiante resuelve los 3 ítems correctamente al primer intento en todas las lecciones de la sección.
  - ⭐⭐ **(2 Estrellas - Sólido):** El estudiante ejecuta bien el código en consola (Ítem 1), pero falla en el quiz conceptual (Ítem 2) o la predicción (Ítem 3) y lo remedia en la ronda de repaso final.
  - ⭐ **(1 Estrella - Aprobado):** El estudiante supera la sección tras reintentos múltiples o requirió derivar reactivos al Cuaderno de Errores con algoritmo SM-2.
  - **0 Estrellas (< 70%):** Sección no superada; debe reintentarse.
- Persistencia de la mejor marca histórica en Supabase PostgreSQL (`user_section_stars`): reintentar una sección nunca reduce las estrellas ganadas.
- Trigger de base de datos en Supabase: acumula el progreso en `user_module_progress` y evalúa si el módulo alcanza la **Regla de Maestría ($\ge 80\%$ de estrellas totales)** para desbloquear el siguiente hito.

**Subtasks:**
- [x] [BD] Tabla `user_section_stars` en Supabase con campos `stars_earned`, `max_stars_earned`, `attempts_count`, RLS y trigger de recálculo de módulo.
- [ ] [BACKEND] Algoritmo en `ProgressService` (NestJS) que compute la tríada de aciertos y persista las estrellas obtenidas.
- [ ] [FRONTEND] Componente `StarRatingDisplay.tsx` con animación escalonada de estrellas doradas y feedback según ítems superados.

---

### LEARN-05 — Persistencia Híbrida Políglota y Topología de Rejilla (Tier/Lane)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead + Database Engineer  
**Rama:** `feature/persistencia-hibrida-poliglota`  
**Trazabilidad:** `ADR-008`, `ADR-009`, `ADR-010`, `ADR-011`, `ADR-012`, `12_DATABASE_DESIGN.md`

**Historia de usuario:**
> "Como arquitecto del sistema, quiero desacoplar el almacenamiento de currículo (MongoDB) del progreso transaccional de los estudiantes (Supabase PostgreSQL),
> para garantizar que las lecturas masivas de cursos no degraden las transacciones críticas de usuario, manteniendo tiempos p95 < 30 ms."

**Criterios de aceptación:**
- **Supabase (PostgreSQL 15+):** Custodia de cuentas (`public.users` enlazada a `auth.users`), progreso (`user_module_progress`, `user_section_stars`), economía (`xp_transactions`, `streaks`), cuaderno de errores (`user_mistakes_notebook`) y certificaciones (`certificates`).
- **MongoDB:** Almacena documentos jerárquicos BSON para `tracks`, `courses` (con topología de rejilla relativa `topology.tier`, `topology.lane` y `edges`), `modules`, `sections`, `lessons` (con la Tríada Evaluativa) y `visual_effects` con entrega $O(1)$ sin joins.
- Enlace lógico desacoplado mediante identificadores inmutables en formato slug (`track_slug`, `course_slug`, `module_slug`, `section_slug`) en PostgreSQL, eliminando claves foráneas entre motores disjuntos.
- Consulta unificada y eficiente mediante **GraphQL (`Query roadmapProgress`)** y soporte REST `GET /api/v1/learning/roadmap/progress` entregando el grafo enriquecido con telemetría de usuario en una sola llamada (`ADR-012`).
- Idempotencia estricta en intentos evaluativos mediante cabecera `Idempotency-Key`.

**Subtasks:**
- [x] [BACKEND] Configurar esquemas de Mongoose en `apps/api/src/database/schemas/` (`Track`, `Course`, `Module`, `Section`, `Lesson`, `VisualEffect`) y semillas de datos.
- [x] [BD] Migraciones DDL desplegadas en Supabase PostgreSQL con RLS y triggers de inmutabilidad y cálculo de racha.
- [ ] [BACKEND] Resolver GraphQL `LearningResolver` con `Query roadmapProgress` conectando puertos `ICourseRepository` e `IProgressRepository` (`ADR-010`, `ADR-012`).
- [ ] [BACKEND] Endpoint REST `GET /api/v1/learning/roadmap/progress` que fusiona la telemetría de Supabase con los nodos de MongoDB.
- [ ] [TEST] Test de rendimiento verificando latencia p95 < 30 ms en la entrega de la hoja de ruta combinada.
