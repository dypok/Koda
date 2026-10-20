# Entregable Backend 13: Sincronizacion de user_section_stars y otorgamiento dinamico de targetXp

## Modulo / Dominio
Learning Engine / Gamificacion (GAMI-01) / Persistencia PostgreSQL Prisma

## Descripcion de Cambios
1. **Alineacion de Prisma Schema con PostgreSQL (`apps/api/prisma/schema.prisma`)**:
   - Se ajusto el modelo `UserSectionStars` para coincidir exactamente con la estructura de la base de datos PostgreSQL existente: campos `courseSlug`, `moduleSlug`, `sectionSlug`, `maxStarsEarned`, `attemptsCount`, `firstEarnedAt`, `lastEarnedAt`, y la clave unica compuesta `@@unique([userId, courseSlug, moduleSlug, sectionSlug])`.
   - Se ejecuto `prisma generate` asegurando tipos estrictos y eliminando excepciones en consultas runtime.

2. **Soporte de targetXp en Entidades y DTOs**:
   - `CompleteSectionDto`: Se agrego la propiedad opcional `targetXp?: number` con validadores `@IsOptional() @IsNumber() @Min(0)`.
   - `SectionStarsEntity`: Se extendio el metodo `recordAttempt(accuracyPercentage, targetXp?: number)` para otorgar el `targetXp` provisto en la primera aprobacion de la seccion en lugar del valor hardcodeado de 30 XP.
   - `CompleteSectionUseCase` y `IProgressRepository`: Propagacion de `targetXp` a traves de los parametros de cierre y persistencia.

3. **Prisma Repository y Mappers**:
   - `PrismaProgressRepository` y `ProgressMapper`: Se actualizaron las operaciones de `upsert`, `findFirst`, `findMany` y `checkPrerequisitesMet` para usar `sectionSlug`, `moduleSlug`, y `maxStarsEarned`.
   - Asignacion correcta del registro guardado para retorno del resultado sin errores de TypeScript.

4. **Curriculum Roadmap Alignment**:
   - En `GetRoadmapGraphUseCase` se aseguro la coherencia del nodo `py-m01` con XP objetivo de 120 XP.

## Verificacion y Pruebas
- 24 suites de pruebas unitarias y de integracion ejecutadas con exito (82 pruebas pasando, 0 fallos).
- Compilacion de NestJS (`pnpm --filter api build`) completada con codigo de salida 0.
