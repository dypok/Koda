# 📋 Auditoría Técnica de Arquitectura Backend: Hexagonal Basada en Eventos vs. Estado Actual (Transición Frank)

> **Rol del Auditor:** Senior Backend Architect & Security Auditor  
> **Fecha de Emisión:** 13 de Octubre de 2026  
> **Rama Auditada:** `develop` (Commit HEAD: `4d23426`)  
> **Documentos de Referencia:** `11_SYSTEM_ARCHITECTURE.md`, `12_DATABASE_DESIGN.md`, `13_API_SPECIFICATION.md`, `ADR-008` a `ADR-016`  
> **Componentes Auditados:** `EvaluationModule`, `LearningModule`, `DockerCodeRunnerService`, `LearningService`, `PrismaService`, `SupabaseService`.

---

## 1. Resumen Ejecutivo y Veredicto Técnico

Tras una inspección estricta y multidimensional del código fuente en `develop`, se confirma que **el desarrollador backend (Frank) alteró significativamente el paradigma arquitectónico del proyecto sin documentar un Architecture Decision Record (ADR)**.

El sistema pasó de una **Arquitectura Hexagonal (Puertos y Adaptadores) orientada a Eventos de Dominio con persistencia híbrida desacoplada (ADR-010 / ADR-011)** a un **Monolito Procedural Síncrono Centrado en Controladores/Servicios (Transaction Script / Fat Services)** con llamadas directas por red y lectura síncrona de archivos en disco.

### Veredicto del Auditor:
> **Calificación:** ⚠️ **DEUDA TÉCNICA CRÍTICA CON RIESGOS SEVEROS DE PRODUCCIÓN (P0/P1)**.  
> Aunque la intervención de Frank logró destrabar funcionalidades de usuario a corto plazo para las pantallas de Quizzes y Exámenes (Épica 6) y ejecución en consola (Épica 5), **ha introducido 3 cuellos de botella de alto impacto, 2 vectores de denegación de servicio (DoS) y una ruptura del aislamiento de capas** que compromete la escalabilidad horizontal, la observabilidad y los tiempos de respuesta estipulados en contrato ($p95 < 50\text{ ms}$).

---

## 2. Arqueología del Cambio: ¿Qué teníamos vs. Qué implementó Frank?

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DISEÑO BASE (ADR-010 / ADR-011)                      │
│                                                                        │
│  [Cliente] ──(GraphQL/REST)──> [Controller / Resolver]                 │
│                                       │                                │
│                                [Use Case (App)]                        │
│                                       │                                │
│                   ┌───────────────────┴───────────────────┐            │
│                   ▼                                       ▼            │
│          [Domain Repositories]                   [Domain Event Bus]    │
│            (Ports / Adapters)                   (BullMQ / EventEmitter)│
│          ┌─────────┴─────────┐                            │            │
│          ▼                   ▼                            │ (Async)    │
│     (MongoDB)           (PostgreSQL)                      ▼            │
│    Currículo O(1)      Transacciones             [Background Workers]  │
│    (Mongoose L2)      (Prisma ACID)              - Gamification (XP)   │
│                                                  - Streaks (Rachas)    │
│                                                  - Cuaderno Errores    │
└────────────────────────────────────────────────────────────────────────┘

                                    VS.

┌────────────────────────────────────────────────────────────────────────┐
│                     ESTADO ACTUAL (TRANSICIÓN FRANK)                   │
│                                                                        │
│  [Cliente] ──(REST Exclusivo)──> [Fat Service (Procedural)]            │
│                                       │                                │
│          ┌────────────────────────────┼───────────────────────────┐    │
│          ▼                            ▼                           ▼    │
│  [Filesystem (fs)]           [Supabase SDK (HTTP)]     [Docker CLI]    │
│  - fs.readFileSync           - Chained PostgREST calls - child_process │
│  - JSON parsing en memoria   - N+1 queries en bucle    - execSync/exec │
│  - Rutas relativas frágiles  - Sin transacciones ACID  - Spawns x req  │
│  - In-memory Maps locales    - Bloqueo síncrono HTTP   - Bloqueo Event │
│                                                          Loop (DoS)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Análisis Crítico: Cuellos de Botella y Comparación Técnica

### 3.1. Latencia y Acoplamiento Temporal (El Antipatrón de Cascada N+1 sobre PostgREST)

* **En la arquitectura hexagonal basada en eventos (`ADR-010`):**
  El controlador delega en un caso de uso que valida la respuesta formativa y persiste el intento atómico. Inmediatamente despacha `LessonCompletedEvent` o `AttemptEvaluatedEvent` y retorna al cliente en $< 50\text{ ms}$. Tareas secundarias (recalcular racha, alimentar cuaderno de errores SuperMemo SM-2, auditoría) ocurren de forma reactiva y no bloqueante.

* **En la implementación de Frank (`LearningService.evaluateAnswer` y `EvaluationService.evaluateAttempt`):**
  Todas las operaciones fueron reconvertidas a una cadena síncrona lineal. En `EvaluationService.evaluateAttempt`:
  1. Consulta a MongoDB por el módulo y curso.
  2. Lee y parsea `bank.json` del disco.
  3. Ejecuta llamada HTTP `supabase.from('attempts').insert(...)`.
  4. Ejecuta llamada HTTP `supabase.from('attempt_answers').insert(...)`.
  5. **Bucle For con N peticiones HTTP secuenciales:**
     ```typescript
     for (const detail of attemptDetails.filter(d => !d.is_correct)) {
        await client.from('user_mistakes_notebook').insert({ ... }); // ⚠️ N+1 NETWORK REQUESTS
     }
     ```
  6. Llamada HTTP a RPC `client.rpc('fn_award_xp')`.

* **Impacto en Producción:**
  - `client.from(...)` de `@supabase/supabase-js` utiliza **PostgREST sobre HTTP/REST**, no una conexión TCP nativa con pool como Prisma. Cada llamada incurre en overhead de headers HTTP, serialización JSON y latencia de ida y vuelta (RTT).
  - En un examen con 10 errores, el servidor ejecuta **14 llamadas de red secuenciales** antes de responderle al estudiante.
  - **Latencia estimada:** De un objetivo de $p95 < 50\text{ ms}$ a una degradación real de **$800\text{ ms} - 2500\text{ ms}$**.

---

### 3.2. Seguridad y Concurrencia: El Antipatrón "Docker-in-Host" en `DockerCodeRunnerService`

Frank implementó `DockerCodeRunnerService` utilizando `child_process.exec` directo sobre la máquina anfitriona:
```typescript
const command = `docker run --rm -i \
  --cpus="0.5" --memory="64m" \
  -v "${scriptPath}:/app/script.py:ro" \
  python:3.12-alpine \
  timeout ${timeoutMs / 1000} python /app/script.py`;

const { stdout, stderr } = await execAsync(command, { timeout: timeoutMs + 1000 });
```

#### Cuellos de Botella Críticos:
1. **Sobrecarga de Arranque (Container Cold Start Overhead):**  
   Ejecutar `docker run --rm` por cada petición HTTP requiere que el daemon de Docker inicialice namespaces, cgroups y monte el volumen. Esta sobrecarga toma entre **600 ms y 1500 ms** solo en bootstrapping del contenedor, independientemente de si el script de Python tarda 2 ms.
2. **Agotamiento de Recursos y Denegación de Servicio (DoS):**  
   Si 25 estudiantes en una cohorte de Riwi envían código simultáneamente, el host intentará crear 25 contenedores concurrentes. El socket de Docker y el kernel colapsarán la CPU, degradando a cero la capacidad de respuesta del API de NestJS.
3. **Escritura y Borrado de Archivos Temporales en Disco (`.tmp/code-runner`):**  
   Escribir un archivo `.py` en disco por ejecución crea saturación de I/O de disco. Si el contenedor falla abruptamente o el proceso es abortado, los archivos temporales quedan huérfanos.
4. **Vulnerabilidad de Command Injection Potencial:**  
   Concatenar comandos de shell mediante plantillas de string (`${timeoutMs / 1000}`) sin sanitización estricta de parámetros en `child_process.exec` es una vulnerabilidad prohibida por OWASP en entornos de sandbox.

---

### 3.3. Violación del "Twelve-Factor App": I/O de Disco vs. Base de Datos en `EvaluationService`

Frank desacopló las evaluaciones de MongoDB y escribió un lector de archivos plano directo del sistema de archivos:
```typescript
private getBasePath(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), '../../content/languages'),
    path.resolve(process.cwd(), 'content/languages'),
  ];
  return possiblePaths.find(p => fs.existsSync(p)) || '';
}
```

#### Riesgos Técnicos:
1. **Fallo en Contenedores de Producción / Serverless:**  
   `process.cwd()` depende del directorio de trabajo al arrancar Node. En imágenes Docker multi-stage de producción (`Dockerfile`), la carpeta `content/` usualmente no se copia al contenedor final de `apps/api` o vive en otra ruta. Cuando `fs.existsSync` falle, el API lanzará `BadRequestException('Banco de preguntas vacío')`.
2. **Incompatibilidad con Escalado Horizontal:**  
   `private readonly moduleBanks = new Map<string, any[]>();` almacena el banco en la memoria RAM del proceso local. Si se tienen 3 réplicas del backend en Kubernetes o ECS, las actualizaciones de contenido no se propagan y cada réplica mantendrá copias obsoletas o estados no sincronizados.
3. **Omisión de la Colección `QuestionBank` en MongoDB:**  
   En `ADR-009` y `apps/api/src/database/schemas/question-bank.schema.ts` ya existía el esquema Mongoose optimizado para consultas $O(1)$ con índices compuestos. Frank re-inventó el acceso al banco leyendo JSONs en crudo.

---

### 3.4. Dualidad Tecnológica Inconsistente: Prisma ORM vs. Supabase PostgREST SDK

El proyecto adoptó formalmente **Prisma ORM (`ADR-013`)** para tener tipado estricto, migraciones reproducibles y transacciones ACID (`tx.$transaction`).

* **Lo que hizo Frank:**  
  En lugar de inyectar `PrismaService` o utilizar los repositorios de dominio (`IProgressRepository`), Frank inyectó `SupabaseService` e interactuó con `client.from('attempts')` y `client.from('user_mistakes_notebook')`.
* **Consecuencias:**
  - **Falta de Atomicidad Real:** Si la inserción del intento tiene éxito pero la inserción de las respuestas falla por timeout de red, la base de datos queda corrupta (intento huérfano sin respuestas asociadas). Con Prisma, esto se resolvía en una única transacción atómica `prisma.$transaction`.
  - **Bypassing del Tipado Prisma:** Las llamadas directas con cadenas arbitrarias como `'SINGLE_CHOICE'`, `'attempts'` y `'fn_award_xp'` carecen de verificación estática de TypeScript, reintroduciendo errores por nombres de columnas mal escritas.

---

### 3.5. Deriva de Transporte: Ruptura de Contratos GraphQL (`ADR-012`)

* `ADR-012` y el Cierre de Sprint 1 establecieron taxativamente que:
  - **REST (`/api/v1`)** queda reservado para Auth, streaming de certificados PDF, webhooks y diagnóstico de entrada.
  - **GraphQL (`/graphql`)** es el transporte mandatario para la experiencia interactiva del estudiante (Roadmap, Lecciones, Evaluaciones) para evitar sobrecarga de red en dispositivos móviles (sparse fieldsets).
* Frank expuso el motor de evaluación **100% en REST** en `EvaluationController` (`POST /api/v1/learning/quiz/:id/attempt`, `GET /api/v1/learning/modules/:id/quiz`), rompiendo la estrategia de tipado de extremo a extremo con `@koda/types` y GraphQL Code Generator.

---

## 4. Pensamiento Crítico: ¿Tuvo Frank alguna razón válida?

Un análisis senior no juzga a ciegas. Es crucial identificar qué problemas reales estaba intentando esquivar Frank:

1. **Evitar la Sobreingeniería Prematura de BullMQ en Entorno Local:**  
   Configurar Redis, colas de BullMQ, trabajadores dedicados, reintentos de fallos y dead-letter queues exige que cada desarrollador del equipo tenga Redis corriendo localmente y comprenda la consistencia eventual. Frank priorizó la **velocidad de entrega (Time-to-Market)** para tener pantallas operativas en la demo del Sprint.
2. **Inmutabilidad y Versionado de Evaluaciones (EVAL-04):**  
   La idea de Frank de calcular un checksum SHA-256 (`contentVersionHash`) del banco de preguntas y guardarlo en el intento es **pedagógicamente brillante**. Protege la validez histórica de las calificaciones: si un profesor edita la pregunta meses después, el hash certifica con qué versión exacta del examen se evaluó al estudiante.
3. **Muestreo Dinámico Estratificado:**  
   El algoritmo de recetas en `compositions.json` (ej. 3 de código, 2 teóricas) es limpio, funcional y garantiza que dos estudiantes no reciban exactamente el mismo quiz.
4. **Pragmatismo en el Sandbox:**  
   Levantar Docker localmente mediante `child_process.exec` resolvió la necesidad inmediata de ejecutar código Python sin pagar infraestructura externa como Judge0 o AWS Lambda durante la fase de desarrollo.

---

## 5. Matriz Comparativa Definitiva

| Criterio Técnico | Arquitectura Hexagonal + Eventos (ADR-010/011) | Arquitectura Procedural Síncrona (Frank) | Veredicto del Auditor |
|---|---|---|---|
| **Latencia HTTP en Cliente** | **Excelente ($p95 < 50\text{ ms}$)**: Desacopla efectos secundarios al background. | **Deficiente ($800 - 2500\text{ ms}$)**: Chained PostgREST calls y bucles N+1 síncronos. | 🏆 **Hexagonal + Eventos** |
| **Atomicidad y Consistencia** | **Alta**: Transacciones ACID con Prisma + Outbox Pattern. | **Pobre**: Peticiones HTTP independientes sin rollback ante fallos parciales. | 🏆 **Hexagonal (Prisma)** |
| **Resiliencia ante Caídas** | **Alta**: Si el cálculo de XP falla, el evento se reintenta en la cola sin perder la respuesta del estudiante. | **Baja**: Si falla el guardado de un error en el cuaderno, la petición completa explota con error 500. | 🏆 **Hexagonal + Eventos** |
| **Facilidad de Debugging Local** | **Media/Baja**: Requiere seguir trazas asíncronas e hilos de eventos. | **Alta**: Flujo secuencial procedural fácil de seguir con puntos de interrupción (`debugger`). | 🏆 **Frank (Simplicidad)** |
| **Concurrencia en Code Runner** | **Alta**: Despacho de trabajos a cola de ejecución o runners aislados Wasm/Pyodide. | **Inviable**: Spawnea procesos Docker directamente en el proceso web. DoS garantizado a >20 req/s. | 🏆 **Hexagonal (Runners)** |
| **Compatibilidad Cloud/Docker** | **Alta**: Doce factores cumplidos, configuración stateless, caché en Redis. | **Riesgosa**: Dependencia de `fs` y rutas relativas al directorio de trabajo local. | 🏆 **Hexagonal** |
| **Velocidad de Implementación** | **Lenta**: Exige crear entidades, puertos, mappers, use cases y listeners. | **Rápida**: Todo el flujo se escribe en un solo archivo de servicio. | 🏆 **Frank (Prototipado)** |

---

## 6. Plan de Acción y Hoja de Ruta de Remediación (Propuesta ADR-017)

No se recomienda desechar el código de Frank, sino **refactorizarlo y encuadrarlo dentro de la gobernanza técnica**:

### Fase 1: Neutralización de Riesgos Críticos (P0 - Inmediato)
1. **Sustituir `child_process.exec` en `DockerCodeRunnerService`:**
   - Para el frontend de lecciones cotidianas, utilizar **Pyodide (WebAssembly en el navegador del cliente)** como primera línea de ejecución sin costo de servidor (`ADR-006`).
   - Para exámenes formales en backend, migrar la ejecución a un worker en segundo plano o utilizar un pool de contenedores pre-calentados (evitando `docker run --rm` en frío).
2. **Eliminar el Bucle N+1 de PostgREST:**
   - En `EvaluationService.evaluateAttempt`, consolidar los errores en un solo `insert` masivo de array (`client.from('user_mistakes_notebook').insert(arrayOfMistakes)`) o delegarlo a `PrismaService`.

### Fase 2: Realineación Arquitectónica (P1 - Sprint 3)
3. **Migrar el Banco de Preguntas a MongoDB:**
   - Cargar `bank.json` y `compositions.json` durante el seeder de Mongo (`db:seed`) en la colección `question_banks`.
   - Reemplazar las lecturas de `fs.readFileSync` en `EvaluationService` por consultas a `ICurriculumRepository`.
4. **Reintroducir Eventos de Dominio Ligeros (`@nestjs/event-emitter`):**
   - Extraer el guardado en `user_mistakes_notebook` y la asignación de XP de la ruta crítica del endpoint de respuestas.
   - Emitir `AttemptEvaluatedEvent` y permitir que un listener en segundo plano procese el cuaderno de errores sin hacer esperar al usuario.
5. **Redactar formalmente el ADR-017:**
   - Titular: *ADR-017: Unificación de Motores de Evaluación y Sandbox dentro de la Arquitectura Hexagonal y Gobernanza de Persistencia*. Documentar los compromisos de diseño aceptados y corregir las desviaciones.

---

**Firma del Auditor:**  
**Daniel Echeverría**  
Senior Backend Architect & Core Engineer — Koda Platform
