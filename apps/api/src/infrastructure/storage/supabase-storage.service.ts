import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { Readable } from 'stream';
import { SupabaseService } from '../../database/supabase.service';
import {
  IObjectStorageService,
  UploadFileOptions,
  UploadFileResult,
} from './object-storage.interface';

@Injectable()
export class SupabaseStorageService implements IObjectStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async ensureBucketExists(bucket: string): Promise<void> {
    // Los buckets en Supabase se crean vía migraciones SQL
  }

  async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    const { bucket, key, buffer, mimeType } = options;
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const fileSizeBytes = buffer.length;

    const res = await this.supabaseService.uploadCertificate(key, buffer, mimeType);

    return {
      storagePath: res.path,
      storageUrl: res.publicUrl,
      fileSizeBytes,
      sha256Hash,
    };
  }

  async getPublicUrl(bucket: string, key: string): Promise<string> {
    return this.supabaseService.getCertificatePublicUrl(key);
  }

  async getFileStream(bucket: string, key: string): Promise<{ stream: Readable; mimeType: string; size?: number }> {
    const { data, error } = await this.supabaseService
      .getClient()
      .storage.from(bucket)
      .download(key);

    if (error || !data) {
      throw new Error(`Error descargando archivo de Supabase Storage: ${error?.message}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    return {
      stream: readable,
      mimeType: data.type || 'application/pdf',
      size: buffer.length,
    };
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    await this.supabaseService.deleteCertificate(key);
  }
}
