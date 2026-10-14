# Changelog - 14 de Octubre de 2026

## [14/10/2026] - Fase 1 de Realineación Quirúrgica: Blindaje de Pruebas y Seguridad

- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Desacoplamiento de `LearningService` mediante evento de dominio `LessonAnsweredEvent` y listener asíncrono `LessonAnsweredListener`.
- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Integración oficial de `EventEmitterModule.forRoot()` en `AppModule` para habilitar la Arquitectura Basada en Eventos (ADR-010).
- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Blindaje de `DockerCodeRunnerService` implementando salvaguardas anticolapso, limitación estricta de tiempo y mitigación de DoS para host y entornos Cloud (ADR-006).
- **Miércoles-14/10/2026-00:14** - Daniel Echeverría : Restauración total de la suite de pruebas unitarias (`apps/api`): 19 suites de tests y 74 pruebas unitarias pasando al 100% en verde.
