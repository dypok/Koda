# ADR-014: Organización de Directorios Backend Hexagonal, Path Aliases y Orquestación Local de Infraestructura

> **Estado:** Aprobado  
> **Fecha:** 2026-09-15  
> **Autores:** Daniel Echeverría & Equipo de Arquitectura Koda  
> **Trazabilidad:** `ADR-001`, `ADR-008`, `ADR-009`, `ADR-010`, `ADR-011`, `ADR-012`, `ADR-013`, `11_SYSTEM_ARCHITECTURE.md`, `RNF-019`, `RNF-030`  

---

## 1. Contexto y Problema

Con la aprobación de la arquitectura **Hexagonal Modular basada en EDD (`ADR-010`)**, la persistencia híbrida con **Prisma ORM (`ADR-013`)** y **Mongoose (`ADR-009`)**, y el transporte híbrido **GraphQL/REST (`ADR-012`)**, se requería estandarizar la topología física de directorios en `apps/api/src/` y resolver tres necesidades técnicas:

1. **Ergonomía de Importaciones y Desacoplamiento de Capas:** La ausencia de *path aliases* en TypeScript obligaba a emplear rutas relativas frágiles (`../../../../domain/...`), dificultando refactorizaciones y abriendo la puerta a violaciones de la regla de dependencias (por ejemplo, importar adaptadores de infraestructura dentro del dominio).
2. **Estructura Explícita de Capas Hexagonales:** La estructura previa de `apps/api/src/` mantenía convenciones clásicas de NestJS con carpetas acopladas (`database/` mezclando MongoDB y Supabase). Era indispensable fijar un esqueleto formal de `domain/`, `application/`, `infra/`, `presentation/` y `common/`.
3. **Orquestación Local Integral:** `docker-compose.yml` solo contenía el servicio de MongoDB (`koda-mongo`), omitiendo el servicio de Redis requerido por `ADR-010`, `ADR-011` y `apps/api/.env.example` para Cache-Aside L2 y colas BullMQ.

---

## 2. Alternativas Evaluadas

- **Alternativa A — Mantener estructura clásica por módulos (`modules/*`) con subcarpetas internas:**
  - *Ventajas:* Menor número de carpetas en la raíz de `src/`.
  - *Desventajas:* Fragmenta los adaptadores de infraestructura transversal (ej. un solo `PrismaService` y `PrismaModule` central) y dificulta el cumplimiento de la pureza del dominio.
- **Alternativa B (Seleccionada) — Topología Hexagonal Layered + Feature Slices con Path Aliases e Infraestructura Completa:**
  - *Ventajas:* Separa nítidamente el núcleo de dominio (`domain/`), la orquestación (`application/`), los adaptadores de persistencia/storage/eventos (`infra/`) y las interfaces de entrada GraphQL/REST (`presentation/`). Provee alias de TypeScript `@domain/*`, `@application/*`, `@infra/*`, `@presentation/*` y `@common/*`. Añade Redis al entorno local de Docker.
  - *Desventajas:* Mayor disciplina inicial en la definición de puertos de repositorio e interfaces de caso de uso.

---

## 3. Decisión Adoptada

Se formalizan las siguientes medidas estructurales y de tooling en el monorepo:

### A. Estandarización de Directorios en `apps/api/src/`
```
apps/api/
├── prisma/
│   └── schema.prisma               # Definición declarativa de modelos Supabase PostgreSQL
└── src/
    ├── domain/                     # 100% puro: cero dependencias de NestJS/Prisma/Mongoose
    │   ├── entities/               # Entidades de negocio
    │   ├── repositories/           # Puertos/Interfaces de repositorio (IUserRepository, etc.)
    │   └── events/                 # Eventos de dominio puros
    ├── application/                # Capa de orquestación de casos de uso
    │   ├── use-cases/              # Lógica de aplicación
    │   └── dto/                    # DTOs de comandos y consultas
    ├── infra/                      # Adaptadores de salida (Secondary / Driven Adapters)
    │   ├── database/
    │   │   ├── postgres/           # PrismaService, PrismaModule, Repositorios Prisma
    │   │   └── mongo/              # Mongoose Schemas y Repositorios Mongo
    │   ├── storage/                # Adaptador Supabase Storage (certificados/avatares)
    │   └── events/                 # Adaptador de bus de eventos (EventEmitter2 / BullMQ)
    ├── presentation/               # Adaptadores de entrada (Primary / Driving Adapters)
    │   ├── graphql/                # Resolvers Code-First, tipos y dataloaders
    │   └── rest/                   # Controladores REST, interceptores y DTOs HTTP
    └── common/                     # Cross-cutting concerns globales (Guards, Decorators, Filters)
```

### B. Configuración de Path Aliases en `apps/api/tsconfig.json`
Se configuran alias canónicos con soporte tanto en tiempo de compilación (`tsc`) como en tiempo de ejecución de desarrollo (`ts-node`/`tsconfig-paths`):
- `@domain/*` -> `src/domain/*`
- `@application/*` -> `src/application/*`
- `@infra/*` -> `src/infra/*`
- `@presentation/*` -> `src/presentation/*`
- `@common/*` -> `src/common/*`
- `@modules/*` -> `src/modules/*` (compatibilidad transitoria)

### C. Completitud de Servicios Locales en `docker-compose.yml`
Se integra formalmente el servicio `redis:7-alpine` (`koda-redis`) en el puerto estándar `6379:6379` con volumen de persistencia `koda_redis_data`, permitiendo levantar MongoDB y Redis concurrentemente mediante `pnpm db:up` o `docker compose up -d`.

---

## 4. Consecuencias

### Positivas
- **Trazabilidad y Mantenibilidad:** Regla de dependencias explícita y forzada por arquitectura (el dominio no conoce a Prisma ni a Mongoose).
- **Importaciones Limpias:** Eliminación total de rutas relativas profundas (`../../../../`).
- **Desarrollo Local sin Fricción:** Redis y MongoDB disponibles de forma determinista para desarrolladores y CI/CD con un único comando.
- **Preparación Inmediata para la Épica 3:** Los adaptadores de autenticación y perfiles (`PrismaUserRepository`, `SupabaseAuthGuard`) encajan de forma natural en sus capas respectivas.

### Negativas y Mitigaciones
- **Curva de transición:** Los módulos legacy en `src/modules/` se migrarán ordenadamente hacia las capas `domain/`, `application/`, `infra/` y `presentation/` a medida que se ejecuten los sprints de backend correspondientes.
