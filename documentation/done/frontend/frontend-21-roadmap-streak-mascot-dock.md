# 🦊 Entregable Frontend 21: Mascota Oficial Koda con Racha en Menú Inferior del Roadmap

> **ID de HU y Épica:** EPIC-04 / EPIC-06 (Gamificación y Visualización del Roadmap)  
> **Rama:** `feat/frontend-roadmap-streak-mascot`  
> **Fecha:** 19-10-2026  
> **Autor:** Dylan Gamero / Frontend Assistant  

---

## 1. Problema y Necesidad

En el dock flotante inferior central del Roadmap interactivo (`RoadmapFusionView.tsx`), el indicador de racha diaria y acceso al popover de progreso se encontraba representado por un icono genérico vectorial (`<Flame />` de Phosphor Icons). Para reforzar la identidad visual del producto y la conexión emocional del usuario con la gamificación, se requería sustituir dicho icono por la **mascota oficial Koda**:
- Cuando la racha diaria esté **encendida** (`isActiveToday = true`), mostrar a Koda con la racha encendida (`streak_active`: ojos brillantes en estrella y llama dorada/naranja ardiente, resplandor ambarino y micro-animación).
- Cuando la racha diaria **no esté encendida** (`isActiveToday = false`), mostrar a Koda en estado de reposo atenuado (en escala de grises con transición al hacer hover, o estado `streak_lost` si la racha es 0), comunicando claramente que la práctica de hoy está pendiente.

---

## 2. Solución Implementada (Aislamiento Estricto Frontend)

En estricto cumplimiento de **`koda-frontend-workflow`** (sin tocar `apps/api/` ni bases de datos):

### A. Integración de `<KodaMascot />` en `RoadmapFusionView.tsx`
- Se reemplazó el icono Phosphor `<Flame />` por el componente oficial [`<KodaMascot />`](apps/web/src/components/brand/KodaMascot.tsx).
- Se configuró la resolución reactiva de estados:
  ```tsx
  <div className="relative flex items-center justify-center h-7 w-7 shrink-0">
    <KodaMascot
      state={isActiveToday ? 'streak_active' : streak > 0 ? 'idle' : 'streak_lost'}
      size={28}
      glow={isActiveToday}
      animate={isActiveToday ? 'bounce' : 'none'}
      className={cn(
        'h-7 w-7 object-contain transition-transform group-hover:scale-110',
        !isActiveToday && 'opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100'
      )}
    />
    {isActiveToday && (
      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-1 ring-slate-950" />
      </span>
    )}
  </div>
  ```
- **Tamaño calibrado a 28px (`h-7 w-7`):** Perfectamente alineado con la altura del dock y el texto de dos líneas (`{streak}D` y `{xp} XP`).
- **Feedback interactivo:** Al hacer hover, la mascota escala suavemente (`scale-110`) y recupera el color si estaba en reposo. Al hacer clic, abre el `RoadmapStreakPopover`.

---

## 3. Pruebas y Verificación

1. **Typecheck TypeScript:**
   - `pnpm --filter web exec tsc --noEmit`: **Exitoso** (código 0, 0 errores).
2. **Next.js Production Build:**
   - `pnpm --filter web build`: **Exitoso** (código 0, todas las rutas estáticas y dinámicas compiladas limpiamente).
3. **Verificación Visual:**
   - Con racha activa (`isActiveToday = true`), Koda luce triunfante con la llama encendida y resplandor ambarino.
   - Con racha pendiente o en 0, Koda se atenúa en escala de grises hasta que el estudiante completa una lección.
