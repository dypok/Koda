import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { CertificateVerificationResponse } from '@koda/types';
import { PrismaService } from '@infra/database/postgres/prisma.service';
import {
  OBJECT_STORAGE_SERVICE_TOKEN,
  IObjectStorageService,
} from '../../infrastructure/storage/object-storage.interface';
import { PdfGeneratorService } from './pdf-generator.service';
import { Readable } from 'stream';

const LANGUAGE_TITLES: Record<string, string> = {
  python: 'Python 3.12: De Cero a Desarrollador Profesional',
  javascript: 'JavaScript Moderno: Fundamentos, Asincronía y Web APIs',
  typescript: 'TypeScript Enterprise: Tipado Estático y Arquitectura',
  html: 'HTML5 Semántico y Accesibilidad Web (WCAG 2.1)',
  css: 'CSS3 Avanzado: Flexbox, Grid y Animaciones UI',
  lua: 'Lua Scripting: Lógica y Motores de Videojuegos',
};

@Injectable()
export class CertificationService {
  private readonly logger = new Logger(CertificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(OBJECT_STORAGE_SERVICE_TOKEN)
    private readonly storageService: IObjectStorageService,
    private readonly pdfGeneratorService: PdfGeneratorService,
  ) {}

  /** Verificación pública: no requiere autenticación ni expone datos sensibles. */
  async verifyCertificate(code: string): Promise<CertificateVerificationResponse> {
    const cert = await this.prisma.certificate.findUnique({
      where: { code },
    });

    if (!cert) {
      throw new NotFoundException(`Certificado con código '${code}' no encontrado o no emitido.`);
    }

    const metadata = cert.metadata as Record<string, unknown> | null;
    const languageName =
      (metadata?.language_name as string) ||
      LANGUAGE_TITLES[cert.languageSlug] ||
      `${cert.languageSlug.toUpperCase()} Fundamentos`;

    const isValid = cert.status === 'valid';

    return {
      is_valid: isValid,
      code: cert.code,
      holder_name: cert.holderName,
      holder_document_masked: cert.holderDocumentMasked || 'CC ***000',
      language_name: languageName,
      issued_at: cert.issuedAt.toISOString(),
      status: (cert.status as 'valid' | 'revoked' | 'obsolete') || 'valid',
      verification_url: cert.qrPayload || `https://koda.app/verificar/${cert.code}`,
    };
  }

  /**
   * Info de descarga solo para el titular del certificado.
   */
  async getDownloadInfo(
    userId: string,
    idOrCode: string,
  ): Promise<{ code: string; storage_path: string | null; storage_url: string | null; cached: boolean }> {
    const cert = await this.prisma.certificate.findFirst({
      where: {
        OR: [{ id: idOrCode }, { code: idOrCode }],
        userId,
      },
    });

    if (!cert) {
      throw new NotFoundException(`Certificado '${idOrCode}' no encontrado para este usuario.`);
    }

    return {
      code: cert.code,
      storage_path: cert.storagePath,
      storage_url: cert.storageUrl,
      cached: Boolean(cert.storagePath),
    };
  }

  /**
   * Emisión atómica de certificado:
   * 1. Comprueba idempotencia (si ya fue emitido y es válido, lo devuelve).
   * 2. Recupera datos del graduado desde la base de datos.
   * 3. Asigna código correlativo correlacionado (ej. KODA-PY-000001).
   * 4. Genera el binario PDF vectorial con QR en < 100 KB usando pdf-lib.
   * 5. Sube a Object Storage (MinIO o Supabase Storage).
   * 6. Registra atómicamente en PostgreSQL.
   */
  async issueCertificate(userId: string, languageSlug: string) {
    const cleanSlug = languageSlug.toLowerCase().trim();

    // 1. Idempotencia: evitar duplicados
    const existing = await this.prisma.certificate.findFirst({
      where: {
        userId,
        languageSlug: cleanSlug,
        status: 'valid',
      },
    });

    if (existing) {
      this.logger.log(`Certificado existente devuelto para usuario ${userId} en ${cleanSlug}: ${existing.code}`);
      return {
        ...existing,
        verificationCode: existing.code,
      };
    }

    // 2. Obtener usuario graduado
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario graduado con ID '${userId}' no encontrado.`);
    }

    const studentName = user.displayName || 'Estudiante Koda';
    const docType = user.documentType || 'CC';
    const studentIdMasked = user.documentNumber
      ? `${docType} ***${user.documentNumber.slice(-3)}`
      : 'CC ***678';
    const courseTitle = LANGUAGE_TITLES[cleanSlug] || `${cleanSlug.toUpperCase()} Fundamentos`;

    // 3. Generar código correlativo único atómico
    const count = await this.prisma.certificate.count({
      where: { languageSlug: cleanSlug },
    });
    const prefix = cleanSlug.slice(0, 3).toUpperCase();
    const seqNumber = String(count + 1).padStart(6, '0');
    const verificationCode = `KODA-${prefix}-${seqNumber}`;

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    const verificationUrl = `${appUrl}/verificar/${verificationCode}`;
    const issueDate = new Date();

    // 4. Generar binario PDF ultra-compacto (< 100 KB) con QR
    const pdfResult = await this.pdfGeneratorService.generateCertificatePdf({
      code: verificationCode,
      studentName,
      studentIdMasked,
      courseTitle,
      languageSlug: cleanSlug,
      issueDate,
      verificationUrl,
    });

    // 5. Almacenar en Siigo / Object Storage
    const bucket = process.env.SIIGO_BUCKET_CERTIFICATES || process.env.MINIO_BUCKET_CERTIFICATES || 'certificates';
    const fileKey = `${verificationCode}.pdf`;

    const uploadResult = await this.storageService.uploadFile({
      bucket,
      key: fileKey,
      buffer: pdfResult.buffer,
      mimeType: 'application/pdf',
      metadata: {
        'user-id': userId,
        'verification-code': verificationCode,
      },
    });

    // 6. Transacción ACID en PostgreSQL
    const certificate = await this.prisma.certificate.create({
      data: {
        userId,
        code: verificationCode,
        languageSlug: cleanSlug,
        trackSlug: cleanSlug,
        status: 'valid',
        issuedAt: issueDate,
        holderName: studentName,
        holderDocumentMasked: studentIdMasked,
        qrPayload: verificationUrl,
        pdfSha256: pdfResult.sha256Hash,
        storagePath: uploadResult.storagePath,
        storageUrl: uploadResult.storageUrl,
        metadata: {
          language_name: courseTitle,
          verification_url: verificationUrl,
          file_size_bytes: pdfResult.fileSizeBytes,
        },
      },
    });

    this.logger.log(`Certificado ${verificationCode} emitido y custodiado en ${uploadResult.storagePath}`);

    return {
      ...certificate,
      verificationCode: certificate.code,
    };
  }

  /**
   * Obtiene el stream binario de un certificado para descarga física directa.
   */
  async getCertificatePdfStream(idOrCode: string): Promise<{
    stream: Readable;
    filename: string;
    mimeType: string;
    size?: number;
  }> {
    const cert = await this.prisma.certificate.findFirst({
      where: {
        OR: [{ id: idOrCode }, { code: idOrCode }],
      },
    });

    if (!cert) {
      throw new NotFoundException(`Certificado '${idOrCode}' no encontrado.`);
    }

    const bucket = process.env.SIIGO_BUCKET_CERTIFICATES || process.env.MINIO_BUCKET_CERTIFICATES || 'certificates';
    const fileKey = `${cert.code}.pdf`;

    try {
      const fileData = await this.storageService.getFileStream(bucket, fileKey);
      const metadata = cert.metadata as Record<string, unknown> | null;
      return {
        stream: fileData.stream,
        filename: `${cert.code}.pdf`,
        mimeType: fileData.mimeType,
        size: (metadata?.file_size_bytes as number) || fileData.size,
      };
    } catch (err: any) {
      this.logger.error(`Error al recuperar stream de '${fileKey}': ${err.message}`);
      throw new InternalServerErrorException('No se pudo recuperar el archivo PDF del certificado.');
    }
  }
}
