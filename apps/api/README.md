# ⚙️ Koda Backend API (`apps/api`) 🦊

> Servicio backend monolito hexagonal basado en EDD construido con **NestJS**, **TypeScript**, **GraphQL** y **OpenAPI 3.0.3 (Swagger)**, persistencia híbrida políglota con **Prisma ORM** (Supabase PostgreSQL) y **Mongoose** (MongoDB), diseñado para desacoplar los motores pedagógico, de certificación, gamificación y analítica (`ADR-010`, `ADR-012`, `ADR-013`).

---

## 🏗️ Arquitectura Modular y Persistencia

La API se organiza en módulos de dominio cohesivos dentro de `src/modules/` y adaptadores de infraestructura desacoplados:

- **`languages/`:** Catálogo y consulta de lenguajes de programación y sus hojas de ruta.
- **`learning/`:** Entrega de micro-lecciones, verificación de respuestas y máquina de estados pedagógica.
- **`notebook/`:** Gestión del cuaderno de errores persistente (+5 XP al remediar) y cola de repaso activa (SM-2).
- **`certification/`:** Generación backend de certificados con QR, streaming y storage en Supabase Storage (`ADR-003`).

### 💾 Capas de Persistencia (`ADR-009`, `ADR-013`)
- **Supabase (PostgreSQL 15+):** Mapeado con **Prisma ORM** (`apps/api/prisma/schema.prisma`) para usuarios, progreso, transacciones ACID de XP y certificaciones.
- **MongoDB (NoSQL):** Mapeado con **Mongoose** (`@nestjs/mongoose`) para catálogo curricular, pistas, cursos y lecciones con Tríada Evaluativa.

---

## 🚀 Comandos de Ejecución

Desde la raíz del monorepo o dentro de `apps/api`:

```bash
# Desarrollo con recarga en caliente (Watch Mode)
pnpm --filter api start:dev

# Compilación de producción
pnpm --filter api build

# Ejecución en producción
pnpm --filter api start:prod

# Linters y formato
pnpm --filter api lint

# Pruebas unitarias
pnpm --filter api test
```

---

## 📚 Documentación Interactiva de la API

Cuando el servidor está en ejecución (puerto por defecto: `4000`):
- **Base URL REST:** `http://localhost:4000/api/v1`
- **Swagger UI en vivo:** `http://localhost:4000/api/docs`
- **GraphQL Sandbox / Endpoint:** `http://localhost:4000/graphql`

---

## 🗄️ Persistencia: Supabase (PostgreSQL) + MongoDB

El backend usa **persistencia híbrida poliglota** (`ADR-009`):

- **Supabase PostgreSQL** — cuentas, progreso, estrellas, intentos, XP, rachas, certificados y suscripciones (con RLS activado). Requiere un proyecto real en [supabase.com](https://supabase.com).
- **MongoDB** — contenido curricular (tracks, cursos, módulos, secciones y lecciones), consultado con Mongoose.

### 1. Variables de entorno

```bash
cp .env.example .env
```

Completa `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` con los valores de **Settings → API** de tu proyecto Supabase. La API **no arranca** si faltan (falla rápido con un mensaje explícito en vez de usar credenciales por defecto).

### 2. Levantar MongoDB local

```bash
# Desde la raíz del monorepo
pnpm db:up      # docker compose up -d mongo
```

### 3. Aplicar las migraciones SQL en Supabase

Las migraciones viven en `supabase/migrations/` (orden cronológico por nombre de archivo). Aplícalas con el [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref <tu-project-ref>
supabase db push
```

O pégalas en orden en el **SQL Editor** del dashboard de Supabase si no usas el CLI.

### 4. Sembrar contenido curricular en MongoDB

```bash
pnpm db:seed
```

Inserta (de forma idempotente, vía `upsert`) las pistas, el curso y la lección de ejemplo definidos en `src/database/seeds/`.

Consulta [`../../docs/05-devops-seguridad/21_DEPLOYMENT.md`](../../docs/05-devops-seguridad/21_DEPLOYMENT.md) para más detalles sobre cada variable requerida.
