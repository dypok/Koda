-- ==============================================================================
-- KODA Platform - Course Seeding Script
-- Populates Languages, Courses, Modules, Sections, Lessons and Questions
-- Generated from declarative content in content/languages/
-- Engine: PostgreSQL >= 15
-- ==============================================================================

-- 1. Insert Programming Languages
INSERT INTO programming_languages (id, code, name, slug, status, sort_order, content_version, is_active)
VALUES
  ('a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PYTHON', 'Python 3.12', 'python', 'available', 1, 1, true),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'JAVASCRIPT', 'JavaScript Moderno', 'javascript', 'coming_soon', 2, 1, true),
  ('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'TYPESCRIPT', 'TypeScript', 'typescript', 'coming_soon', 3, 1, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  status = EXCLUDED.status,
  updated_at = now();

-- 2. Insert Official Courses
INSERT INTO courses (id, language_id, code, name, slug, description, level, status, sort_order, total_modules, is_active)
VALUES
  (
    'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'PY_CORE',
    'Python: Fundamentos a Avanzado',
    'python-fundamentos-a-avanzado',
    'Ruta integral de 12 módulos canónicos para dominar la programación en Python desde cero hasta conceptos avanzados y proyectos del mundo real.',
    'all_levels',
    'published',
    1,
    12,
    true
  ),
  (
    'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    'JS_CORE',
    'JavaScript Moderno: Fundamentos a Avanzado',
    'javascript-moderno-fundamentos-a-avanzado',
    'Domina el lenguaje nativo de la web, manipulando datos, eventos, asincronía con Promises y async/await, y APIs modernas.',
    'all_levels',
    'published',
    2,
    10,
    true
  ),
  (
    'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
    'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    'TS_CORE',
    'TypeScript: Tipado Estático y Desarrollo Robusto',
    'typescript-tipado-estatico-y-desarrollo-robusto',
    'Aprende tipado estático, interfaces, types personalizados, genéricos y buenas prácticas para proyectos empresariales con TypeScript.',
    'all_levels',
    'published',
    3,
    10,
    true
  )
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  updated_at = now();

-- 3. Insert Canonical Python Modules (12 Modules)
INSERT INTO modules (id, course_id, language_id, code, title, slug, description, position, status, total_sections, total_lessons)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_01', 'Fundamentos de Python', 'fundamentos-de-python', 'Tu primer print(), cadenas de texto, números, sintaxis limpia y comentarios.', 1, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111102', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_02', 'Variables y Tipos de Datos', 'variables-y-tipos-de-datos', 'Almacenamiento en memoria, int, float, str, bool y la función inspectora type().', 2, 'published', 10, 100),
  ('11111111-1111-4111-8111-111111111103', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_03', 'Operadores y Expresiones', 'operadores-y-expresiones', 'Operadores aritméticos (+, -, *, /, //, %, **), comparadores lógicos y precedencia.', 3, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111104', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_04', 'Estructuras de Control: Condicionales', 'condicionales', 'Toma de decisiones lógicas con if, elif, else y condiciones booleanas.', 4, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111105', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_05', 'Bucles e Iteración', 'bucles-e-iteracion', 'Repetición controlada con bucles for, while, range(), break y continue.', 5, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111106', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_06', 'Funciones y Modularización', 'funciones', 'Definición de funciones reutilizables con def, parámetros, argumentos y return.', 6, 'published', 10, 100),
  ('11111111-1111-4111-8111-111111111107', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_07', 'Estructuras de Datos: Listas y Tuplas', 'colecciones', 'Colecciones ordenadas, indexación, mutabilidad y métodos de lista.', 7, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111108', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_08', 'Manipulación de Cadenas de Texto', 'strings-avanzados', 'Métodos de cadenas, slicing y formateo moderno con f-strings.', 8, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111109', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_09', 'Manejo de Errores y Excepciones', 'manejo-de-errores', 'Detección y tratamiento de errores con bloques try, except, else y finally.', 9, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111110', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_10', 'Persistencia de Archivos y Módulos', 'archivos-y-modulos', 'Lectura/escritura de archivos con with open() e importación modular.', 10, 'published', 8, 80),
  ('11111111-1111-4111-8111-111111111111', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_11', 'Programación Orientada a Objetos', 'programacion-orientada-a-objetos', 'Modelado de entidades con clases, objetos, atributos, métodos y el método __init__.', 11, 'published', 10, 100),
  ('11111111-1111-4111-8111-111111111112', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'a1e2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'PY_MOD_12', 'Proyecto Final e Integración', 'proyecto-final-y-certificacion', 'Aplicación de todos los conceptos en un proyecto real, examen integral y graduación.', 12, 'published', 10, 100)
ON CONFLICT (course_id, code) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  updated_at = now();

-- 4. Insert Initial JavaScript Module
INSERT INTO modules (id, course_id, language_id, code, title, slug, description, position, status, total_sections, total_lessons)
VALUES
  ('22222222-2222-4222-8222-222222222201', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'JS_MOD_01', 'Fundamentos de JavaScript', 'fundamentos-de-javascript', 'Sintaxis moderna, console.log, variables let/const y tipos primitivos.', 1, 'coming_soon', 8, 80)
ON CONFLICT (course_id, code) DO NOTHING;

-- 5. Insert Initial TypeScript Module
INSERT INTO modules (id, course_id, language_id, code, title, slug, description, position, status, total_sections, total_lessons)
VALUES
  ('33333333-3333-4333-8333-333333333301', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'TS_MOD_01', 'Fundamentos de TypeScript', 'fundamentos-de-typescript', 'Tipos primitivos, inferencia de tipos y compilación con tsc.', 1, 'coming_soon', 8, 80)
ON CONFLICT (course_id, code) DO NOTHING;
