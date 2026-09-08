# 🔵 EPIC 4 — Motor de Aprendizaje y Hoja de Ruta (Roadmap) Python 3.12
`Sprint 2 · v1.0 · Color Jira: Azul · Código: LEARN`

> Esta épica materializa el **Learning Engine** de Koda (`14_LEARNING_SYSTEM.md`, `11_SYSTEM_ARCHITECTURE.md` §10): la visualización interactiva de la hoja de ruta de 12 módulos de Python 3.12, los candados secuenciales de progresión, el sistema de 1 a 3 estrellas (⭐) y la arquitectura de progreso en doble capa.

---

### LEARN-01 — Visualización de la Hoja de Ruta (Roadmap Timeline) con Nodos y Candados
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Frontend Lead  
**Rama sugerida:** `feature/roadmap-timeline-nodos`

**Historia de usuario:**
> "Como estudiante, quiero ver mi camino de aprendizaje como un timeline vertical dinámico de módulos y secciones,
> para saber exactamente qué he completado, en qué punto me encuentro y qué habilidades desbloquearé a continuación."

**Criterios de aceptación:**
- Endpoint `GET /api/v1/learning/roadmap/python` entrega el árbol completo de 12 módulos con secciones, estrellas ganadas, candados (`is_unlocked`) y porcentaje de maestría global.
- Nodos renderizados con 3 estados visuales diferenciados:
  1. **Completado:** Borde dorado/verde, badge de estrellas (⭐ 1 a 3), checkmark y porcentaje de maestría alcanzado.
  2. **Activo / En Curso:** Pulso animado, botón de acción destacado *"Continuar"*, mascota Koda 🦊 señalando la posición actual.
  3. **Bloqueado:** Color atenuado (slate oscuro), ícono de candado cerrado y mensaje explicativo del prerrequisito necesario.
- Barra superior flotante (*Roadmap Header*): porcentaje general de avance, total de estrellas acumuladas (sobre 360⭐ posibles) y nivel actual.
- Cero recarga de página: transiciones suaves y scroll suave hacia el nodo activo al ingresar a `/app`.

**Subtasks:**
- [ ] [BACKEND] Endpoint `GET /api/v1/learning/roadmap/:languageSlug` en `LearningController` que consulte el progreso consolidado del usuario en Supabase.
- [ ] [FRONTEND] Componente `RoadmapTimeline.tsx` y `RoadmapModuleNode.tsx` en `apps/web/src/components/roadmap/`.
- [ ] [FRONTEND] Implementar renderizado condicional de candados, estados de sección y badges de estrellas.
- [ ] [FRONTEND] Posicionar la miniatura de la mascota Koda 🦊 junto al último nodo activo para reforzar el acompañamiento lúdico.
- [ ] [TEST] Verificar respuesta p95 < 80 ms para la consulta completa de la hoja de ruta.

**DoD adicional para esta US:**
- Conexión completa entre el endpoint de NestJS y el cliente Next.js utilizando contratos de `@koda/types`.

---

### LEARN-02 — Desbloqueo Progresivo y Reglas Canónicas de Transición
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Developer + Frontend Developer  
**Rama sugerida:** `feature/reglas-desbloqueo-canonica`

**Historia de usuario:**
> "Como estudiante, quiero que las lecciones y módulos se desbloqueen secuencialmente a medida que demuestro dominio,
> para garantizar que no me salte conceptos fundamentales sin haberlos comprendido previamente."

**Criterios de aceptación:**
- Reglas canónicas invariantes (`05` RF-MOD-003, `14` §4):
  - Módulo 01 (Fundamentos) está desbloqueado por defecto para todos los usuarios.
  - Sección $S_{i+1}$ se desbloquea **solo si** la Sección $S_i$ tiene estado completado ($\ge 1$ estrella obtenida).
  - Módulo $M_{j+1}$ se desbloquea **únicamente si** el estudiante aprueba el Examen Final del Módulo $M_j$ con calificación $\ge 80\%$.
- Excepción por Diagnóstico: si el usuario aprobó el test inicial, los módulos correspondientes quedan desbloqueados automáticamente con bandera `unlocked_by_diagnostic=true`.
- Protección de endpoints en backend: intentar acceder a una lección o evaluación de un módulo bloqueado arroja error `403 Forbidden` ("Debes completar los prerrequisitos anteriores").

**Subtasks:**
- [ ] [BD] Procedimiento almacenado o función PL/pgSQL `check_module_unlock_status(p_user_id, p_module_id)` en Supabase.
- [ ] [BACKEND] Guard de validación `ModuleAccessGuard` en NestJS que verifique las dependencias previas antes de servir el contenido de una lección.
- [ ] [FRONTEND] Modal informativo accesible cuando el usuario intenta hacer clic en un nodo con candado: *"Completa el Módulo X primero para abrir este contenido"*.
- [ ] [TEST] Tests unitarios con Jest para los casos límite de desbloqueo (secuencial, salto prohibido, excepción diagnóstica).

**DoD adicional para esta US:**
- Imposible forzar el desbloqueo mediante manipulación de URLs o parámetros en el cliente.

---

### LEARN-03 — Sistema de Calificación de 1 a 3 Estrellas (⭐) por Sección
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Fullstack Developer  
**Rama sugerida:** `feature/sistema-estrellas-seccion`

**Historia de usuario:**
> "Como estudiante, quiero recibir de 1 a 3 estrellas según la precisión de mis respuestas en cada sección,
> para tener una métrica clara de excelencia y motivarme a rejugar secciones para alcanzar la perfección (3⭐)."

**Criterios de aceptación:**
- Asignación determinista de estrellas según porcentaje de aciertos en primera ronda (`16` §4, `12` §8):
  - ⭐⭐⭐ **(3 Estrellas):** 100% de ejercicios correctos al primer intento (perfección).
  - ⭐⭐ **(2 Estrellas):** 80% a 99% de aciertos.
  - ⭐ **(1 Estrella):** 70% a 79% de aciertos (mínimo para aprobar).
  - **0 Estrellas (< 70%):** Sección no aprobada; debe repetirse.
- Persistencia de la mejor marca histórica: si un usuario obtuvo 2⭐ y luego reintenta y saca 3⭐, se actualiza el registro con `stars_earned = 3` y se otorga el XP diferencial.
- Animación visual de concesión de estrellas al finalizar la sección con sonido y confeti si se logra 3⭐.

**Subtasks:**
- [ ] [BD] Columna `stars_earned (SMALLINT CHECK 0..3)` en tabla `user_section_progress`.
- [ ] [BACKEND] Algoritmo en `LearningService` que calcule las estrellas a otorgar al recibir el payload de lección/sección completada.
- [ ] [FRONTEND] Componente `StarRatingDisplay.tsx` con animación escalonada de estrellas doradas.
- [ ] [FRONTEND] Pantalla de resumen de sección con desglose de aciertos, tiempo empleado y estrellas conseguidas.

**DoD adicional para esta US:**
- Reintentar una sección ya completada nunca reduce el número de estrellas previamente ganadas.

---

### LEARN-04 — Persistencia de Progreso en Doble Capa (Inmutable vs. Agregada)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead  
**Rama sugerida:** `feature/persistencia-doble-capa`

**Historia de usuario:**
> "Como arquitecto del sistema, quiero registrar el progreso educativo en dos capas (fuente de verdad inmutable + agregados cacheados),
> para garantizar auditoría histórica absoluta sin degradar los tiempos de respuesta del frontend (p95 < 100 ms)."

**Criterios de aceptación:**
- **Capa 1 (Granular Inmutable):** Cada intento se registra en `user_attempts`, `attempt_answers` y `xp_transactions` con UUID, timestamp, versión de contenido congelada e idempotency key (`RNF-033`).
- **Capa 2 (Agregada Derivada):** Tabla `user_progress` almacena el porcentaje calculado, última lección vista y módulos completados por usuario y lenguaje.
- Triggers PL/pgSQL en PostgreSQL que recalculan de forma atómica la Capa 2 tras cada inserción en Capa 1 (`12` §8.3).
- Mecanismo de reconciliación: función SQL `rebuild_user_progress(user_id, language_id)` capaz de reconstruir la Capa 2 desde cero en caso de inconsistencia.

**Subtasks:**
- [ ] [BD] Crear migraciones SQL de las tablas de intentos y agregados de progreso en Supabase.
- [ ] [BD] Implementar trigger PostgreSQL `trg_after_attempt_insert` que actualice `user_progress`.
- [ ] [BACKEND] Implementar soporte para cabecera `Idempotency-Key` en `POST /api/v1/learning/lessons/:id/answer`.
- [ ] [TEST] Test de concurrencia simulando 50 respuestas simultáneas sin corrupción de datos agregados.

**DoD adicional para esta US:**
- Función de reconstrucción de progreso probada mediante test automatizado en CI.

---

### LEARN-05 — Detalle del Módulo, Temario Desglosado y Metadatos
**Tipo:** Story | **SP:** 3 | **Prioridad:** Media | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/modulo-detalle-temario`

**Historia de usuario:**
> "Como estudiante, quiero abrir el detalle de cualquier módulo en la ruta,
> para ver su temario completo, el tiempo estimado, los requisitos previos y el estado de sus evaluaciones."

**Criterios de aceptación:**
- Endpoint `GET /api/v1/learning/modules/:id` entrega: título, objetivo pedagógico, total de secciones, tiempo estimado, requisitos y estados de Quiz y Examen.
- Panel lateral deslizable (Sheet) o modal responsive con:
  - Objetivo formativo en lenguaje claro para principiantes.
  - Lista de secciones con sus lecciones asociadas e ícono de estado.
  - Tarjeta de Quiz intermedio (desbloqueable al 50% del módulo).
  - Tarjeta de Examen final (desbloqueable al completar el 100% de las secciones).
  - Botón de acción principal: *"Iniciar lección pendiente"* o *"Revisar conceptos"*.

**Subtasks:**
- [ ] [BACKEND] Endpoint `GET /api/v1/learning/modules/:id` en `LearningController`.
- [ ] [FRONTEND] Componente `ModuleDetailDrawer.tsx` con tabs informativos (Secciones, Evaluaciones, Recursos).
- [ ] [FRONTEND] Integrar datos reales de Python 3.12 desde el manifest declarativo.

**DoD adicional para esta US:**
- Navegación fluida entre el Roadmap general y el detalle del módulo sin alterar el scroll del usuario.
