# Changelog - 14 de Octubre de 2026

## [14/10/2026] - Fase 1 de Realineación Quirúrgica: Blindaje de Pruebas y Seguridad

- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Desacoplamiento de `LearningService` mediante evento de dominio `LessonAnsweredEvent` y listener asíncrono `LessonAnsweredListener`.
- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Integración oficial de `EventEmitterModule.forRoot()` en `AppModule` para habilitar la Arquitectura Basada en Eventos (ADR-010).
- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Blindaje de `DockerCodeRunnerService` implementando salvaguardas anticolapso, limitación estricta de tiempo y mitigación de DoS para host y entornos Cloud (ADR-006).
- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Restauración total de la suite de pruebas unitarias (`apps/api`): 19 suites de tests y 74 pruebas unitarias pasando al 100% en verde.

## [14/10/2026] - Fase 2 de Realineación Quirúrgica: ContentBundleService & Erradicación N+1

- **Miércoles-14/10/2026-10:09** - Daniel Echeverría : Implementación de `ContentBundleService` en `apps/api/src/infra/content/content-bundle.service.ts` eliminando lecturas sincrónicas `fs.readFileSync` durante peticiones HTTP y habilitando compatibilidad Cloud Stateless.
- **Miércoles-14/10/2026-10:09** - Daniel Echeverría : Erradicación de la cascada N+1 en `EvaluationService.evaluateAttempt` mediante inserción masiva (`bulk insert`) en `user_mistakes_notebook` y `attempt_answers`.
- **Miércoles-14/10/2026-10:09** - Daniel Echeverría : Creación de suite unitaria `evaluation.service.spec.ts` con cobertura de mitigación de spoilers y verificación de llamada única en bloque. Suite global: 20/20 pasadas (76 tests en verde).

## [14/10/2026] - Fase 3 de Realineación Quirúrgica: Casos de Uso Hexagonales & Transporte GraphQL Dual

- **Miércoles-14/10/2026-10:28** - Daniel Echeverría : Creación de casos de uso hexagonales puros en `apps/api/src/application/use-cases/evaluation/` (`GenerateEvaluationUseCase`, `EvaluateAttemptUseCase`, `GetAttemptSummaryUseCase`).
- **Miércoles-14/10/2026-10:28** - Daniel Echeverría : Implementación de `EvaluationResolver` y `EvaluationGraphQLModule` bajo `/graphql` cumpliendo con el ADR-012 para la experiencia reactiva del estudiante.
- **Miércoles-14/10/2026-10:28** - Daniel Echeverría : Conversión de `EvaluationController` y `EvaluationService` en proxies y fachadas delegativas puras hacia los casos de uso, previniendo el code drift y garantizando compatibilidad 100% con el frontend actual de Next.js.
- **Miércoles-14/10/2026-10:28** - Daniel Echeverría : Adición de pruebas unitarias para casos de uso y resolver GraphQL. Suite global: 23/23 suites pasadas (81 tests en verde).

## [14/10/2026] - Sincronización Remota con Vexalith-studios & Blindaje Final Pre-PR

- **Miércoles-14/10/2026-11:07** - Daniel Echeverría : Sincronización e integración de `origin/develop` del nuevo repositorio oficial (`Vexalith-studios/Koda-academy.git`).
- **Miércoles-14/10/2026-11:07** - Daniel Echeverría : Corrección de discrepancias de tipado en `LearningService` (`sectionId`, `moduleId`, `track.slug`, `icon_url`) y desacoplamiento con `@Optional()` en `ContentLoaderService`.
- **Miércoles-14/10/2026-11:07** - Daniel Echeverría : Actualización de aserciones en `curriculum-use-cases.spec.ts` para alinearse con los 8 nodos de fundamentos de Python.
- **Miércoles-14/10/2026-11:07** - Daniel Echeverría : Validación integral de calidad y no-regresión: 23/23 suites unitarias pasando al 100% en verde (81 tests exitosos).
