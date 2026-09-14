# ADR-003: Pipeline de Certificación en Backend y Storage en Supabase Storage (Bucket CDN)

> **Estado:** Aprobado  
> **Fecha:** 2026-09-14 (Actualizado)  
> **Autores:** Equipo de Arquitectura Koda  
> **Trazabilidad:** `17_CERTIFICATION.md`, `11_SYSTEM_ARCHITECTURE.md`, `RF-CERT-001–006`, `RF-PDF-001–004`  

---

## 1. Contexto y Problema
El sistema de certificación emite diplomas digitales acreditando que el estudiante aprobó con $\ge 80\%$ todos los módulos y el proyecto integrador de un lenguaje.
Se requiere una solución de almacenamiento cloud sin fricción de despliegue, con CDN global ultrarrápido, compatibilidad con la base de datos transaccional en Postgres y sin dependencias de tokens OAuth2 interactivos que caduquen.

## 2. Alternativas Evaluadas
1. **Generación en cliente (HTML5 Canvas / jsPDF):**
   - *Desventajas:* Crítico riesgo de seguridad y falsificación; el usuario puede manipular el DOM o inyectar notas y nombres arbitrarios. Cero validez criptográfica.
2. **Google Drive API v3:**
   - *Desventajas:* Alta fricción en deploy (cuotas de 0 bytes para Service Accounts en carpetas personales, tokens OAuth2 con caducidad de 7 días sin verificación de dominio de Google Cloud, latencia de subida elevada de 1-2s y falta de CDN nativo).
3. **Supabase Storage (Bucket Público con RLS):**
   - *Ventajas:* Ya integrado en el stack (`sertfbduqivvjrmeblvh`), 0 configuración extra en deploy (usa `SUPABASE_URL` y llaves existentes), CDN global integrado con descargas `< 100 ms`, persistencia directa en la tabla `certificates` de Postgres, y políticas RLS transparentes.

## 3. Decisión Adoptada
Se adopta **Generación 100% Backend con NestJS (`CertificationModule`) y persistencia en Supabase Storage (Bucket `certificates`)**:
- El cliente nunca genera PDFs ni tiene acceso a credenciales de almacenamiento.
- Se genera un código único `KODA-{LANG}-{SEQ6}` (ej. `KODA-PY-000001`) y un QR apuntando a `/verificar/{code}`.
- **Caché y deduplicación estricta:** Antes de generar un nuevo binario, el backend consulta `storage_path` y `pdf_sha256`. Si el usuario ya cuenta con un certificado emitido válido, no se vuelve a crear; se entrega la URL pública de inmediato ($< 100\text{ ms}$).
- Descarga segura mediante CDN directo o endpoint `GET /api/v1/certificates/{id}/download-info`.

## 4. Consecuencias
- **Positivas:**
  - Imposibilidad de manipulación de notas o nombres por parte del cliente.
  - Almacenamiento rápido, seguro y distribuido por CDN global sin costos de egress en el tier inicial (~10,000 certificados gratuitos).
  - Cero dependencias externas complejas ni caducidad de tokens OAuth2.
- **Trade-offs:**
  - Archivos limitados a 5 MB (más que suficiente para diplomas en PDF de ~150 KB).
