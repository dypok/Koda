import { Injectable, NotFoundException } from '@nestjs/common';
import type { Certificate, CertificateVerificationResponse } from '@koda/types';

@Injectable()
export class CertificationService {
  private readonly certificates: Certificate[] = [
    {
      id: 'cert_001',
      code: 'KODA-PY-000001',
      user_id: 'usr_001',
      language_id: 'lang_py_01',
      status: 'valid',
      issued_at: '2026-09-02T12:00:00Z',
      holder_name: 'Alex Developer',
      holder_document_masked: 'CC ***678',
      language_name: 'Python 3.12',
      qr_payload: 'https://koda.app/verificar/KODA-PY-000001',
      storage_path: 'certificates/KODA-PY-000001.pdf',
      storage_url: 'https://sertfbduqivvjrmeblvh.supabase.co/storage/v1/object/public/certificates/KODA-PY-000001.pdf',
      pdf_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  ];

  verifyCertificate(code: string): CertificateVerificationResponse {
    const cert = this.certificates.find((c) => c.code === code);
    if (!cert) {
      throw new NotFoundException(`Certificado con código '${code}' no encontrado.`);
    }

    return {
      is_valid: cert.status === 'valid',
      code: cert.code,
      holder_name: cert.holder_name,
      holder_document_masked: cert.holder_document_masked,
      language_name: cert.language_name,
      issued_at: cert.issued_at,
      status: cert.status,
      verification_url: cert.qr_payload,
    };
  }

  getDownloadInfo(id: string): { code: string; storage_path: string; storage_url: string; cached: boolean } {
    const cert = this.certificates.find((c) => c.id === id || c.code === id);
    if (!cert) {
      throw new NotFoundException(`Certificado '${id}' no encontrado.`);
    }

    return {
      code: cert.code,
      storage_path: cert.storage_path || 'certificates/mock.pdf',
      storage_url: cert.storage_url || `https://sertfbduqivvjrmeblvh.supabase.co/storage/v1/object/public/${cert.storage_path || 'certificates/mock.pdf'}`,
      cached: !!cert.storage_path,
    };
  }
}
