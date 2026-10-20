# Entregable: Restauración de Formato Markdown y Layout Full-Width en Espacio de Lecciones

- **ID Entregable:** `frontend-22-lesson-workspace-fullwidth-markdown-restoration`
- **Rama Git:** `feat/frontend-lesson-workspace-fullwidth-markdown`
- **Fecha:** 19/10/2026
- **Autor:** Dylan Gamero
- **Alcance:** `apps/web/` únicamente (Aislamiento estricto de Frontend respetado al 100%, sin tocar `apps/api/` ni bases de datos).

---

## 1. Contexto y Problema Detectado

Tras la sincronización del contrato JSON de preguntas y módulos pedagógicos, se introdujo una regresión visual y funcional en `LessonWorkspace.tsx`:
1. **Pérdida de ancho completo ("ni mide completamente horizontalmente"):** El contenedor de la lección fue acotado a un `max-w-6xl mx-auto` con márgenes excesivos en lugar de utilizar el 100% del viewport horizontal (`w-full h-full min-h-0 flex-1 grid grid-cols-1 lg:grid-cols-2`).
2. **Scroll vertical indeseado a nivel de ventana ("y hay scroll"):** La falta de cotas `h-full min-h-0` en los paneles de teoría y práctica provocó que el crecimiento del contenido expandiera la página completa, desplazando los botones de acción (`COMPROBAR`, `SIGUIENTE LECCIÓN`) fuera del campo de visión del usuario.
3. **Formato Markdown sin renderizar ("salen asteriscos ** y no en negrita"):** Los textos explicativos (`lesson.explanation`), títulos (`lesson.title`), enunciados (`exercise.prompt`), feedback de evaluación (`engine.result.feedback`), pistas (`engine.result.hint`), pares de emparejamiento (`matching`) y chips de código incompleto (`fill_blank`) se renderizaban como cadenas planas sin procesar su sintaxis markdown.
4. **Desbordamiento en ReviewMode:** La ronda de repaso previa al quiz de sección mantenía un diseño `min-h-screen` con scroll en ventana que tampoco procesaba markdown en el prompt.

---

## 2. Solución Implementada

### A. Layout Full-Width y Viewport Acotado (Cero Scroll en Ventana)
- En `apps/web/src/views/lesson/LessonWorkspace.tsx`:
  - Se configuró el contenedor de `LessonView` con `w-full h-full min-h-0 flex flex-col gap-2 sm:gap-3 overflow-hidden`.
  - El selector de pestañas móviles (`Concepto` vs `Práctica`) se mantiene como cabecera táctil `shrink-0 lg:hidden`.
  - El grid principal ocupa el 100% horizontal y vertical en desktop: `w-full h-full min-h-0 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 overflow-hidden`.
  - **Columna Izquierda (Teoría & Pyodide):** Cabecera fija (`shrink-0`), cuerpo scrolleable internamente (`flex-1 min-h-0 overflow-y-auto space-y-3.5 sm:space-y-4 pr-1 sm:pr-2 pt-3 custom-scrollbar`) integrando `InteractiveCodeConsole`, errores habituales y puntos clave.
  - **Columna Derecha (Práctica & Desafío):** Cabecera fija (`shrink-0`), cuerpo scrolleable internamente (`flex-1 min-h-0 overflow-y-auto space-y-3 py-3 pr-1 sm:pr-2 custom-scrollbar`) y barra de acciones inferior siempre visible en pantalla (`shrink-0 pt-2 border-t border-slate-800/80 space-y-2`).
  - **ReviewMode:** Rediseñado con estructura idéntica a `QuizMode` (`relative isolate h-screen max-h-screen overflow-hidden`, contenedor `max-w-4xl h-full max-h-[86vh]` y cuerpo interno con scroll).

### B. Formateo Markdown Integral en Toda la Interfaz
- `lesson.title`: Renderizado con `<MarkdownContent content={lesson.title} inline />`.
- `lesson.explanation`: Renderizado con `<MarkdownContent content={lesson.explanation} />`.
- `lesson.common_errors`: Renderizado con `<MarkdownContent content={lesson.common_errors} />`.
- `lesson.key_takeaways`: Renderizado con `<MarkdownContent content={point} inline />`.
- `exercise.prompt`: Renderizado con `<MarkdownContent content={exercise.prompt} inline />`.
- `engine.result.feedback`: Renderizado con `<MarkdownContent content={engine.result.feedback} />`.
- `engine.result.hint`: Renderizado con `<MarkdownContent content={engine.result.hint} inline />`.
- `engine.current.prompt` (en `ReviewMode`): Renderizado con `<MarkdownContent content={engine.current.prompt} inline />`.
- En `apps/web/src/views/lesson/QuestionRenderer.tsx`:
  - Se aplicó `renderMarkdownInline(p.left.body)` y `renderMarkdownInline(rightItem.body)` para el tipo `matching`.
  - Se aplicó `renderMarkdownInline(filledText)` en los chips de previsualización para el tipo `fill_blank`.

---

## 3. Verificación y Resultados

1. **Chequeo de Tipos TypeScript:**
   - Comando: `pnpm --filter web exec tsc --noEmit`
   - Resultado: Salida limpia, código de salida `0`.
2. **Build de Producción de Next.js (Turbopack):**
   - Comando: `pnpm --filter web build`
   - Resultado: Compilación exitosa en 16.0s. Las 15 rutas estáticas y dinámicas se compilaron sin errores ni advertencias.
3. **Ergonomía de Interfaz:**
   - Pantalla fija en viewport: Cero scroll en la ventana global del navegador.
   - Ancho completo: Aprovechamiento total del ancho de la pantalla sin cortes ni márgenes comprimidos.
   - Botón `COMPROBAR` / `SIGUIENTE LECCIÓN`: Siempre visible en la parte inferior de la columna de práctica.
   - Tipografía rica: Eliminación de asteriscos planos `**bold**` o backticks `code`, visualizados adecuadamente con estilos semánticos de Tailwind CSS.
