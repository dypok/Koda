# Registro de Cambios — 17 de Septiembre de 2026

**Zona Horaria:** America/Bogota (UTC-5)  
**Rama:** `feat/KA-152-keyboard-shortcuts`  
**Historia de Jira:** `KA-152` (`LESS-02`)

---

## Resumen Ejecutivo

Se implementó el sistema integral de atajos de teclado ergonómicos y feedback visual táctil para el Workspace de Lecciones y Quizzes de Koda (`apps/web/src/views/lesson/`).

---

## Detalle de Cambios Técnicos

1. **`useLessonKeyboardShortcuts.ts` (`apps/web/src/hooks/useLessonKeyboardShortcuts.ts`):**
   - Hook reactivo que intercepta eventos globales de teclado ignorando inputs editables.
   - Soporte para números (`1-4`), letras (`A-D`, `a-d`), validación y avance con `Enter`/`Espacio` y retroceso/avance con `ArrowLeft`/`ArrowRight`.
   - Estado de feedback táctil efímero (`pressedIndex`, `pressedAction`) para animaciones físicas.

2. **`QuestionRenderer.tsx` (`apps/web/src/views/lesson/QuestionRenderer.tsx`):**
   - Keycaps `<kbd>` de inspiración táctil arcade (`hidden sm:flex`) integradas en cada opción.
   - Micro-animación de hundimiento (`translate-y-0.5`, `scale-[0.98]`) y resplandor lumínico ámbar al presionar la tecla.
   - Atributos de accesibilidad `aria-keyshortcuts` asociados a cada botón.

3. **`LessonWorkspace.tsx` (`apps/web/src/views/lesson/LessonWorkspace.tsx`):**
   - Conexión del hook en la vista de teoría/ejercicios (`LessonView`) y en el modo evaluativo (`QuizMode`).
   - Badges visuales de `Enter ↵` integradas en los botones de "Comprobar respuesta", "Siguiente lección", "Reintentar" y "Continuar".
   - Indicador de atajos disponible en la barra superior.

---

## Verificación

- `pnpm build` en `apps/web`: 100% exitoso con Turbopack (0 errores, 0 warnings).
- Navegación fluida y accesible probada en lecciones de Python y Lua.
