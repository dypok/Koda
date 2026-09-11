# ADR-008: Adopción Definitiva de NestJS como Motor de Backend

> **Estado:** Aprobado  
> **Fecha:** 2026-09-10  
> **Autores:** Daniel Echeverría & Equipo de Arquitectura Koda  
> **Trazabilidad:** `11_SYSTEM_ARCHITECTURE.md`, `ADR-001`, `RNF-005`, `RNF-032`  

---

## 1. Contexto y Problema
En las etapas tempranas del diseño arquitectónico (`11_SYSTEM_ARCHITECTURE.md`), se contempló la posibilidad de implementar el backend utilizando NestJS (Node.js/TypeScript) o FastAPI (Python). Con el avance del proyecto, la integración del monorepo (`ADR-001`), la adopción de contratos compartidos en `@koda/types`, la emisión de certificados en backend (`ADR-003`), y la necesidad de una arquitectura empresarial desacoplada mediante inyección de dependencias y módulos limpios, se requería fijar formal y definitivamente la tecnología del motor de backend para eliminar la ambigüedad y guiar el desarrollo de `apps/api`.

## 2. Alternativas Evaluadas

1. **FastAPI (Python 3.12):**
   - *Ventajas:* Sintaxis nativa en Python (coincidiendo con el lenguaje del curso piloto), tipado con Pydantic y soporte asíncrono eficiente.
   - *Desventajas:* Desconexión directa con el ecosistema TypeScript del monorepo (`packages/types`), necesidad de duplicar interfaces o mantener generadores de código OpenAPI/TypeScript, menor estandarización en arquitecturas monolíticas modulares a gran escala y mayor complejidad al coordinar tareas de Node.js como renderizado vectorial de PDFs (`PDFKit`).

2. **Express / Fastify puro (Node.js/TypeScript):**
   - *Ventajas:* Ligereza y flexibilidad máxima.
   - *Desventajas:* Falta de opiniones arquitectónicas out-of-the-box, riesgo de código espagueti en un monolito con más de 9 motores de dominio, y necesidad de armar manualmente sistemas de inyección de dependencias, guards y validación de DTOs.

3. **NestJS (TypeScript) sobre Express:**
   - *Ventajas:*
     - Arquitectura basada en módulos, controladores, servicios y proveedores con inyección de dependencias estricta (IoC).
     - Compatibilidad 100% nativa con `@koda/types` dentro del monorepo PNPM, compartiendo DTOs, enums y esquemas sin capas de traducción.
     - Ecosistema maduro: soporte oficial para Swagger/OpenAPI (`@nestjs/swagger`), TypeORM / Supabase, y Mongoose para MongoDB (`@nestjs/mongoose`).
     - Sistema robusto de `Guards`, `Interceptors`, `Pipes` y `ExceptionFilters` para autenticación JWT, rate limiting y manejo uniforme de errores RFC 7807.
   - *Desventajas:* Mayor boilerplate inicial que micro-frameworks, mitigable con la CLI de NestJS (`@nestjs/cli`).

## 3. Decisión Adoptada
Se adopta **NestJS** como el **motor de backend definitivo y oficial** para la plataforma Koda alojado en `apps/api`:
- **Lenguaje:** TypeScript estricto.
- **Patrón:** Monolito Modular con límites de dominio claros (`AuthModule`, `ProgressModule`, `GamificationModule`, `ContentModule`, `CertificationModule`, etc.).
- **Contratos:** Consumo directo de `@koda/types` para requests y responses.
- **Documentación de API:** Generación automática de OpenAPI 3.0.3 en el endpoint `/api/docs` mediante decoradores Swagger.

## 4. Consecuencias
- **Positivas:**
  - Código homogéneo en todo el repositorio (Frontend Next.js y Backend NestJS en TypeScript).
  - Trazabilidad y refactorización segura con TypeScript en todo el monorepo.
  - Estructura escalable y mantenible para el equipo de desarrollo.
- **Trade-offs:**
  - Requiere que los desarrolladores de backend dominen el ecosistema de TypeScript y los patrones de NestJS (decoradores, inyección de dependencias).
