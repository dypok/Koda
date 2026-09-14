# 🟡 EPIC 9 — Pipeline de Certificación, Generación PDF, QR y Google Drive
`Sprint 4 · v1.0 · Color Jira: Dorado · Código: CERT`

> Esta épica implementa el **Certification Engine** de Koda (`17_CERTIFICATION.md`, `ADR-003`, `05_FUNCTIONAL_REQUIREMENTS.md` RF-CERT-*): la emisión atómica de diplomas digitales, generación 100% en backend de PDF vectorial con código QR ISO 18004, almacenamiento seguro en Google Drive API v3 (Service Account) y portal de verificación pública sin login.

---

### CERT-01 — Emisión Atómica y Asignación de Código Correlativo `KODA-PY-{SEQ}`
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Lead  
**Rama sugerida:** `feature/emision-certificados-correlativo`

**Historia de usuario:**
> "Como estudiante que culminó exitosamente los 12 módulos de Python 3.12 y aprobó el Proyecto Integrador, quiero que el sistema emita mi certificado oficial,
> para obtener un documento legal y verificable que respalde mis competencias de programación."

**Criterios de aceptación:**
- Condiciones de emisión obligatorias (`17` §2):
  - 100% de las secciones de los 12 módulos de Python completadas.
  - Examen Final del Módulo 12 (Proyecto Integrador) aprobado con calificación $\ge 80\%$.
  - Usuario autenticado con nombre legal completo y documento de identidad registrado.
- Generación de código correlativo único en formato `KODA-PY-{SEQ6}` (ej. `KODA-PY-000001`, `KODA-PY-000002`) garantizado mediante secuencia y lock atómico en Supabase (`certificate_sequences`).
- Deduplicación absoluta: si un usuario ya tiene un certificado emitido para Python, el sistema nunca genera un segundo código; devuelve el registro existente (`idempotency`).
- Transacción ACID: registra en `certificates` el código, fecha de emisión UTC, nombre del titular y estado `valid`.

**Subtasks:**
- [ ] [BD] Tabla `certificates` y tabla de secuencias `certificate_sequences` con constraint UNIQUE por `(user_id, language_id)`.
- [ ] [BACKEND] Disparo asíncrono de emisión ante evento de dominio `course.completed` mediante worker BullMQ `GenerateCertificateWorker` (`ADR-010`, `ADR-011`).
- [ ] [BACKEND] Servicio `CertificationService.issueCertificate(userId, languageSlug)` con transacción atómica en Supabase.
- [ ] [BACKEND] Generar enlace canónico de verificación: `https://koda.app/verificar/KODA-PY-{SEQ}`.
- [ ] [TEST] Test de concurrencia validando que dos solicitudes simultáneas de emisión nunca generen el mismo correlativo.

**DoD adicional para esta US:**
- Cero saltos o colisiones en la numeración correlativa del curso.

---

### CERT-02 — Pipeline de Generación PDF Vectorial con Código QR ISO 18004
**Tipo:** Story | **SP:** 5 | **Prioridad:** Muy Alta | **Asignado:** Backend Developer  
**Rama sugerida:** `feature/generacion-pdf-qr`

**Historia de usuario:**
> "Como titular del certificado, quiero descargar un PDF de alta calidad estética y fidelidad de impresión,
> con sello digital, código QR escaneable y formato institucional para incluir en mi portafolio o imprimirlo."

**Criterios de aceptación:**
- Generación asíncrona 100% en backend (Node.js con PDFKit / Canvas vectorial) para garantizar seguridad y evitar manipulación en cliente (`ADR-003`).
- Descarga física del binario mediante el **endpoint REST `GET /api/v1/certificates/:id/pdf`** con streaming de buffer y headers `Content-Disposition: attachment` (`ADR-012`).
- Elementos del documento PDF (formato A4 Horizontal / Landscape):
  - Marco ornamental institucional con gradiente dorado/índigo y sello de Koda 🦊 en relieve.
  - Título formal: *"Certificado de Competencia Profesional en Programación"*.
  - Nombre completo del graduado en tipografía serif destacada.
  - Documento de identidad con máscara de privacidad legal: `CC ***678` (`19` §14).
  - Nombre del curso: *"Python 3.12: De Cero a Desarrollador"* con carga horaria oficial estimada (40 horas).
  - Fecha de graduación oficial (formato `DD de Mes de YYYY`).
  - Código único impreso en tipografía monoespaciada: `KODA-PY-000001`.
  - **Código QR ISO 18004:** generado en alta resolución vectorial (mínimo 300 DPI) con nivel de corrección de error M (15%), apuntando a la URL pública de verificación.
- Cálculo de hash criptográfico SHA-256 del binario generado y persistido en el campo `pdf_sha256`.

**Subtasks:**
- [ ] [BACKEND] Implementar servicio `PdfGeneratorService` con PDFKit y utilidades de renderizado vectorial.
- [ ] [BACKEND] Generador de QR dinámico con biblioteca `qrcode` en buffer binario.
- [ ] [BACKEND] Controlador REST `CertificatesController` para streaming de descarga `GET /api/v1/certificates/:id/pdf` (`ADR-012`).
- [ ] [BACKEND] Calcular digest SHA-256 del buffer PDF antes de su almacenamiento en Google Drive.
- [ ] [TEST] Verificar legibilidad del QR con escáner móvil físico a 30 cm de distancia.

**DoD adicional para esta US:**
- Tiempo de renderizado del binario PDF inferior a 1.2 segundos en el servidor.

---

### CERT-03 — Almacenamiento en la Nube con Google Drive API v3 (Service Account)
**Tipo:** Story | **SP:** 5 | **Prioridad:** Alta | **Asignado:** Backend Lead & DevOps  
**Rama sugerida:** `feature/storage-google-drive-api`

**Historia de usuario:**
> "Como arquitecto del sistema, quiero almacenar los certificados en Google Drive mediante una Service Account y streaming directo,
> para asegurar persistencia ilimitada de diplomas a costo $0 sin saturar el almacenamiento de Supabase."

**Criterios de aceptación:**
- Integración oficial con **Google Drive API v3** mediante credenciales de cuenta de servicio (`service-account.json` en variables de entorno seguras `ADR-003`).
- Subida automática del binario PDF a la carpeta centralizada `Koda_Certificados`:
  - Nombre de archivo estandarizado: `Certificado_KODA-PY-{SEQ}.pdf`.
  - Tipo MIME: `application/pdf`.
- Persistencia del identificador de archivo devuelto en la columna `google_drive_file_id` de la tabla `certificates`.
- **Streaming Inteligente de Descargas:** al solicitar la descarga (`GET /api/v1/certificates/:id/download`):
  - El backend verifica si ya existe `google_drive_file_id`. Si existe, transmite el archivo por streaming directo con cabecera `Content-Disposition: attachment; filename="..."` sin volver a generar el PDF.
  - Si el archivo no existiera por contingencia, lo regenera y vuelve a subir automáticamente.

**Subtasks:**
- [ ] [DEVOPS] Crear proyecto en Google Cloud Console, habilitar Drive API v3 y generar clave JSON de Service Account.
- [ ] [BACKEND] Implementar `GoogleDriveStorageService` en `apps/api/src/modules/certification/` con autenticación JWT de Google.
- [ ] [BACKEND] Endpoint de descarga con streaming de chunks y cabeceras de caché HTTP.
- [ ] [TEST] Test de integración subiendo un archivo de prueba a Drive y descargándolo de vuelta sin corrupción de bytes.

**DoD adicional para esta US:**
- Credenciales de la Service Account inyectadas como string base64 en variable de entorno (nunca commiteadas al repositorio).

---

### CERT-04 — Portal Web de Verificación Pública de Certificados (`/verificar/[code]`)
**Tipo:** Story | **SP:** 3 | **Prioridad:** Alta | **Asignado:** Frontend Developer  
**Rama sugerida:** `feature/portal-verificacion-publica`

**Historia de usuario:**
> "Como reclutador, empleador o visitante que escanea el código QR de un certificado Koda, quiero abrir una página pública de verificación,
> para constatar de inmediato y sin necesidad de iniciar sesión que el certificado es auténtico, válido y emitido por Koda."

**Criterios de aceptación:**
- Ruta pública accesible sin autenticación: `/verificar/[code]` (ej. `/verificar/KODA-PY-000001`).
- Endpoint público en backend: `GET /api/v1/certificates/verify/:code`:
  - Si el certificado existe y está vigente: devuelve estado `200 OK` con `status: 'valid'`, nombre del titular, fecha de graduación, lenguaje (`Python 3.12`), nota del examen y enlace a vista previa.
  - Si no existe: devuelve `404 Not Found` con mensaje *"Certificado no encontrado o código inválido"*.
  - Si fue revocado: devuelve `status: 'revoked'` con fecha y motivo de revocación.
- Pantalla de verificación web en Next.js con diseño institucional impecable:
  - Badge de verificación oficial verde con checkmark: *"✓ Certificado Oficial y Auténtico de Koda"*.
  - Ficha técnica de validación con los datos del graduado y visor en miniatura del diploma.
  - Botón *"Descargar Copia Oficial en PDF"* y botón *"Compartir en LinkedIn"*.

**Subtasks:**
- [ ] [BACKEND] Endpoint público `GET /api/v1/certificates/verify/:code` sin guards de autenticación.
- [ ] [FRONTEND] Página dinámica `apps/web/src/app/verificar/[code]/page.tsx` con Server-Side Rendering (SSR) para SEO.
- [ ] [FRONTEND] Metadatos OpenGraph dinámicos: título *"Certificado Koda de [Nombre]"* para preview enriquecida en redes sociales.
- [ ] [FRONTEND] Integración del botón de compartir en LinkedIn con parámetros de credencial oficial.

**DoD adicional para esta US:**
- La página responde en menos de 200 ms y cuenta con score de accesibilidad 100 en Lighthouse.
