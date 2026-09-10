# ADR-009: Persistencia Híbrida Políglota con MongoDB para Contenido y Supabase PostgreSQL para Transacciones

> **Estado:** Aprobado  
> **Fecha:** 2026-09-10  
> **Autores:** Daniel Echeverría & Equipo de Arquitectura Koda (database-engineer)  
> **Trazabilidad:** `11_SYSTEM_ARCHITECTURE.md`, `12_DATABASE_DESIGN.md`, `ADR-002`, `RNF-001`, `RNF-007`, `RNF-031`  

---

## 1. Contexto y Problema
En el diseño inicial (`ADR-002`, `12_DATABASE_DESIGN.md`), se contempló almacenar la totalidad de los datos en Supabase (PostgreSQL 15+), incluyendo el árbol de ramas de carrera, cursos, módulos, secciones, lecciones atómicas y bancos de preguntas polimórficas (opción múltiple, ordenamiento de código, ejecución sandbox, fill-in-the-blank).

Sin embargo, el análisis técnico del modelo educativo reveló dos perfiles de carga diametralmente opuestos:
1. **Dominio Transaccional y de Usuario (Alto dinamismo / ACID estricto):** Identidad, autenticación, cálculo de nivel, transacciones de XP, rachas diarias, candados desbloqueados, emisión de certificados y suscripciones. Requiere integridad referencial estricta, aislamiento ACID y claves foráneas.
2. **Dominio Pedagógico y Curricular (Volumen masivo / Lectura 99.9% / Estructura jerárquica):** Ramas de especialización (Frontend, Backend, DevOps, Python), cursos en grafo DAG (`ADR-007`), lecciones atómicas con metadatos heterogéneos, bloques de código, tests y pistas. Mapear este contenido en tablas normalizadas relacionales requiere consultas con hasta 6 niveles de `JOIN`, incrementando la latencia y complicando la evolución del esquema pedagógico sin migraciones de base de datos bloqueantes.

## 2. Alternativas Evaluadas

1. **Almacenamiento 100% Relacional en Supabase (PostgreSQL):**
   - *Ventajas:* Un solo cluster de base de datos, simplicidad operativa inicial.
   - *Desventajas:* Sobrecarga del pool de conexiones transaccionales con lecturas pesadas de contenido estático; complejidad al modelar ejercicios heterogéneos (tablas polimórficas o JSONB sobrecargado); cada cambio curricular exige migraciones relacionales.

2. **Almacenamiento en Archivos Planos JSON/YAML en Repositorio (Content-as-Code):**
   - *Ventajas:* Excelente control de versiones en Git.
   - *Desventajas:* Ineficiente para consultas dinámicas, filtros por prerrequisito, búsquedas de texto y consumo escalable desde el backend NestJS en producción concurrente.

3. **Arquitectura de Persistencia Híbrida Políglota (MongoDB + Supabase PostgreSQL):**
   - *Ventajas:*
     - **MongoDB:** Almacén documental $O(1)$ perfecto para estructuras en árbol y grafos de aprendizaje (`tracks`, `courses`, `modules`, `sections`, `lessons`, `question_banks`). Permite servir la lección completa (teoría, snippets de código, opciones de ejercicio y tests) en una sola lectura sin joins.
     - **Supabase (PostgreSQL):** Mantiene la custodia exclusiva de transacciones financieras, autenticación, deduplicación de secuencias correlativas de diplomas, control de estado y auditoría ACID.
     - **Desacoplamiento Operativo:** Las operaciones de publicación y actualización de cursos no bloquean ni compiten por IOPS con el registro de progreso o autenticación de estudiantes.
   - *Desventajas:* Necesidad de gestionar dos conexiones en NestJS (`@nestjs/mongoose` y cliente PostgreSQL/Supabase), mitigable mediante módulos encapsulados con fronteras limpias.

## 3. Decisión Adoptada
Se adopta formalmente la **Persistencia Híbrida Políglota**:
- **Supabase (PostgreSQL 15+):** Custodia de identidad (`auth.users`, `user_profiles`), progreso transaccional (`user_module_progress`, `user_section_stars`), economía lúdica (`xp_transactions`, `streaks`), cuaderno de errores (`user_mistakes_notebook`) y certificaciones oficiales (`certificates`).
- **MongoDB:** Almacén documental de contenido y currículo:
  - Colección `tracks`: Ramas profesionales (`frontend`, `backend`, `devops`, `python`).
  - Colección `courses`: Nodos del grafo DAG con prerrequisitos (`RQ-*`) y Apex Master Gate (`ADR-007`).
  - Colección `modules`: Módulos temáticos y reglas de aprobación.
  - Colección `sections`: Secciones secuenciales de 10 píldoras.
  - Colección `lessons`: Micro-lecciones con ejercicios polimórficos embebidos (teoría Markdown, runner config, opciones, distractores y feedback formativo).
  - Colección `question_banks`: Bancos de reactivos para evaluación diagnóstica y exámenes.
- **Enlace Lógico Desacoplado:** El progreso del estudiante en PostgreSQL referencia el contenido de MongoDB exclusivamente mediante identificadores textuales inmutables (`slugs` o `UUIDs`), eliminando acoplamiento de claves foráneas entre ambos motores.

## 4. Consecuencias
- **Positivas:**
  - Tiempos de respuesta de lecciones en $p95 < 30\text{ ms}$ gracias a lecturas documentales directas sin joins.
  - Flexibilidad ilimitada para agregar nuevos tipos de ejercicios interactivos en MongoDB sin alterar el esquema de PostgreSQL.
  - Aislamiento de fallos: la saturación en lecturas de contenido no impacta la integridad de las transacciones de usuario.
- **Trade-offs:**
  - Requiere configurar la cadena de conexión de MongoDB en las variables de entorno de NestJS (`apps/api`).
  - La integridad entre el progreso del usuario y el contenido se valida en la capa de servicios de NestJS (`ContentService` / `ProgressService`) en lugar de mediante constraints `FOREIGN KEY` de la base de datos relacional.
