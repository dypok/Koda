import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { CertificateVerificationResponse } from '@koda/types';
import { SupabaseService } from '../../database/supabase.service';

interface CertificateRow {
  id: string;
  code: string;
  user_id: string;
  language_slug: string;
  status: 'valid' | 'revoked' | 'obsolete';
  issued_at: string;
  holder_name: string;
  holder_document_masked: string;
  metadata: Record<string, unknown> | null;
  qr_payload: string;
  storage_path: string | null;
  storage_url: string | null;
}

@Injectable()
export class CertificationService {
  private readonly logger = new Logger(CertificationService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /** Verificación pública: no requiere autenticación ni expone datos sensibles. */
  async verifyCertificate(code: string): Promise<CertificateVerificationResponse> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('certificates')
      .select('code, status, issued_at, holder_name, holder_document_masked, language_slug, metadata, qr_payload')
      .eq('code', code)
      .maybeSingle();

    if (error) {
      this.logger.error(`Error verificando certificado '${code}': ${error.message}`);
      throw new InternalServerErrorException('No se pudo verificar el certificado.');
    }

    if (!data) {
      throw new NotFoundException(`Certificado con código '${code}' no encontrado.`);
    }

    const row = data as CertificateRow;
    return {
      is_valid: row.status === 'valid',
      code: row.code,
      holder_name: row.holder_name,
      holder_document_masked: row.holder_document_masked,
      language_name: (row.metadata?.language_name as string | undefined) ?? row.language_slug,
      issued_at: row.issued_at,
      status: row.status,
      verification_url: row.qr_payload,
    };
  }

  /**
   * Info de descarga solo para el titular del certificado (protegido por
   * SupabaseAuthGuard en el controller).
   */
  async getDownloadInfo(
    userId: string,
    idOrCode: string,
  ): Promise<{ code: string; storage_path: string | null; storage_url: string | null; cached: boolean }> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    const column = isUuid ? 'id' : 'code';

    const { data, error } = await this.supabaseService
      .getClient()
      .from('certificates')
      .select('code, storage_path, storage_url, user_id')
      .eq(column, idOrCode)
      .maybeSingle();

    if (error) {
      this.logger.error(`Error buscando certificado '${idOrCode}': ${error.message}`);
      throw new InternalServerErrorException('No se pudo obtener la información de descarga.');
    }

    if (!data || (data as CertificateRow).user_id !== userId) {
      throw new NotFoundException(`Certificado '${idOrCode}' no encontrado.`);
    }

    const row = data as CertificateRow;
    return {
      code: row.code,
      storage_path: row.storage_path,
      storage_url: row.storage_url,
      cached: !!row.storage_path,
    };
  }
}
