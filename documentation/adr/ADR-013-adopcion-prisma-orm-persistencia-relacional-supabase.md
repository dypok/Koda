# ADR-013: Adopción de Prisma ORM para Persistencia Relacional en Supabase PostgreSQL

> **Estado:** Aprobado  
> **Fecha:** 2026-09-15  
> **Autores:** Daniel Echeverría & Equipo de Arquitectura Koda  
> **Trazabilidad:** `ADR-002`, `ADR-008`, `ADR-009`, `ADR-010`, `ADR-011`, `ADR-012`, `11_SYSTEM_ARCHITECTURE.md`, `12_DATABASE_DESIGN.md`, `RNF-001`, `RNF-010`, `RNF-030`  

---

## 1. Contexto y Problema

En la arquitectura de Koda, la persistencia de datos está desacoplada bajo un modelo **Híbrido Políglota (`ADR-009`)**:
- **MongoDB (NoSQL):** Custodia el catálogo curricular jerárquico inmutable (árbol DAG de tracks y cursos, módulos, secciones y lecciones con la Tríada Evaluativa).
- **Supabase (PostgreSQL 15+):** Custodia las entidades transaccionales y de identidad crítica (usuarios consolidados, economía y libro mayor inmutable de XP, rachas, protectores freeze, sesiones de remediación del cuaderno de errores, marcas de estrellas y certificaciones oficiales).

Con la adopción del **Monolito Hexagonal basado en EDD (`ADR-010`)** y el **Transporte Híbrido GraphQL/REST (`ADR-012`)**, surgió la necesidad de seleccionar el mecanismo estándar de acceso y mapeo de datos relacionales en el backend NestJS (`apps/api`).

El equipo evaluó las dos tecnologías dominantes en el ecosistema TypeScript/NestJS: **TypeORM** y **Prisma ORM**.

---

## 2. Comparativa Técnica de Alternativas

| Criterio | 🔷 Prisma ORM | 🔶 TypeORM | Justificación en el Contexto de Koda |
|---|---|---|---|
| **Seguridad de Tipos (Type Safety)** | **100% estricta en compilación.** Los tipos resultantes se derivan del `select` o `include` de la consulta. | Tipado por clases decoradas. Consultas con `QueryBuilder` dependen de cadenas de texto no verificadas en compilación. | Koda exige TypeScript estricto sin `any` para coincidir con GraphQL Codegen y los puertos de dominio. |
| **Arquitectura Hexagonal (Clean Architecture)** | **Desacoplamiento total.** El schema vive en `schema.prisma`. Los adaptadores (`PrismaUserRepository`) implementan puertos (`IUserRepository`) mapeando DTOs/entidades puras sin decoradores en el dominio. | Frecuente acoplamiento: promueve decorar las mismas clases del dominio con `@Entity()` y `@Column()`, violando la separación de capas. | Protege el núcleo del dominio de dependencias de infraestructura y decoradores de persistencia. |
| **Introspección de Supabase** | **Automática (`prisma db pull`).** Lee el catálogo existente generado por las migraciones SQL DDL de Supabase, respetando triggers PL/pgSQL y RLS. | Mapeo manual tedioso: requiere sincronizar manualmente cada tabla, índice y restricción a entidades TypeScript. | Koda ya posee migraciones maestras desplegadas en Supabase (`20260914...`). Prisma las ingiere de forma transparente. |
| **Sinergia con GraphQL (`ADR-012`)** | **Nativa.** Consultas jerárquicas y DataLoaders encajan de forma fluida con las APIs de Prisma (`findUnique`, `findMany`, batch queries). | Compleja. Tiende a generar problemas de queries N+1 o consultas `leftJoinAndSelect` sobredimensionadas. | Optimiza el rendimiento de resolvers para `roadmapProgress`, `userProfile` y `studentDashboard`. |
| **Transacciones ACID Complejas** | Soporte robusto mediante transacciones interactivas `$transaction(async (tx) => { ... })` y batching atómico. | Transacciones mediante `QueryRunner` propensas a fugas de conexiones si no se gestionan en bloques `finally`. | Esencial para operaciones atómicas: emisión de certificados con bloqueo de correlativo (`CERT-01`) y ledger inmutable de XP. |
| **Curva de Aprendizaje y Mantenibilidad** | Excelente Developer Experience (DX), autocompletado exhaustivo en el IDE y herramienta visual integrada (Prisma Studio). | Alta deuda técnica histórica: issues abiertos de sincronización, decoradores pesados y mantenimiento comunitario intermitente. | Minimiza errores de onboarding de desarrolladores en el equipo. |

---

## 3. Decisión Adoptada

Se aprueba formalmente la adopción de **Prisma ORM** y se ratifica la convivencia políglota bajo las siguientes reglas arquitectónicas:

1. **Prisma ORM para la Capa Relacional (Supabase PostgreSQL):**
   - Se utilizará como el único ORM para acceder a PostgreSQL 15+ en Supabase.
   - El esquema canónico residirá en `apps/api/prisma/schema.prisma`, alimentado mediante introspección (`prisma db pull`) de las migraciones SQL de Supabase.
   - El cliente generado (`@prisma/client`) estará encapsulado estrictamente dentro del módulo de infraestructura `apps/api/src/infra/database/postgres/`.

2. **Mongoose para la Capa de Catálogo Curricular (MongoDB):**
   - **Mongoose (`@nestjs/mongoose`)** se mantiene como el único ODM oficial para MongoDB.
   - Gestiona exclusivamente las colecciones curriculares de lectura masiva $O(1)$: `tracks`, `courses`, `modules`, `sections`, `lessons` y `visual_effects` (`ADR-009`, `ADR-011`).
   - Reside estrictamente en `apps/api/src/infra/database/mongo/` y `apps/api/src/database/schemas/`.

3. **Independencia en la Capa de Dominio (Puertos y Adaptadores):**
   - Las entidades del dominio en `domain/entities/` no importarán ningún tipo, modelo o decorador de Prisma ni de Mongoose.
   - Los casos de uso consumirán únicamente interfaces abstractas (puertos de repositorio: `IUserRepository`, `IProgressRepository`, `ICourseRepository`).
   - Los adaptadores de infraestructura (`PrismaUserRepository`, `MongoCourseRepository`) serán los encargados de traducir los modelos de persistencia hacia las entidades del dominio.

---

## 4. Consecuencias y Plan de Implementación

### Positivas
- **Cero desincronización de esquemas:** Introspección continua sobre la base de datos de Supabase sin necesidad de reescribir entidades a mano.
- **Rendimiento predecible:** Generación de consultas SQL eficientes con prevención de N+1 junto a DataLoaders en GraphQL.
- **Alineación Hexagonal:** Dominio 100% puro y testeable con mocks simples de puertos en memoria.
- **Compatibilidad con PgBouncer:** Prisma soporta conexión directa y conexión agrupada (Connection Pooling) de Supabase.

### Negativas y Mitigaciones
- **Paso de generación obligatorio:** Requiere ejecutar `prisma generate` durante el ciclo de instalación/build.
  - *Mitigación:* Se añade el comando al script `postinstall` y al workflow de CI/CD en GitHub Actions (`pnpm run build`).
- **Dos clientes de BD en el backend:** Coexistencia de Prisma y Mongoose en el runtime de NestJS.
  - *Mitigación:* Cada cliente está aislado en su propio módulo (`PrismaModule` y `MongooseModule`), evitando acoplamientos transversales y cumpliendo con `RNF-030`.
