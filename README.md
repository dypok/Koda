# 🦊 Koda — Duolingo de Programación

> Plataforma educativa interactiva y gamificada para aprender a programar desde cero, diseñada sin asunciones previas, sin fricción cognitiva y con micro-lecciones atómicas ultra accesibles.

[![Python Version](https://img.shields.io/badge/Python-3.12-blue.svg?logo=python&logoColor=white)](https://www.python.org)
[![Módulo 01](https://img.shields.io/badge/Módulo%2001-Fundamentos-success.svg)](content/languages/python/modules/01_fundamentos/module.json)
[![Ruta Oficial](https://img.shields.io/badge/Ruta-12%20Módulos-blueviolet.svg)](content/languages/python/manifest.json)
[![Arquitectura](https://img.shields.io/badge/Arquitectura-Hexagonal%20%2B%20EDD%20(GraphQL%20%2B%20REST)-indigo.svg)](documentation/04-arquitectura-backend/11_SYSTEM_ARCHITECTURE.md)
[![Base de Datos](https://img.shields.io/badge/Database-Híbrida%20(Supabase%20%2B%20MongoDB)-emerald.svg)](documentation/04-arquitectura-backend/12_DATABASE_DESIGN.md)
[![Storage](https://img.shields.io/badge/Storage-Supabase%20Storage%20%2B%20MinIO-orange.svg)](documentation/adr/ADR-003-certificados-backend-supabase-storage.md)
[![Tests](https://img.shields.io/badge/Tests-29%20Suites%20Passing%20(100%25)-brightgreen.svg)](documentation/05-devops-seguridad/20_TESTING.md)
[![Documentación](https://img.shields.io/badge/Docs-Hub%20de%20Especificaciones-purple.svg)](documentation/README.md)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green.svg)](LICENSE)

> [!IMPORTANT]
> ### ⚠️ Estado de la Arquitectura & Ecosistema
> El monorepo cuenta con una **Arquitectura Hexagonal (Ports & Adapters)** con desacoplamiento reactivo por **Domain Events** (`@nestjs/event-emitter`, [ADR-010](documentation/adr/ADR-010-arquitectura-backend-hexagonal-modular-eventos-dominio-cache.md)), **Doble Capa de Transporte** ([ADR-012](documentation/adr/ADR-012-adopcion-arquitectura-hibrida-graphql-rest.md), GraphQL `/graphql` para la experiencia reactiva del estudiante y REST `/api/v1` para flujos HTTP nativos), contratos compartidos tipados de extremo a extremo (`@koda/types`), persistencia híbrida políglota ([ADR-009](documentation/adr/ADR-009-persistencia-hibrida-poliglota-mongodb-supabase.md), Supabase PostgreSQL con Prisma ORM + MongoDB Mongoose), sandbox de ejecución Pyodide WASM en navegador ([ADR-006](documentation/adr/ADR-006-motor-ejecucion-hibrido-icoderunner.md)), Cuaderno de Errores con algoritmo SuperMemo SM-2 (Épica 7) y defensa en profundidad ([ADR-018](documentation/adr/ADR-018-endurecimiento-transversal-ciberseguridad-defensa-en-profundidad.md)).

---

## 🎯 Visión y Filosofía Pedagógica de Koda

La mayoría de cursos de programación asumen conocimientos previos, emplean jerga intimidante o presentan muros de texto que provocan frustración y abandono temprano. **Koda** reimagina el aprendizaje combinando la psicología de gamificación de Duolingo, la ergonomía de herramientas como Linear y VS Code, y los principios de diseño instruccional más rigurosos:

- **Micro-Lecciones Atómicas:** Cada lección tiene entre 40 y 70 palabras explicadas en segunda persona (*"tú"*), estructurada en un máximo de 3 pasos lógicos.
- **Un Concepto, Una Lección, Una Práctica Inmediata:** Cada lección enseña una única idea atómica y la evalúa al instante mediante un desafío interactivo.
- **Sin Bloqueo Cognitivo:** Cero conceptos abstractos sin explicar. Se introducen mediante analogías visuales cotidianas.
- **Sistema de Errores Formativo y Sin Spoilers:** Al equivocarse, el estudiante recibe una pista inteligente pero **nunca se le revela la respuesta correcta**. La pregunta se encola en la **Ronda de Repaso Final** con **opciones barajadas** aleatoriamente, otorgando +2 XP de recuperación.
- **Cuaderno de Errores Persistente (Algoritmo SM-2):** Los fallos no resueltos se guardan en el cuaderno personal (`user_mistakes_notebook`) para permitir práctica deliberada con repetición espaciada (+5 XP al remediar).
- **11 Tipos de Interacción Pedagógica:** Opción múltiple, ordenamiento de bloques de código (Parsons problems), relleno de espacios en blanco (fill-in-the-blank), detección de bugs, predicción de salida, emparejamiento conceptual, consola interactiva, entre otros.
- **Gamificación Formativa y No Punitiva:** Sistema de 1 a 3 estrellas (⭐) por sección según precisión, candados de progresión secuencial (Kahn DAG Algorithm), economía de XP determinista, rachas diarias y reacciones emocionales en tiempo real con la mascota **🦊 Koda** renderizada en WebGL (PixiJS v7).

---

## 🏗️ Pila Tecnológica Oficial

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            ARQUITECTURA DE KODA                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 15 App Router + React 19 + TypeScript)                    │
│  ├── SEO & SSG/ISR: Verificación pública de certificados (/verificar/[code]) │
│  ├── UI & Estilos: Tailwind CSS + Radix UI / Shadcn + Phosphor Icons         │
│  ├── Estado & Server Cache: Zustand + TanStack Query v5                      │
│  ├── Motor de Animaciones: Framer Motion + Lenis Smooth Scroll               │
│  ├── Sandbox en Navegador: Pyodide WASM (Python 3.12 cliente, 0ms latencia)  │
│  └── Motor Gráfico WebGL: PixiJS v7 (Mascota Koda 🦊, confeti y emociones)   │
├──────────────────────────────────────────────────────────────────────────────┤
│  Backend (NestJS Arquitectura Hexagonal + Event-Driven Architecture)         │
│  ├── Transporte Híbrido (ADR-012):                                           │
│  │   ├── GraphQL Gateway (/graphql): Resolvers para Curriculum, Evaluation,  │
│  │   │   Roadmap DAG, Learning Progress y Cuaderno de Errores SM-2           │
│  │   └── REST API (/api/v1): OpenAPI 3.0.3 para Auth OTP/OAuth,              │
│  │       Certificación PDF, Diagnóstico Inicial y Healthchecks               │
│  ├── Casos de Uso Puros (Application Layer): 19 Use Cases desacoplados       │
│  ├── Eventos de Dominio: @nestjs/event-emitter (LessonAnsweredEvent, etc.)   │
│  ├── Seguridad Transversal: Helmet, AppThrottler, PiiMaskingInterceptor      │
│  └── Motor de Ejecución Backend (ICodeRunner): Sandboxing Docker aislado     │
│      con cuotas estrictas CPU/RAM, --net=none y fallback Cloud               │
├──────────────────────────────────────────────────────────────────────────────┤
│  Persistencia & Almacenamiento Híbrido (ADR-003, ADR-009, ADR-013)           │
│  ├── Base de Datos Relacional: Supabase (PostgreSQL 15+) con Prisma ORM      │
│  │   (Usuarios, perfiles, progreso, estrellas, intentos y cuaderno SM-2)     │
│  ├── Base de Datos de Documentos: MongoDB con Mongoose                       │
│  │   (Topología de cursos, rutas DAG, módulos, lecciones y tríadas)          │
│  ├── Aceleración L2 en Memoria: ContentBundleService (Cero 'fs' síncrono)    │
│  └── Storage de Certificados & Assets: Supabase Storage CDN y MinIO S3       │
│      con IObjectStorageService y generación backend con QR criptográfico     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Mapa Curricular y Ecosistema de Rutas

### Ruta Insignia de Lanzamiento: Python 3.12 (12 Módulos Canónicos)

La ruta oficial de Python se compone de **12 módulos canónicos** (`01_PROJECT_OVERVIEW.md` §34) estructurados bajo el estándar de micro-lecciones atómicas:

| Módulo | Título Formativo | Foco Pedagógico | Estado |
|:---:|---|---|:---:|
| **M01** | **Fundamentos de Python** | Tu primer `print()`, cadenas de texto, números, indentación y comentarios `#` | 🟢 Disponible |
| **M02** | **Variables y Tipos de Datos** | Almacenamiento en memoria, `int`, `float`, `str`, `bool` y función inspectora `type()` | 🟢 Disponible |
| **M03** | **Operadores y Expresiones** | Aritmética (`+`, `-`, `*`, `/`, `//`, `%`, `**`), comparadores y operadores lógicos | 🟡 En roadmap |
| **M04** | **Condicionales** | Toma de decisiones lógicas con bloques `if`, `elif` y `else` | 🟡 En roadmap |
| **M05** | **Bucles e Iteración** | Automatización de tareas repetitivas con `for`, `while`, `range()`, `break` y `continue` | 🟡 En roadmap |
| **M06** | **Funciones y Modularidad** | Creación de bloques reutilizables con `def`, argumentos, parámetros y `return` | 🟡 En roadmap |
| **M07** | **Listas y Tuplas** | Colecciones ordenadas, indexación `[0]`, slicing `[:]`, métodos `append()` y mutabilidad | 🟡 En roadmap |
| **M08** | **Diccionarios y Conjuntos** | Mapeo asociativo clave-valor `{key: value}`, métodos `get()` y colecciones únicas con `set` | 🟡 En roadmap |
| **M09** | **Manejo de Errores** | Prevención de caídas con bloques de control `try`, `except`, `else` y `finally` | 🟡 En roadmap |
| **M10** | **Módulos y Bibliotecas** | Organización del código con `import`, bibliotecas nativas (`math`, `random`) y paquetes | 🟡 En roadmap |
| **M11** | **Programación Orientada a Objetos** | Clases, instancias, atributos, métodos y el inicializador constructor `__init__` | 🟡 En roadmap |
| **M12** | **Proyecto Final Integrador** | Aplicación integral de todos los conceptos, examen final y emisión de certificación | 🟡 En roadmap |

### Ecosistema Multi-Lenguaje & Tracks Curriculares

Koda soporta un ecosistema extensible mediante su motor declarativo de contenido (`content/languages/`) y `ContentBundleService`:

| Track / Lenguaje | Enfoque Pedagógico | Nivel | Contenido Indexado |
|---|---|:---:|:---:|
| **Python** | Fundamentos, POO, scripts y lógica computacional | Principiante a Avanzado | 12 Módulos / 90+ lecciones |
| **HTML5 & CSS3** | Estructura web semántica, estilos, flexbox y diseño responsive | Principiante | Módulos disponibles |
| **JavaScript & TypeScript** | Interactividad web moderna, tipado estricto y ES6+ | Intermedio | Módulos disponibles |
| **FastAPI & Django** | APIs REST de alto rendimiento y arquitectura backend web | Intermedio / Avanzado | Módulos disponibles |
| **Lua** | Scripting ágil, sintaxis minimalista y desarrollo de videojuegos | Principiante | Piloto curricular (ADR-005) |

---

## 💻 Experiencia de Aprendizaje y Workspace Desktop

Koda implementa una interfaz de escritorio optimizada para el enfoque y la retención pedagógica:

```
┌─────────────────┬────────────────────────────────────────────────────────────────────────┐
│     🦊 KODA     │ 🧭 Python › Módulo 01 › Sección 02: Tu primer print() [ 50 XP ] [ 🔥 3 ] │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 🗺️ Ruta DAG     │ ┌── STEPPER DE SECCIÓN ──────────────────────────────────────────────┐ │
│ 📖 Lección (*)  │ │ S02: Tu primer print() │ [✓] [✓] [✓] [●] [5] [6] [7] [8] [9] [10]  │ │
│ 📓 Cuaderno SM2 │ └────────────────────────────────────────────────────────────────────┘ │
│ 🏆 Logros & XP  │ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ 📜 Certificados │ │ 📖 TEORÍA & CÓDIGO (Izq 50%)  │ │ 🧠 DESAFÍO INTERACTIVO (Der 50%) │ │
│                 │ │ • Micro-explicación paso a paso│ │ • Enunciado claro y sin spoilers │ │
│ [🦊 Koda WebGL] │ │ • Editor Pyodide / Monaco     │ │ • 11 Tipos de interacción        │ │
│                 │ │ • Consola de salida en vivo   │ │ • Opciones barajadas aleatorias  │ │
│                 │ │ • Tip formativo               │ │ • Feedback / Pista inteligente   │ │
│                 │ └───────────────────────────────┘ └──────────────────────────────────┘ │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

### Características del Workspace Desktop:
- **Espacio Dividido 50/50:** Teoría y código a la izquierda; práctica interactiva a la derecha sin scrolls molestos.
- **Stepper de 10 Píldoras:** Visualización del estado en tiempo real de cada micro-lección (`✓` completada, `●` activa).
- **Atajos de Teclado:** Teclas `1`-`4` o `A`-`D` para seleccionar opciones, `Enter` para verificar y flechas `←` / `→` para navegar.
- **Mascota 🦊 Koda en WebGL (PixiJS v7):** Animación en tiempo real con físicas de flotación, confeti acelerado y reacciones emocionales reactivas según los aciertos o equivocaciones.
- **Ejecución Local con Pyodide (WASM):** Ejecuta código Python en el navegador del estudiante en menos de 5 ms sin enviar peticiones al servidor.

---

## 📂 Estructura del Monorepo

```
Koda/
├── apps/                               # Aplicaciones del Monorepo
│   ├── api/                            # Backend NestJS Hexagonal (GraphQL + REST v2)
│   │   ├── src/
│   │   │   ├── domain/                 # Entidades, Value Objects, Eventos y Puertos
│   │   │   ├── application/            # Casos de uso (19 Use Cases), DTOs y Mappers
│   │   │   ├── infra/                  # Repositorios Prisma (Postgres) y Mongo, Event Listeners
│   │   │   ├── infrastructure/         # Supabase Storage, MinIO y Docker Runner
│   │   │   ├── presentation/           # GraphQL Resolvers y Controladores REST
│   │   │   └── modules/                # Módulos NestJS organizados
│   │   └── prisma/                     # Schema Prisma, migraciones y cliente
│   └── web/                            # Frontend Next.js 15 (React 19 + PixiJS + Tailwind)
│       └── src/
│           ├── app/                    # App Router (Rutas, páginas, layouts y vistas)
│           ├── components/             # Componentes visuales y Mascota Koda WebGL
│           ├── views/                  # Vistas modulares (Workspace, Roadmap, Notebook, etc.)
│           ├── stores/                 # Tiendas Zustand (auth, curriculum, audio, roadmap)
│           └── lib/                    # Clientes de API, motor PixiJS y utilidades
├── packages/                           # Paquetes y Contratos Compartidos
│   └── types/                          # Contratos TypeScript de dominio compartido (@koda/types)
├── content/                            # Contenido pedagógico declarativo desacoplado
│   └── languages/                      # Árbol de cursos, módulos, lecciones y bancos
│       ├── python/                     # Currículo completo de Python
│       ├── html/, css/, javascript/    # Módulos frontend
│       ├── typescript/, fastapi/       # Módulos backend
│       └── lua/                        # Currículo de Lua
├── documentation/                      # Hub de Documentación y Especificaciones
│   ├── README.md                       # Índice maestro y mapa de lectura por rol
│   ├── adr/                            # Decisiones de Arquitectura formalizadas (ADR-001..018)
│   ├── rules/                          # BACKEND_ARCHITECTURE_GUARD.md y mandamientos
│   ├── UserHistories/                  # Backlog Jira-Ready y Definición de Terminado (DoD)
│   ├── changelog/                      # Bitácora diaria por autor y hora
│   ├── done/                           # Evidencias y entregables completados
│   ├── 01-producto-negocio/            # Visión general, modelo y roadmap
│   ├── 02-requisitos-ux/               # RF, RNF, historias y casos de uso formales
│   ├── 03-pedagogia-contenido/         # Pedagogía atómica, scoring y guías
│   ├── 04-arquitectura-backend/        # Arquitectura hexagonal, base de datos y API spec
│   └── 05-devops-seguridad/            # Seguridad, testing, despliegue y analítica
├── graphify-out/                       # Grafo de conocimiento de la base de código (Graphify)
├── CONTRIBUTING.md                     # Guía de contribución y estándares de código
├── CHANGELOG.md                        # Bitácora histórica de cambios (America/Bogota)
├── LICENSE                             # Licencia de código abierto MIT
└── README.md                           # Documentación principal del proyecto
```

---

## 🛠️ Inicio Rápido con el Monorepo (Next.js + NestJS)

Para ejecutar la aplicación completa en tu entorno local:

### 1. Requisitos Previos
- **Node.js** `>= 20.0.0`
- **pnpm** `>= 9.0.0` (recomendado: `npm i -g pnpm`)
- **Docker & Docker Compose** (para Supabase local, MongoDB y MinIO opcional)

### 2. Instalación y Compilación de Contratos
```bash
# Instalar todas las dependencias del monorepo
pnpm install

# Compilar los paquetes de contratos TypeScript compartidos
pnpm --filter "@koda/types" build
```

### 3. Ejecución en Desarrollo
```bash
# Iniciar frontend y backend en paralelo
pnpm dev

# O iniciar servicios de forma individual:
pnpm dev:web    # Inicia Next.js en http://localhost:3000
pnpm dev:api    # Inicia NestJS en http://localhost:4000
```

- 🌐 **Frontend (Next.js 15):** [http://localhost:3000](http://localhost:3000)
- 🚀 **GraphQL Playground / Apollo Studio:** [http://localhost:4000/graphql](http://localhost:4000/graphql)
- ⚙️ **Backend API (REST v2):** [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- 📚 **Swagger UI (OpenAPI 3.0):** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

### 4. Ejecución de Pruebas Unitarias
```bash
# Ejecutar la suite completa de 29 suites de pruebas unitarias
pnpm --filter "api" test
```

### 5. Análisis del Repositorio con Graphify
Este proyecto cuenta con soporte para **Graphify** (`graphify-labs/graphify`), mapeando ASTs y grafos de conocimiento:
```bash
# Actualizar el grafo de conocimiento localmente
graphify update .
```
Los resultados y el visor interactivo se encuentran disponibles en `graphify-out/graph.html`.

---

## 🤝 Contribuciones y Gobernanza Técnica

¡Las contribuciones son bienvenidas! Consulta [`CONTRIBUTING.md`](CONTRIBUTING.md) para conocer las pautas de estilo, convención de commits y el flujo de trabajo con ramas.

> [!CAUTION]
> **Gobernanza de Arquitectura:** Todo cambio al backend debe acatar estrictamente los mandamientos de [`documentation/rules/BACKEND_ARCHITECTURE_GUARD.md`](documentation/rules/BACKEND_ARCHITECTURE_GUARD.md) (prohibido `fs` síncrono para contenido educativo, cero cascading N+1, y obligatoriedad de eventos de dominio desacoplados).

Para proponer nuevo contenido pedagógico, consulta la guía de autoría en [`documentation/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md`](documentation/03-pedagogia-contenido/24_CONTENT_AUTHORING_GUIDE.md).

---

## 📜 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo [`LICENSE`](LICENSE) para más detalles.
