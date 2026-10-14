# REGLAS ESTRICTAS DE ARQUITECTURA Y PREVENCIÓN DE ANTIPATRONES — BACKEND KODA
> **APLICABILIDAD:** Obligatoria e inapelable para desarrolladores, colaboradores y agentes de IA al leer, diseñar o modificar cualquier archivo bajo `apps/api/` y librerías backend de Koda.  
> **ESTÁNDAR BASE:** Hexagonal Architecture (Ports & Adapters) + Event-Driven Architecture (ADR-001 al ADR-016).

---

## 1. MANDAMIENTOS INVIOLABLES DE ARQUITECTURA

1. **PROHIBIDO EL ACCESO DIRECTO AL SISTEMA DE ARCHIVOS (`fs` / `fs/promises`) PARA DATOS EDUCATIVOS:**
   - Queda terminantemente prohibido usar `fs.readFileSync`, `fs.readFile` o rutas relativas (`../../content/...`) en servicios o controladores para cargar bancos de preguntas, lecciones o configuraciones curriculares.
   - **Solución Obligatoria:** Toda la malla curricular y bancos de preguntas deben persistirse y consultarse a través de **MongoDB (Mongoose)** mediante repositorios de dominio (`CurriculumRepositoryPort`, `QuestionBankRepositoryPort`) o cargarse mediante bundles tipados en memoria precompilados.

2. **PROHIBIDO EJECUTAR PROCESOS DEL HOST O DOCKER EN CALIENTE DENTRO DEL HILO DEL BACKEND:**
   - Queda terminantemente prohibido usar `child_process.exec`, `child_process.spawn` o comandos directos como `docker run` en el hilo de peticiones de la API de NestJS.
   - **Solución Obligatoria:** 
     - Para el MVP: La ejecución de código de estudiantes debe realizarse en el navegador mediante **Pyodide / Web Workers (ADR-006)**.
     - Para el backend: Solo se admiten validadores estáticos, analizadores AST seguros o workers aislados desacoplados mediante colas asíncronas (**BullMQ** sobre contenedores de ejecución dedicados con cuotas estrictas de CPU y memoria).

3. **SEPARACIÓN ESTRICTA DE PROTOCOLOS DE TRANSPORTE (ADR-012):**
   - **GraphQL (`/graphql`):** Exclusivo para interacciones del estudiante de alta reactividad, navegación de roadmap, ejecución de lecciones interactivas, solicitud de quizzes y entrega de intentos de evaluación (`EvaluationResolver`).
   - **REST (`/api/v1`):** Estrictamente reservado para flujos de autenticación (`/auth`), generación/descarga de PDFs (`/certification`), streaming de activos multimedia, diagnóstico y healthchecks (`/health`).
   - **Regla:** Ningún endpoint interactivo del estudiante debe crearse en REST a menos que sea un proxy temporal de compatibilidad que consuma internamente el caso de uso de dominio.

4. **PROHIBIDO EL ACOPLAMIENTO DE PERSISTENCIA Y CASCADAS N+1 (SUPABASE / POSTGREST):**
   - En flujos de evaluación o guardado masivo (como el guardado de preguntas fallidas en `user_mistakes_notebook`), **está prohibido ejecutar llamadas `.insert()` individuales dentro de bucles `for` o `forEach`**.
   - **Solución Obligatoria:** Utilizar inserciones por lote (`bulk insert`):
     ```typescript
     // CORRECTO: 1 sola petición de red
     await client.from('user_mistakes_notebook').insert(bulkMistakes);
     ```
   - Para transacciones críticas de usuario (estrellas, rachas, XP), usar transacciones ACID mediante **Prisma ORM (`prisma.$transaction`)**.

5. **DESACOPLAMIENTO DE EFECTOS SECUNDARIOS VÍA EVENTOS DE DOMINIO (ADR-010):**
   - El hilo de respuesta inmediata de una evaluación o lección **solo debe calcular y devolver el veredicto y feedback al estudiante**.
   - Toda mutación secundaria (acumulación de XP, cálculo de racha, actualización del cuaderno de errores, emisión de estrellas) **debe emitirse como un Domain Event** (`AttemptEvaluatedEvent`, `LessonCompletedEvent`) mediante `@nestjs/event-emitter`.
   - La latencia p95 para la respuesta del estudiante debe mantenerse **por debajo de 100 ms**.

6. **ESTRICTA SEPARACIÓN DE CAPAS HEXAGONALES:**
   - **`domain/`**: Entidades puras y Value Objects. CERO dependencias de NestJS, Prisma, Supabase o Mongoose.
   - **`application/`**: Casos de uso (`Use Cases`) y definición de puertos (`Ports`).
   - **`infra/`**: Implementación de puertos (adaptadores secundarios de Prisma, Mongoose, Supabase, Storage).
   - **`modules/` / `presentation/`**: Controladores REST y Resolvers GraphQL (adaptadores primarios). No contienen lógica de negocio; únicamente parsean DTOs e invocan casos de uso.

---

## 2. CHECKLIST OBLIGATORIO PRE-COMMIT Y PRE-PR

Antes de aprobar o fusionar cualquier cambio en `apps/api/`:
- [ ] ¿El nuevo código introduce `fs` o rutas relativas al disco para datos de negocio? -> Si sí, **RECHAZAR**.
- [ ] ¿El nuevo código invoca `child_process` o `docker` directamente? -> Si sí, **RECHAZAR**.
- [ ] ¿Hay consultas o inserciones en bucles (N+1)? -> Si sí, **RECHAZAR**.
- [ ] ¿El flujo del estudiante está en GraphQL con contratos TypeScript compartidos (`@koda/types`)? -> Si no, **EXIGIR RESOLVER**.
- [ ] ¿Las 74+ pruebas unitarias de la suite ejecutan limpias (`npm run test`)? -> Si no, **CORREGIR**.
- [ ] ¿Se registró la modificación en el changelog diario (`documentation/changelog/`)? -> Obligatorio.
