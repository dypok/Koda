# 📋 TODO — Koda 🦊

> Backlog corto de tareas pendientes **detectadas y verificadas en el repositorio**.
> Los ítems de producto viven en Jira (proyecto `KA`); este archivo lista lo accionable sobre el repo.
>
> **Última actualización:** 2026-10-15 (America/Bogota)
> **Fuentes:** sesión de trabajo + Jira `KA` + `documentation/`.

**Leyenda:** `[ ]` pendiente · `[x]` hecho · **P1** alto · **P2** medio · **P3** bajo

---

## 🛡️ P1 — Ciberseguridad Integral & Hardening Transversal

- [x] **Fase 1: Hardening de API, Anti-Leakage y Rate Limiting** (`feat/security-hardening`)
  - [x] `SecurityExceptionFilter`: Supresión de stack traces, errores de BD/Prisma y paths internos en producción (`500 Internal server error`).
  - [x] `PiiMaskingLoggerInterceptor`: Ofuscación activa de contraseñas, tokens JWT, números de documento y secretos en observabilidad y consola.
  - [x] Throttling severo anti-fuerza bruta en `/auth/*` (5 req/min en registro y reseteo, 10 en OTP, 15 en verificación de sesión).
  - [x] Blindaje HTTP con Helmet (HSTS preload 1 año, X-Frame-Options DENY, noSniff, xssFilter) y CORS cerrado en producción.
  - [x] Restricción de payload a 100 KB contra DoS por memoria.
  - [x] Desactivación automática de Swagger e Introspección GraphQL en producción.
- [x] **Fase 2: Frontend XSS Shield & Content Security Policy (CSP)**
  - [x] Implementar CSP estricto en cabeceras de Next.js (`apps/web/next.config.mjs`).
  - [x] Sanitización activa contra enlaces maliciosos (`javascript:`, etc.) en renderers de Markdown (`markdown-content.tsx`).
- [x] **Fase 3: Almacenamiento Seguro de Sesiones (Cookies HttpOnly)**
  - [x] Soporte de fijación de Refresh Token en Cookie segura (`HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth`) para inmunizar contra robo por XSS en `/auth/verify-otp` y `/auth/refresh-session`.
- [x] **Fase 4: Control de Acceso Estricto & Prevención de IDOR**
  - [x] Blindaje de `notebook.resolver.ts` y use cases: eliminación de `userId` manipulable desde el cliente y forzado de `@CurrentUser()` / `SupabaseAuthGuard` para que la identidad provenga exclusivamente del token verificado.
- [ ] **Fase 5: Prevención de Fuga de Secretos & Auditoría CI**
  - [ ] Auditoría de vulnerabilidades con `pnpm audit` y script para prevenir commit de secretos/llaves privadas al repositorio.

---

## 🗂️ P1 — Gobernanza y Jira

- [ ] **Transicionar `KA-89` (EPIC-3) a `Done`** (ID de transición `4`) tras verificar compilación, tests y entrega funcional del flujo de autenticación. En Jira figura `En curso` pese a tener **4/4** hijas `Done` (AUTH-01…AUTH-04).
- [ ] **Abrir Pull Request** de la rama `docs/content-question-json-contract` (docs `29`/`30` + `content/schemas/question.schema.json`). Vincular los `KA-XXX` aplicables.
- [ ] **Revisar pendientes de `KA-115` (EPIC-4):** LEARN-03 (desbloqueo progresivo con candados), LEARN-04 (estrellas 1–3), LEARN-05 (persistencia híbrida poliglota y rejilla tier/lane).
- [ ] **Revisar pendientes de `KA-145` (EPIC-5):** LESS-03 (tríada evaluativa de 3 ítems), LESS-04 (ronda de repaso final), LESS-05 (tipos de desafío polimórficos en MongoDB), LESS-06 (motor de ejecución `ICodeRunner`: Pyodide + Docker).

---

## 🧩 P1 — Contrato de contenido (docs `29`/`30` + schema)

- [ ] **Validador de contenido en CI** contra `content/schemas/question.schema.json` (script `scripts/validate-content` + hook de pre-commit o job de CI). Hoy la validación se hizo manual con `ajv`: **32/32** bancos y **34/34** módulos válidos.
- [ ] **Implementar el bloque `graph` en `module.json`** y un generador que materialice `lua-track.mock.ts` / `lua-lessons-graph.mock.ts` (doc `30` §4; resuelve **L-02** y **L-03**).
- [ ] **Reconvertir `documentation/03-pedagogia-contenido/28_LUA_CURRICULUM.md`** a UTF-8 (hoy no es legible: encoding binario/no-UTF8).
- [ ] **Alinear `23_CONTENT_SPECIFICATION.md`** al formato vigente (IDs en UUID y `EASY/MEDIUM/HARD` son aspiracionales; ya hay nota de cabecera, falta converger el cuerpo).

---

## 📚 P2 — Contenido (bancos y dialectos)

- [ ] **Migrar el dialecto shorthand → canónico** en `content/languages/lua/modules/03_operadores/bank.json` y en los bancos de `python` (`options`/`correct_option_id`/`hint` → `answers`/`correct_answer_ids`/`hints`).
- [ ] **Completar `correct_answer_ids` y `difficulty`** en las **20** preguntas de `content/languages/lua/modules/02_variables/bank.json` (hoy dependen solo de `answers[].is_correct`; válido, pero incompleto).
- [ ] **Completar `id` en respuestas** donde falta (p. ej. `02_variables/bank.json`, pregunta índice `5`, respuestas 1–3).
- [ ] **Ampliar bancos de Lua para cumplir B_min** (quiz ≥30, examen ≥80; por tipo ≥2× cuota). Estado actual: `01_fundamentos`=15, `02_variables`=20, `03_operadores`=2.
- [ ] **Visores de los tipos sin UI** (`select_code`, `order_lines`, `matching`, `small_problem`, `multiple_choice`, `write_code`): documentados en `29` §4 pero aún sin datos ni render.

---

## ⚙️ P1 — Motor / Backend

- [ ] **Corregir bancos en array en `evaluation.service.ts`.** Lee `bankData.questions`, pero los `bank.json` de Lua son **array plano** → quizzes/exámenes quedan vacíos. Soportar ambas formas (`array` y `{ module_code, questions }`). Archivo: `apps/api/src/modules/evaluation/evaluation.service.ts:69`.
- [ ] **Soportar el dialecto canónico en la calificación.** `evaluation.service.ts` califica con `correct_option_id` (líneas `128`, `165`, `172`, `275`); no entiende `answers[].is_correct` ni `correct_answer_ids`.
- [ ] **Incluir los módulos de Lua en el roadmap del API.** `content-loader.service.ts:281` filtra por prefijo `py_`/`js_`/`ts_`; Lua usa `lua_mod_*` → no aparece (doc `30`, **L-01**).
- [ ] **Watcher de contenido.** `content-loader.service.ts:87` carga en `onModuleInit` sin recarga; añadir `fs.watch` sobre `content/` (doc `30`, **L-04**).
- [ ] **Implementar subida de avatares (backend)**: `POST /api/v1/users/me/avatar` (`multipart/form-data`, bucket `avatars`). Ver `documentation/done/backend/PENDIENTE-backend-avatar-upload.md`.

---

## 🎨 P2 — Frontend

- [ ] **Pyodide en frontend + layout interactivo** (deriva de LESS-03…06 / EPIC-5).

---

## ✅ Hecho (referencia)

- [x] Docs `29_QUESTION_JSON_CONTRACT.md` y `30_ROADMAP_STRUCTURE_AND_COORDINATES.md` + `content/schemas/question.schema.json` (rama `docs/content-question-json-contract`, commit `36edcdd`).
- [x] `GEMINI.md`: visión multilingüe, superficie REST real, §6 Contrato de Contenido y §4 sincronizada con Jira.

---

> **Mantenimiento:** marcar los `[x]` al cerrar; mantener sincronizado con Jira y con `CHANGELOG.md`. Los entregables cerrados se archivan en `documentation/done/`.
