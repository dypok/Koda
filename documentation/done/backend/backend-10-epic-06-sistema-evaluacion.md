# 🦊 Entregable Fullstack: Sistema de Evaluación (Quizzes y Exámenes Finales)

> **ID de HU y Épica:** EPIC-06 (EVAL-01, EVAL-02, EVAL-03, EVAL-04)  
> **Título:** Motor de Quizzes Intermedios, Exámenes de Módulo y Repaso Formativo  
> **Rama:** `feat/backend-epic-04-learning-engine`  
> **Fecha:** 22/09/2026  
> **Estado:** Implementado, Probado y Verificado  

---

## 1. Resumen Ejecutivo y Alcance

En esta épica se desarrolló de manera integral el **Evaluation Engine** de Koda, que gobierna cómo los estudiantes son evaluados a la mitad y al final de cada módulo formativo. Se abarcó tanto la creación del servicio transaccional en el backend, la manipulación de base de datos para la auditoría, como las tres pantallas de la interfaz en Next.js.

1. **EVAL-01 & EVAL-02 (Motor de Quizzes y Exámenes Finales):**
   - **Backend:** Se construyó `EvaluationService` y `EvaluationController`. Este servicio carga dinámicamente el banco de preguntas calibradas (`bank.json`) desde el sistema de archivos de contenido, y aplica un algoritmo de muestreo aleatorio estratificado siguiendo la receta pedagógica (`compositions.json` — ej. 3 de opción múltiple, 2 verdaderos/falsos).
   - Se procesan los umbrales de forma estricta: los Quizzes exigen un $70\%$ de acierto y los Exámenes un $80\%$.
   - **Frontend:** Se desarrollaron `QuizPage` (con progreso dinámico) y `ExamPage` (que añade una cuenta regresiva de 30 minutos). 
2. **EVAL-03 (Revisión Detallada Formativa):**
   - Se añadió el endpoint `/api/v1/learning/attempts/:attemptId/summary` que enmascara las respuestas incorrectas del usuario y le devuelve el desglose de su examen para el aprendizaje del error.
   - En **Frontend** se elaboró `AttemptReviewScreen.tsx` que muestra una lista interactiva coloreada con filtros ("Aciertos", "Por Mejorar") y despliega el feedback explicativo (concepto clave) de Koda para justificar la respuesta correcta en caso de fallo.
3. **EVAL-04 (Auditoría de Contenido Inmutable):**
   - Se mutó el `schema.prisma` introduciendo los campos `content_version` y `attempt_type` en la tabla `attempts`.
   - El backend ahora intercepta el banco de preguntas utilizado y calcula un checksum SHA-256 en tiempo real. Este hash se inyecta en el registro del intento en Supabase para garantizar la inmutabilidad de la nota y la auditoría, de modo que si un autor en el futuro cambia el JSON de la pregunta, no invalida la nota previa.

---

## 2. Componentes Desarrollados por Capa Arquitectónica

### Backend (`apps/api/src/modules/evaluation/`)
- `evaluation.module.ts`: Contenedor del módulo inyectado al `AppModule`.
- `evaluation.controller.ts`: Orquestador de peticiones HTTP:
  - `GET /learning/modules/:id/quiz` y `/exam`
  - `POST /learning/quiz/:id/attempt` y `/exam/:id/attempt`
  - `GET /learning/attempts/:attemptId/summary`
- `evaluation.service.ts`: Lógica de negocio. Contiene métodos privados como `loadModuleBank` para parsear los archivos de la carpeta `content/` e indexarlos eficientemente. Y lógica de calificación y persistencia atómica.

### Persistencia y Base de Datos (`apps/api/prisma/`)
- `schema.prisma`: Alteración del modelo `Attempt` para incluir `contentVersion` y `attemptType`.

### Frontend (`apps/web/src/app/evaluaciones/`)
- `quiz/[id]/page.tsx`: Pantalla fluida que recorre el array de preguntas sin revelar al usuario la respuesta correcta.
- `examen/[id]/page.tsx`: Hereda la lógica del Quiz pero introduce el reloj temporizador (`setInterval` reactivo) y la lógica de envío automático al agotarse el tiempo.
- `resumen/[attemptId]/page.tsx`: Dashboard de revisión post-evaluación construido usando Tailwind CSS y la librería de iconos de Koda (`@phosphor-icons/react`).

---

## 3. Consideraciones Técnicas
- **Independencia del ecosistema:** El frontend se programó intencionalmente desacoplado de librerías extra no instaladas (como shadcn o react-hot-toast) para asegurar compilación pura utilizando `cookies` nativas de JavaScript y elementos del DOM nativo con Tailwind.
- **Transaccionalidad del error:** Si un usuario desaprueba un examen, o falla una pregunta particular, el motor lo inyecta automáticamente en `user_mistakes_notebook`, cerrando el ciclo con la Épica 7 (Spaced Repetition).
