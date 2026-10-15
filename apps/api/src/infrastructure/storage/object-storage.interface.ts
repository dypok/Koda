import { Readable } from 'stream';

export interface UploadFileOptions {
  bucket: string;
  key: string;
  buffer: Buffer;
  mimeType: string;
  metadata?: Record<string, string>;
}

export interface UploadFileResult {
  storagePath: string;
  storageUrl: string;
  fileSizeBytes: number;
  sha256Hash: string;
}

export interface IObjectStorageService {
  uploadFile(options: UploadFileOptions): Promise<UploadFileResult>;
  getPublicUrl(bucket: string, key: string): Promise<string>;
  getFileStream(bucket: string, key: string): Promise<{ stream: Readable; mimeType: string; size?: number }>;
  deleteFile(bucket: string, key: string): Promise<void>;
  ensureBucketExists(bucket: string): Promise<void>;
}

export const OBJECT_STORAGE_SERVICE_TOKEN = Symbol('IObjectStorageService');
