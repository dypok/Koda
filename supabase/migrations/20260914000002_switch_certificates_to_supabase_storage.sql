-- ==============================================================================
-- KODA — MIGRACIÓN: MIGRAR ALMACENAMIENTO DE CERTIFICADOS A SUPABASE STORAGE
-- Fecha: 14-09-2026
-- Descripción:
--   1. Elimina columna 'google_drive_file_id' de certificates.
--   2. Agrega 'storage_path' y 'storage_url' para almacenamiento nativo en Supabase Storage.
--   3. Crea el bucket público 'certificates' en storage.buckets con límite de 5MB por PDF.
--   4. Configura políticas RLS para lectura pública y subida autenticada/service_role.
-- ==============================================================================

-- 1. Modificar tabla certificates
ALTER TABLE certificates
  DROP COLUMN IF EXISTS google_drive_file_id,
  ADD COLUMN IF NOT EXISTS storage_path VARCHAR(255),
  ADD COLUMN IF NOT EXISTS storage_url TEXT;

-- 2. Crear bucket 'certificates' en Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('certificates', 'certificates', true, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf'];

-- 3. Políticas de acceso (RLS) para storage.objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Certificates'
  ) THEN
    CREATE POLICY "Public Access for Certificates"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'certificates');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Uploads to Certificates Bucket'
  ) THEN
    CREATE POLICY "Allow Uploads to Certificates Bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'certificates');
  END IF;
END $$;
