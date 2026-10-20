# Entregable Frontend 22: Navegación Ergonómica por Teclado al Completar Sección (Retorno con Enter al Roadmap)

## 1. Resumen Ejecutivo
Se implementó el soporte para navegación ergonómica mediante la tecla **`Enter`** (y `NumpadEnter`) en la pantalla de culminación de sección (`mode === 'done'`) en `LessonWorkspace.tsx` y en la pantalla de revisión de evaluaciones (`AttemptReviewScreen`), permitiendo que el estudiante regrese al roadmap principal (`/`) de forma inmediata sin necesidad de utilizar el cursor o ratón.

## 2. Diagnóstico
Al finalizar la última lección de una sección y aprobar el quiz de validación (o examen), la interfaz renderiza la pantalla de trofeo con el titular `"¡Sección completada!"` y el enlace `"Volver a la ruta"`. Sin embargo, no existía un escucha de eventos de teclado en esta vista específica, por lo que presionar `Enter` no producía ninguna acción a menos que el enlace tuviese foco explícito o fuese pulsado con el ratón.

## 3. Solución Implementada
1. **Atajo Global en `LessonWorkspace` (`apps/web/src/views/lesson/LessonWorkspace.tsx`)**:
   - Se integró `useRouter` de `next/navigation`.
   - Se añadió un hook `useEffect` activo exclusivamente durante `mode === 'done'`.
   - Al detectar `Enter` o `NumpadEnter`:
     - Si la sección fue aprobada (`passed >= 70%`): redirige transparentemente al roadmap (`/`).
     - Si no alcanzó el umbral (`!passed`): reinicia el quiz inmediatamente para un nuevo intento.
   - Se protegió contra eventos en elementos de entrada (`input`, `textarea`).
2. **Indicadores Visuales de Tecla (`<kbd>↵ Enter</kbd>`)**:
   - Se añadieron badges de atajo visibles en escritorio en los botones `"Volver a la ruta"` y `"REINTENTAR QUIZ"`.
3. **Soporte en Pantalla de Resumen de Evaluaciones (`apps/web/src/app/evaluaciones/resumen/[attemptId]/page.tsx`)**:
   - Se añadió un listener análogo para que el botón `"Continuar al siguiente módulo"` / `"Repasar conceptos clave"` responda de inmediato al pulsar `Enter`.

## 4. Pruebas y Verificación
- **Tipado TypeScript**: `pnpm --filter web exec tsc --noEmit` completado con 0 errores.
- **Compilación de Producción**: `pnpm --filter web build` exitoso (15/15 páginas generadas en 5.2s).
- **Flujo de Usuario**:
  - Al ver `"¡Sección completada!"`, presionar `Enter` navega inmediatamente a `/`.
  - El botón `"Volver a la ruta"` muestra visualmente la tecla `↵ Enter`.
