# ADR-007: Arquitectura de Grafo DAG por Ramas de Carrera y Prerrequisitos

> **Estado:** Aprobado  
> **Fecha:** 2026-09-10  
> **Autores:** Equipo de Arquitectura Koda  
> **Impacto Backend:** `apps/api/src/modules/roadmap/`, Modelos Prisma/Postgres, DTOs y Endpoints  

---

## 1. Contexto y Problema
El diseño original contemplaba un roadmap lineal exclusivo de Python (ADR-005). La evolución del producto exige una estructura de formación profesional integral con 3 Carreras (**Frontend**, **Backend** y **DevOps**), donde cada rama se representa como un Grafo Acíclico Dirigido (DAG) interactivo con bifurcaciones, prerrequisitos estrictos ("RQ {req}"), hitos dinámicos y nodos finales Apex Gate. El backend debe proveer los modelos, validaciones y contratos para soportar esta experiencia.

## 2. Decisiones Técnicas Adoptadas

### A. Entidad de Ramas de Carrera (`career_branches`)
El backend debe exponer y persistir 3 ramas oficiales:
1. `frontend`: HTML Semántico $\rightarrow$ CSS Moderno $\rightarrow$ JS DOM $\rightarrow$ Forks (React, Tailwind) $\rightarrow$ Apex Gate.
2. `backend`: Python Core $\rightarrow$ SQL & Bases de Datos $\rightarrow$ APIs REST FastAPI $\rightarrow$ Forks (Go, Django) $\rightarrow$ Apex Gate.
3. `devops`: Linux & Shell $\rightarrow$ Git CI/CD $\rightarrow$ Docker $\rightarrow$ Forks (Kubernetes, Terraform) $\rightarrow$ Apex Gate.

### B. Modelo de Nodos del Grafo (`graph_nodes` & `graph_edges`)
Cada nodo en el canvas contiene metadatos de posicionamiento y estado que el backend debe calcular y serializar:
- `variant`: `'active' | 'locked' | 'unlocked' | 'completed' | 'branch' | 'boss' | 'bonus'`.
- `icon_type`: Enum estricto Tabler: `'brackets' | 'code' | 'flow' | 'matrix' | 'atom' | 'lock' | 'skull' | 'chest' | 'server' | 'database'`.
- Nodos bloqueados: Se identifican por `is_unlocked: false`, muestran `icon_type: 'lock'` y el texto de prerrequisito normalizado en formato `'RQ {REQUISITO}'` (ej. `'RQ HTML'`, `'RQ PYTHON'`).
- `graph_x` y `graph_y`: Coordenadas absolutas de renderizado dentro del viewport SVG (1150x620).

### C. Contratos de API Requeridos para Backend
El módulo `roadmap` en NestJS debe proveer los siguientes endpoints RESTful:
```
GET /api/v1/roadmap/branches               -> Listado de ramas con telemetría de usuario (estrellas, progreso %, cursos).
GET /api/v1/roadmap/branches/:branchId     -> Grafo completo de la rama: { nodes: GraphNode[], connections: GraphEdge[] }.
GET /api/v1/roadmap/courses/:id/lessons    -> Grafo DAG de lecciones del curso específico.
GET /api/v1/roadmap/telemetry/milestone    -> Próximo hito desbloqueable (código, título, XP, prerrequisito).
```

### D. Motor de Desbloqueo de Nodos (Evaluación de Dependencias)
Un nodo solo puede tener `is_unlocked: true` si todos los nodos predecesores (`from_id`) en `graph_edges` están en estado `completed` para el estudiante en `user_course_progress`.

## 3. Consecuencias
- **Positivas:**
  - Desacoplamiento total: Frontend y Backend comparten la especificación del grafo DAG.
  - Escalabilidad modular: Agregar un nuevo track (ej. Mobile o AI) solo requiere poblar la base de datos sin alterar el motor de renderizado.
  - Telemetría en tiempo real: El cálculo de progreso y de "Siguiente Hito" queda formalizado con contratos inmutables.
- **Compromisos (Trade-offs):**
  - Backend debe incluir tablas de aristas (`graph_edges`) o grafo adyacente para validar prerrequisitos en base de datos.
