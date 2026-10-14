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
