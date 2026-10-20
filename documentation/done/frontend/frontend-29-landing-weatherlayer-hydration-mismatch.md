# Entregable Frontend: Eliminación de Hydration Mismatch en WeatherLayer y Componentes Ambientales

## 📌 Metadatos
- **ID:** `FRONTEND-29`
- **Título:** Resolución del error de hidratación React SSR/Cliente en WeatherLayer y componentes ambientales de la Landing
- **Rama:** `feat/frontend-landing-hydration-mismatch-fix` (hija directa de `develop`)
- **Fecha:** 20/10/2026
- **Autor:** Dylan Gamero & Antigravity AI

---

## 🎯 Causa Raíz Identificada

El usuario recibía un error recuperable de React en la consola del navegador al cargar la Landing Page:
```text
Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.
...
<RoadmapSection>
  <WeatherLayer>
    <div aria-hidden="true" data-glow="14" ...> vs <div className="pointer-events-none absolute inset-0 ...">
```

### Diagnóstico Técnico:
1. **Diferencia de Entorno Server vs Client en `WeatherLayer.tsx`:**
   - Durante SSR (`typeof window === 'undefined'`), las validaciones `isLowEndDevice()` y `saveDataMode()` no se ejecutaban, por lo que el componente calculaba un array de 8 partículas y renderizaba el contenedor `<div className="pointer-events-none absolute inset-0 ...">` con los elementos span correspondientes.
   - En el cliente durante la hidratación inicial (`typeof window !== 'undefined'`), la comprobación `isLowEndDevice()` (basada en núcleos de CPU o memoria disponible `<= 4`) o `saveDataMode()`, o bien `useReducedMotion()`, evaluaba a `true`.
   - Cuando esto ocurría, `particles` se convertía en un array vacío `[]` y se disparaba la condición de salida temprana `if (reduceMotion || particles.length === 0) return null;`.
   - Al retornar `null` en el cliente mientras el servidor había emitido un `<div>`, el reconciliador de React (Fiber) intentaba empatar el nodo DOM del servidor con el siguiente hijo en el árbol (`<div aria-hidden="true" data-glow="14" ...>` en la línea 14 de `RoadmapSection.tsx`), provocando el fallo de hidratación.

2. **Condiciones Análogas en Otros Componentes Ambientales:**
   - `RouteThread.tsx`, `AsciiVortexBackground.tsx`, `OrbitFieldBackground.tsx`, `CodeConfetti.tsx` y `KodaGuide.tsx` presentaban sentencias `if (reduceMotion) return null;` evaluadas en tiempo de render, provocando discrepancias estructurales de DOM entre SSR y navegadores con preferencias de movimiento reducido.

---

## 🛠️ Solución Implementada

### 1. `apps/web/src/components/landing/WeatherLayer.tsx`
- **Garantía Estructural del DOM:** El contenedor wrapper `<div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden select-none contain-strict motion-reduce:hidden', className)}>` se renderiza de forma idéntica e incondicional tanto en SSR como en el cliente.
- **Montaje Seguro Post-Hidratación:** Se introdujo el estado `mounted` vía `useEffect(() => setMounted(true), [])`. Durante SSR e hidratación inicial (`!mounted`), el array de partículas es `[]`. Inmediatamente tras la hidratación, `useEffect` se activa y genera las partículas CSS únicamente si el dispositivo no está en modo de bajo rendimiento o ahorro de datos.
- **Soporte Accesibilidad por CSS:** Se añadió la clase Tailwind `motion-reduce:hidden` para respetar las preferencias de accesibilidad a nivel de hojas de estilo nativas sin alterar la forma del árbol VDOM.

### 2. `apps/web/src/components/landing/RouteThread.tsx`
- Se eliminó el `if (reduceMotion) return null;` temprano en Javascript.
- Se añadió la clase `motion-reduce:!hidden` en el contenedor principal, garantizando que el árbol HTML emitido por el servidor sea 100% idéntico al cliente.

### 3. `apps/web/src/components/landing/AsciiVortexBackground.tsx`
- Se removió `if (reduceMotion) return null;`.
- Se aplicó `motion-reduce:hidden` al contenedor raíz, mientras el ciclo de animación Pixi ya cuenta con salvaguardas internas para no instanciarse si `reduceMotion` está activo.

### 4. `apps/web/src/components/landing/OrbitFieldBackground.tsx`
- Se eliminó el retorno temprano `null` por `reduceMotion`.
- Se estandarizó la presencia del div contenedor con `motion-reduce:hidden`.

### 5. `apps/web/src/views/landing/preview/CodeConfetti.tsx`
- Se eliminó el retorno temprano `null` por `reduceMotion`.
- Se aplicó `motion-reduce:hidden` al canvas wrapper.

### 6. `apps/web/src/components/landing/KodaGuide.tsx`
- Se removió `if (reduceMotion) return null;` y el import innecesario `useReducedMotion`.
- Se incorporó `motion-reduce:!hidden` en el contenedor animado.

---

## 🧪 Pruebas de Verificación Ejecutadas

1. **Chequeo de Tipos Estricto:**
   - `pnpm --filter web exec tsc --noEmit` $\rightarrow$ **0 errores**.
2. **Compilación de Producción Next.js:**
   - `pnpm --filter web build` $\rightarrow$ **16/16 páginas estáticas prerenderizadas con éxito en Turbopack sin advertencias de mismatch**.
3. **Aislamiento de Entorno:**
   - No se tocó ningún archivo de `apps/api/` ni migraciones de base de datos.
