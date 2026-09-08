# 🟡 EPIC 1 — Montado de Documentación, Arquitectura y Gobernanza Técnica
`Sprint 0 · v1.0 · Color Jira: Amarillo · Código: DOCS`

> Esta épica formaliza todo el trabajo fundacional de especificación técnica, pedagógica y arquitectónica del proyecto Koda 🦊, asegurando que la plataforma cuente con una única fuente de verdad documental antes y durante la fase de desarrollo del software.

---

### DOCS-01 — Especificar visión de producto, alcance y requisitos del MVP
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Dylan (Lead Arquitectura) + Equipo Koda  
**Rama sugerida:** `docs/especificacion-producto-mvp`

**Historia de usuario:**
> "Como arquitecto y diseñador instruccional de Koda, quiero formalizar la visión del producto, el alcance del MVP y los requisitos funcionales,
> para que el equipo de desarrollo construya la plataforma bajo una pedagogía atómica rigurosa y sin ambigüedades técnicas."

**Criterios de aceptación:**
- Documentos `01_PROJECT_OVERVIEW.md`, `02_PROBLEM_STATEMENT.md`, `03_OBJECTIVES.md`, `04_SCOPE.md` y `05_FUNCTIONAL_REQUIREMENTS.md` redactados y aprobados.
- Se define la pedagogía de micro-lecciones: unidades de 40 a 70 palabras en segunda persona ("tú"), máximo 3 pasos lógicos y 1 concepto por lección.
- Alcance del MVP acotado estrictamente a **Python 3.12** como único lenguaje troncal con 12 módulos canónicos (`01` §34).
- Matriz de 128 Requisitos Funcionales (`RF-*`) numerados y categorizados (Auth, Learning, Evaluation, Gamification, Certification).
- Modelo educativo formalizado en `14_LEARNING_SYSTEM.md` con 4 máquinas de estados Mermaid y algoritmo de repaso espaciado.

**Subtasks:**
- [ ] [DOCS] Redactar `01_PROJECT_OVERVIEW.md` con las 38 secciones maestras (propósito, filosofía, economía XP, certificaciones y visión).
- [ ] [DOCS] Documentar el planteamiento del problema en `02_PROBLEM_STATEMENT.md` (frustración, muros de texto y abandono temprano).
- [ ] [DOCS] Definir los Objetivos Estratégicos (OE), Técnicos (OT) y de Experiencia (OUX) en `03_OBJECTIVES.md`.
- [ ] [DOCS] Delimitar el alcance estricto del MVP en `04_SCOPE.md`: qué entra (Python 3.12, 12 módulos, certificados) y qué queda post-MVP (multilenguaje adicional, sandboxes pesados).
- [ ] [DOCS] Redactar la matriz completa de 128 requisitos funcionales en `05_FUNCTIONAL_REQUIREMENTS.md` con trazabilidad a casos de uso (`UC-*`).
- [ ] [DOCS] Elaborar las 4 máquinas de estado Mermaid en `14_LEARNING_SYSTEM.md` (Módulo, Sección, Sesión y Diagnóstico) y la fórmula del Score de Repaso.

**DoD adicional para esta US:**
- Todos los documentos no presentan enlaces rotos ni placeholders pendientes y están versionados en `v2.0.0`.

---

### DOCS-02 — Diseñar la arquitectura técnica, modelo de datos Supabase y contratos API
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Dylan (Lead Backend)  
**Rama sugerida:** `docs/arquitectura-datos-api`

**Historia de usuario:**
> "Como desarrollador backend y frontend, quiero contar con el diseño del sistema modular, el modelo entidad-relación y los contratos OpenAPI,
> para que la integración cliente-servidor se ejecute con tipado estricto extremo a extremo (End-to-End Type Safety)."

**Criterios de aceptación:**
- `11_SYSTEM_ARCHITECTURE.md` detalla la arquitectura en 4 capas y 9 motores desacoplados (`RNF-006`).
- `12_DATABASE_DESIGN.md` define las 18 tablas PostgreSQL 15+ para Supabase con DDL de referencia, índices para p95 < 100 ms y doble capa de persistencia (inmutable vs. agregada).
- `13_API_SPECIFICATION.md` documenta los 44 endpoints REST v2.0 bajo el prefijo `/api/v1` con esquemas JSON, códigos de error y cabeceras de correlación.
- Paquete compartido `@koda/types` implementado en monorepo con contratos TypeScript compilados a `dist/`.

**Subtasks:**
- [ ] [DOCS] Redactar `11_SYSTEM_ARCHITECTURE.md` con diagramas Mermaid de los 9 motores (Learning, Evaluation, Gamification, Certification, etc.).
- [ ] [DOCS] Diseñar el modelo ER en `12_DATABASE_DESIGN.md` con soporte para estrellas (1–3⭐), candados secuenciales, cuaderno de errores y triggers de integridad.
- [ ] [DOCS] Escribir la especificación completa OpenAPI 3.0.3 en `13_API_SPECIFICATION.md` con DTOs de Request/Response y códigos de error por dominio.
- [ ] [BACKEND] Configurar NestJS con prefijo `/api/v1` y documentación viva Swagger en `/api/docs`.
- [ ] [TYPES] Crear paquete `packages/types` con las interfaces maestras (`User`, `RoadmapResponse`, `LessonDetail`, `UserStreak`, `Certificate`).
- [ ] [TYPES] Compilar `@koda/types` exitosamente con TypeScript `tsc`.

**DoD adicional para esta US:**
- Swagger operativo en `http://localhost:4000/api/docs` y `@koda/types` consumible mediante `workspace:*` en `apps/api` y `apps/web`.

---

### DOCS-03 — Establecer el sistema de ADRs y Hub Central de Documentación
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Dylan  
**Rama sugerida:** `docs/adr-hub-central`

**Historia de usuario:**
> "Como equipo técnico, queremos tener un sistema formal de Registro de Decisiones de Arquitectura (ADR) y un Hub central navegable,
> para registrar el porqué de cada decisión tecnológica y facilitar la incorporación inmediata de nuevos desarrolladores."

**Criterios de aceptación:**
- Directorio `docs/adr/` configurado con plantilla oficial y ciclo de vida de ADRs formalizado (`RNF-019`).
- Symlinks de compatibilidad `09-decisions/` $\rightarrow$ `docs/adr` operativos.
- Los 6 ADRs fundacionales redactados, justificados y aprobados.
- `docs/README.md` creado como hub interactivo clasificado en 5 dominios y rutas de lectura sugeridas por rol.

**Subtasks:**
- [ ] [DOCS] Crear `docs/adr/README.md` con guía de ciclo de vida (Propuesto $\rightarrow$ Aprobado $\rightarrow$ Reemplazado / Rechazado).
- [ ] [DOCS] Redactar `ADR-001`: Monorepo con PNPM Workspaces (`apps/web`, `apps/api`, `packages/types`).
- [ ] [DOCS] Redactar `ADR-002`: Persistencia Relacional con Supabase (PostgreSQL 15+).
- [ ] [DOCS] Redactar `ADR-003`: Emisión de Certificados en Backend y Almacenamiento en Google Drive API v3.
- [ ] [DOCS] Redactar `ADR-004`: Renderizado WebGL de Mascota Koda 🦊 y Confeti con PixiJS v7.
- [ ] [DOCS] Redactar `ADR-005`: Adopción de Python 3.12 como Lenguaje Oficial de Lanzamiento del MVP.
- [ ] [DOCS] Redactar `ADR-006`: Motor de Ejecución de Código Híbrido (`ICodeRunner`).
- [ ] [DEVOPS] Crear symlinks `09-decisions` y `docs/09-decisions` apuntando a `docs/adr/`.
- [ ] [DOCS] Crear `docs/README.md` con mapa conceptual Mermaid, catálogo maestro de 27 documentos y rutas por rol.

**DoD adicional para esta US:**
- Todas las 33 referencias rotas de archivos (`12_DATA_MODEL`, `13_API_SPEC`, `27_UI_DESIGN`, `24_QUESTION_SYSTEM`) subsanadas en el 100% de la documentación.

---

### DOCS-04 — Estructurar el currículo pedagógico declarativo de Python 3.12
**Tipo:** Story | **SP:** 3 | **Prioridad:** Muy Alta | **Asignado:** Dylan + Diseñador Instruccional  
**Rama sugerida:** `content/curriculo-declarativo-python`

**Historia de usuario:**
> "Como autor pedagógico de Koda, quiero contar con la especificación de autoría y los archivos JSON del currículo de Python 3.12 desacoplados del código,
> para permitir la creación y publicación de cursos sin requerir despliegues ni tocar el motor del backend (`RNF-006`)."

**Criterios de aceptación:**
- `23_CONTENT_SPECIFICATION.md` y `24_CONTENT_AUTHORING_GUIDE.md` definen los estándares de esquemas y estilo editorial.
- Directorio `content/languages/python/` configurado con `manifest.json`, `config/` y módulos.
- Manifiesto registra los 12 módulos canónicos de Python en estado publicado/roadmap.
- Módulo 01 (*Fundamentos de Python*) estructurado con lecciones atómicas, ejemplos de código, pistas formativas y banco de preguntas calibradas.
- Cero archivos o referencias residuales a lenguajes previos en `content/`.

**Subtasks:**
- [ ] [DOCS] Formalizar las directrices pedagógicas en `24_CONTENT_AUTHORING_GUIDE.md` (micro-lecciones de 40-70 palabras, sin spoilers, feedback inteligente).
- [ ] [DOCS] Formalizar los esquemas JSON y validaciones en `23_CONTENT_SPECIFICATION.md`.
- [ ] [CONTENT] Crear `content/languages/python/manifest.json` con los 12 módulos canónicos de Python 3.12.
- [ ] [CONTENT] Crear archivos de configuración en `content/languages/python/config/`: `thresholds.json` (Quiz 70%, Examen 80%), `xp.json` y `compositions.json`.
- [ ] [CONTENT] Implementar `content/languages/python/modules/01_fundamentos/module.json` con lecciones atómicas de print(), cadenas, números y comentarios.
- [ ] [CONTENT] Crear banco de preguntas en `content/languages/python/modules/01_fundamentos/bank.json`.
- [ ] [DOCS] Crear `content/README.md` documentando la jerarquía de contenidos y validaciones.

**DoD adicional para esta US:**
- JSONs sintácticamente válidos y verificados con el schema declarativo.

---

### DOCS-05 — Especificar gamificación, pipeline de certificados, seguridad y UI/UX
**Tipo:** Story | **SP:** 2 | **Prioridad:** Alta | **Asignado:** Dylan  
**Rama sugerida:** `docs/gamificacion-certificados-ui`

**Historia de usuario:**
> "Como equipo técnico y de diseño, queremos tener especificadas las reglas de gamificación, seguridad, certificación y la experiencia de usuario,
> para que las mecánicas lúdicas, la privacidad y la interfaz de usuario respondan a estándares profesionales de la industria."

**Criterios de aceptación:**
- `16_GAMIFICATION.md` formaliza la economía XP, progresión por nivel exponencial `XP(N)=floor(100×N^1.65+20×N)`, rachas diarias y logros.
- `17_CERTIFICATION.md` documenta la generación atómica en backend (Node.js), QR ISO 18004 y persistencia en Google Drive API v3.
- `19_SECURITY.md` define el modelo de amenazas STRIDE, JWT rotativo HttpOnly, rate limiting y cifrado de datos personales.
- `27_UI_UX_SPECIFICATION.md` especifica el layout Desktop 50/50 split, stepper de 10 píldoras, atajos ergonómicos de teclado y estados emocionales de PixiJS Koda 🦊.

**Subtasks:**
- [ ] [DOCS] Redactar `16_GAMIFICATION.md` con economía de 10 acciones XP, sistema de estrellas 1–3⭐ y reglas anti-gaming.
- [ ] [DOCS] Redactar `17_CERTIFICATION.md` con pipeline backend, identificador `KODA-PY-{SEQ}`, verificación pública y Google Drive Storage.
- [ ] [DOCS] Redactar `19_SECURITY.md` con matriz STRIDE, 20 controles de seguridad y almacenamiento anonimizado de datos personales.
- [ ] [DOCS] Redactar `27_UI_UX_SPECIFICATION.md` con el diseño split-screen 50/50, sistema de atajos de teclado (`1-4`, `A-D`, `Enter`, flechas) y animaciones WebGL de Koda.
- [ ] [DOCS] Actualizar `21_DEPLOYMENT.md` y `22_ROADMAP.md` sincronizándolos con el stack y las fases vigentes.

**DoD adicional para esta US:**
- Todos los documentos enlazan directamente a los ADRs oficiales correspondientes.
