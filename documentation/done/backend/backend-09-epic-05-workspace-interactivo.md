# 🦊 Entregable Backend: Workspace de Lección Práctica e Interactiva

> **ID de HU y Épica:** EPIC-05 (LESS-03, LESS-04, LESS-06)  
> **Título:** Interfaz de Lecciones, Ejecución de Código en Sandbox, Evaluación In-situ y Repaso de Errores  
> **Rama:** `feat/backend-epic-04-learning-engine`  
> **Fecha:** 22/09/2026  
> **Estado:** Implementado, Probado y Verificado  

---

## 1. Resumen Ejecutivo y Alcance Backend

En esta épica se implementó la lógica transaccional y la infraestructura necesaria para soportar las lecciones interactivas del Workspace de Koda. Esto abarca desde el consumo de lecciones, la evaluación de respuestas, la conexión interactiva del botón "Siguiente" y la ejecución segura de código del estudiante en contenedores Docker aislados.

1. **LESS-03 (Evaluación In-situ y envío al cuaderno de errores):**
   - Refactorización de `LearningService.evaluateAnswer` para no solo evaluar en memoria, sino para registrar el intento (`attempts`) y sus respuestas en PostgreSQL vía `SupabaseService`.
   - Se añadió la lógica para detectar si la respuesta es incorrecta, despachándola automáticamente al **Cuaderno de Errores** (`user_mistakes_notebook`) para habilitar el motor de repaso espaciado.

2. **LESS-04 (Conexión interactiva del botón "Siguiente"):**
   - Integración directa del frontend con el endpoint `/api/v1/learning/sections/:id/complete` alojado en `LearningController`.
   - Este endpoint utiliza el caso de uso `CompleteSectionUseCase` para calcular el porcentaje de acierto de la sección y otorgar el progreso, estrellas y experiencia correspondiente al usuario en tiempo real.

3. **LESS-06 (Consola Interactiva - Backend Sandbox Engine):**
   - Se construyó el servicio `DockerCodeRunnerService` implementando el patrón Strategy (`ICodeRunner`), diseñado para tomar código de Python inseguro y ejecutarlo dentro de contenedores aislados de Docker (`python:3.12-alpine`).
   - Se garantizó la seguridad mediante restricciones de memoria (32MB), límite de CPU y un timeout riguroso de 3 a 5 segundos para evitar ataques de ciclo infinito (DoD RNF-032).
   - Se expuso el endpoint `POST /api/v1/learning/sandbox/execute` en `LearningController` para interactuar con la consola de forma eficiente.

---

## 2. Componentes Desarrollados por Capa Arquitectónica

### Aplicación y Servicios (`apps/api/src/application/services/code-runner/`)
- `code-runner.interface.ts`: Puerto abstracto `ICodeRunner` para desacoplar el motor de ejecución y permitir en un futuro utilizar WebContainers o Lambdas.
- `docker-code-runner.service.ts`: Implementación robusta que usa `child_process.exec` para lanzar instancias temporales de Docker, montar el script, y destruir el contenedor al finalizar.
- `code-runner.module.ts`: Módulo inyectable que provee este servicio a la aplicación.

### Controladores (`apps/api/src/modules/learning/`)
- `learning.controller.ts`: Se añadieron los decoradores y endpoints POST correspondientes (`/sections/:id/complete` y `/sandbox/execute`) con validaciones DTO y protección de guardias (`SupabaseAuthGuard`).
- `learning.service.ts`: Se resolvió la carencia de campos de módulo y curso en el modelo de Mongo mediante el mapeo relacional a través del `CurriculumRepository`.

### Tipos Compartidos (`packages/types/`)
- `index.ts`: Se expandió la interfaz `LessonAnswerSubmission` añadiendo el campo `time_spent_seconds` indispensable para los algoritmos de calibración y dificultad del contenido de Koda.

---

## 3. Pruebas y Compilación
- Se corrigieron y adaptaron las pruebas unitarias en `learning.service.spec.ts` y `learning.resolver.spec.ts` para inyectar correctamente el `userId` que ahora demanda el mecanismo de evaluación.
- El proyecto en su capa de base de datos no presentaba regresiones y la compilación TypeScript (`tsc`) pasó con todos los tipos correctos para la comunicación entre el front y la persistencia en PostgreSQL.
