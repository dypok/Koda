# Entregable Frontend: Roadmap API Workbench (Diagnóstico y Desacople de Mocks)

> **Historia / Tarea:** Validación y Diagnóstico de Conectividad con Backend Real (Supabase & MongoDB)  
> **Épica:** `EPIC-03: Visual Learning Path & Roadmap Graph`  
> **Rama de Trabajo:** `feat/backend-mongo-curriculum-seed`  
> **Fecha:** 20/09/2026  
> **Autor:** Dylan Gamero  

---

## 1. Objetivo y Resumen

Se construyó una página de prueba rápida, interactiva y sin sobrecarga decorativa en la ruta `/test-roadmap` (`apps/web/src/app/test-roadmap/page.tsx`), destinada a validar la conectividad en vivo con los endpoints del backend en `http://localhost:4000/api/v1`. 

Esta herramienta permite certificar el reemplazo progresivo de mocks por las fuentes de datos reales:
1. **Grafo Visual DAG en Supabase / PostgreSQL**: Nodos con coordenadas `(x, y)`, variantes, estados y aristas vectoriales.
2. **Currículo Canónico y Tríada Evaluativa en MongoDB**: Pistas de carrera, cursos DAG, módulos secuenciales, lecciones atómicas, retos de consola, quizzes y presets de efectos visuales de GPU.
3. **Catálogo de Lenguajes en PostgreSQL / Prisma**: Lenguajes activos con sus slugs y esquemas de color.

---

## 2. Rutas y Vistas Creadas

- **Ruta:** `/test-roadmap`
- **Archivo Fuente:** [`apps/web/src/app/test-roadmap/page.tsx`](file:///home/dypok/Projects/Koda/apps/web/src/app/test-roadmap/page.tsx)
- **Tipo:** Client Component reactivo (`'use client'`) con tipado estricto en React 19 y Next.js 16.3.5 Turbopack.

---

## 3. Endpoints Validados en la Suite

| Endpoint | Método | Fuente Backend | Descripción del Retorno |
| :--- | :---: | :---: | :--- |
| `/roadmap/:lang/courses` | `GET` | Supabase / PG | Grafo visual DAG de cursos con coordenadas, estado activo/bloqueado y aristas. |
| `/roadmap/courses/:courseId/lessons` | `GET` | Supabase / PG | Grafo visual DAG de lecciones con posiciones y aristas de conexión. |
| `/learning/roadmap/:languageSlug` | `GET` | MongoDB Mongoose | 12 módulos secuenciales, subsecciones, maestría porcentual y estrellas posibles. |
| `/learning/lessons/:lessonId` | `GET` | MongoDB Mongoose | Micro-lección con la Tríada Evaluativa (consola, quiz conceptual y predicción). |
| `/content/tracks` | `GET` | MongoDB Mongoose | Catálogo de 4 pistas profesionales activas (Python, Frontend, Backend, DevOps). |
| `/content/tracks/:slug` | `GET` | MongoDB Mongoose | Pista profesional y sus cursos ordenados por tier/lane con efectos de arista. |
| `/content/courses/:slug` | `GET` | MongoDB Mongoose | Estructura completa de módulos y secciones de un curso pedagógico. |
| `/content/visual-effects` | `GET` | MongoDB Mongoose | Catálogo de presets de aristas aceleradas por GPU (`laser_flow`, `energy_beam`, etc.). |
| `/languages` | `GET` | PostgreSQL Prisma | Catálogo maestro de lenguajes habilitados en la plataforma. |

---

## 4. Características de la Interfaz

1. **Barra de Parámetros Rápida:**
   - Selector / input para cambiar dinámicamente `:lang` (`python`, `frontend`, `backend`, `devops`).
   - Selector / input para `:courseId` (`python-core`, `frontend-core`, `backend-core`).
   - Selector / input para `:lessonId` (`py-m01-s01-l01`).
   - Configuración editable de la URL base del backend (por defecto `http://localhost:4000/api/v1`).

2. **Panel de Métricas en Tiempo Real:**
   - Cantidad de endpoints probados y porcentaje de éxito (`X/9 OK`).
   - Latencia promedio de red en milisegundos (`ms`).
   - Indicador de conectividad activa (`✓ Backend API Activo`).

3. **Tarjetas de Diagnóstico por Endpoint:**
   - Insignia de método HTTP y categoría (`Supabase Graph`, `MongoDB Curriculum`, `Prisma / System`).
   - Medición individual de latencia y código de estado HTTP (`200 OK`, `404`, etc.).
   - Visualizadores semánticos especializados:
     - Tabla compacta de nodos para grafos visuales (código, etiqueta, variante, coordenadas, XP, candado).
     - Desglose modular para currículo en MongoDB (módulos, secciones y maestría).
     - Tarjetas de la Tríada Evaluativa para lecciones (consola, quiz y predicción).
     - Fichas de pistas y presets de efectos GPU.
   - Visor colapsable de JSON en bruto con botón de un clic para copiar al portapapeles.

4. **Acción Global:**
   - Botón *"🚀 Probar Todos"* para disparar la batería completa de pruebas simultáneamente.

---

## 5. Pruebas y Verificación

- **Verificación de Tipos:** `pnpm --filter web exec tsc --noEmit` ejecutado con éxito (0 errores).
- **Compilación de Producción:** `pnpm --filter web build` completado en Next.js 16.3.5 Turbopack con 13/13 rutas estáticas generadas correctamente.
- **Prueba HTTP:** `curl -s -I http://localhost:3000/test-roadmap` retornó `HTTP/1.1 200 OK`.
