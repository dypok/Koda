# Entregable Frontend: Redirección Automática al Roadmap en AdminGuard para Usuarios sin Rol Administrador

## 📌 Metadatos
- **ID:** `FRONTEND-30`
- **Título:** Redirección automática al Roadmap/Login desde rutas administrativas para usuarios sin privilegios
- **Rama:** `feat/frontend-admin-guard-roadmap-redirect` (hija directa de `develop`)
- **Fecha:** 22/10/2026
- **Autor:** Dylan Gamero & Antigravity AI

---

## 🎯 Causa y Requerimiento

El usuario accedió a `/admin` o a una subruta administrativa y se encontró con una pantalla bloqueante estática:
```text
Acceso Restringido
Esta seccion requiere permisos verificados de Administrador de Koda Academy.
terminal status:
ERR_UNAUTHORIZED: Rol insuficiente
Usuario activo: gamerodylan00@gmail.com
[Iniciar con Credenciales Admin](http://app.localhost:3000/login) [Volver a Plataforma de Estudiantes](http://app.localhost:3000/)
```

### Solicitud:
1. Explicar qué usuarios tienen permiso para entrar a la ruta de administración.
2. Si el usuario no tiene permisos de administrador, redirigirlo de forma automática al roadmap de estudiantes sin obligarlo a interactuar con una pantalla de error terminal.

---

## 🛠️ Solución Implementada

### 1. `apps/web/src/components/admin/AdminGuard.tsx`
- **Navegación Reactiva Inmediata:** Se añadió un `useEffect` sincronizado con la hidratación del estado de sesión (`hasHydrated`). Si `!isAdmin`, se invoca de inmediato:
  ```typescript
  router.replace(isAuthenticated ? '/' : '/login');
  ```
- **Pantalla de Transición Suave (`KodaLoadingScreen`):** Se reemplazó el card rojo estático de bloqueo por la pantalla branded `KodaLoadingScreen` mostrando:
  - Título: `"Redirigiendo al Roadmap..."`
  - Subtítulo: `"Esta sección requiere permisos de administrador. Volviendo a la plataforma de estudiantes..."`
  - Terminal hint: `"> auth :: redirect_unauthorized -> /"`
- **Eliminación de dead-ends:** Los estudiantes autenticados que naveguen a `/admin` son devueltos fluidamente al roadmap interactivo (`/`) en el subdominio de la aplicación.

---

## 🧪 Pruebas de Verificación Ejecutadas

1. **Chequeo de Tipos:**
   - `pnpm --filter web exec tsc --noEmit` $\rightarrow$ **0 errores**.
2. **Aislamiento Estricto:**
   - Únicamente se modificó `AdminGuard.tsx` en `apps/web/`.
