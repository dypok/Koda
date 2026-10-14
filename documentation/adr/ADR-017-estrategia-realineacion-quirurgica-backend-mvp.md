# ADR-017: Estrategia de Realineación Quirúrgica del Backend y Rama de Integración Aislada para MVP

- **Estado:** Aceptado
- **Fecha:** 2026-10-14
- **Autor / Responsable:** Daniel Echeverría (Lead Backend Architect)
- **Decisores:** Tech Leads, Backend Developers, Tech Steering Committee

---

## 1. Contexto y Planteamiento del Problema

Tras la auditoría técnica exhaustiva sobre la rama `develop` (Commit HEAD: `4d23426`), se identificaron desviaciones arquitectónicas críticas introducidas durante EPIC-05 y EPIC-06:
1. Ruptura de suites de tests unitarios (`learning.service.spec.ts` y `learning.resolver.spec.ts`) por inyección acoplada de `SupabaseService`.
2. Lectura directa del sistema de archivos local (`fs.readFileSync('../../content/languages')`) en `EvaluationService`, incompatible con despliegues en contenedores Cloud stateless (`ENOENT`).
3. Cascada N+1 a través de PostgREST en inserciones masivas de errores del estudiante, degradando la latencia p95 por encima de los 1.5 - 2.5 segundos.
4. Riesgo crítico de Denegación de Servicio (DoS) en `DockerCodeRunnerService` por ejecución síncrona en el host mediante `child_process.exec`.
5. Omisión en tiempo de ejecución de la arquitectura basada en eventos (`EventEmitterModule` nunca se inicializó en `AppModule`).

Frente al requerimiento de tener el **MVP listo en menos de 1 semana**, se evaluó una reversión total (`git revert`) frente a una realineación quirúrgica paso a paso. El equipo determinó proceder con la **Realineación Quirúrgica (Opción B)** para preservar los contratos ya consumidos por las pantallas de frontend en Next.js.

Sin embargo, para garantizar la máxima estabilidad del proyecto, **no se deben aplicar cambios estructurales bruscos de forma directa sobre `develop`** mientras las 3 fases no estén 100% completas, probadas y validadas integralmente.

---

## 2. Decisión Tomada

Se decide formalmente adoptar una **estrategia de rama de integración y estabilización aislada** para la Realineación Quirúrgica:

1. **Creación de la Rama de Integración Oficial:**  
   Se crea y publica la rama:
   ```bash
   feature/realineacion-quirurgica-backend-mvp
   ```
   Esta rama nace desde `develop` y servirá como el único búfer de convergencia para todas las fases de estabilización.

2. **Flujo de Integración Quirúrgico (Merge Target Isolation):**  
   - Los PRs de las fases individuales (**Fase 1:** Blindaje de Tests y Seguridad, **Fase 2:** ContentBundleService y Anti N+1, **Fase 3:** Use Cases Hexagonales y Resolver GraphQL) **NO apuntarán a `develop`**, sino estrictamente hacia `feature/realineacion-quirurgica-backend-mvp`.
   - Cada fase se ejecuta en una rama corta dedicada (`fix/realignment-phaseX-...`) con commits atómicos y alcanzables.
   - Si una fase presenta regresiones, puede revertirse o ajustarse en la rama de integración sin desestabilizar `develop`.

3. **Condición de Fusión Final hacia `develop` (Gate de Cierre):**  
   `feature/realineacion-quirurgica-backend-mvp` se integrará a `develop` mediante un único Pull Request final **únicamente cuando**:
   - El 100% de las suites de pruebas unitarias y de integración pasen en verde (`npm test` con 19/19 suites y >75 tests).
   - Se haya verificado la inocuidad y compatibilidad de extremo a extremo con el cliente frontend (`apps/web`).
   - Se haya verificado la eliminación de lecturas de disco y cascadas N+1.

---

## 3. Consecuencias y Beneficios

### Positivas:
- **Protección Inquebrantable de `develop`:** `develop` permanece estable y desplegable en todo momento, evitando roturas accidentales a otros desarrolladores de frontend o contenido.
- **Entorno de Pruebas Unificado:** Permite probar la interacción entre el nuevo `EventEmitter`, el `ContentBundleService` y los Resolvers GraphQL en un ambiente integrado antes de tocar la línea principal.
- **Trazabilidad y Rollback Seguro:** Si ocurre algún imprevisto durante una fase intermedia, el alcance del impacto queda completamente confinado a la rama de características.

### Negativas / Mitigaciones:
- Requiere disciplina estricta de redirección de ramas base en GitHub CLI / Pull Requests (mitigado mediante la reconfiguración automática de PRs como el PR #28).
