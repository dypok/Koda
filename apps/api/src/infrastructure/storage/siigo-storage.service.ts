import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import { Readable } from 'stream';
import {
  IObjectStorageService,
  UploadFileOptions,
  UploadFileResult,
} from './object-storage.interface';

@Injectable()
export class SiigoStorageService implements IObjectStorageService, OnModuleInit {
  private readonly logger = new Logger(SiigoStorageService.name);
  private readonly s3Client: S3Client;
  private readonly endpoint: string;

  constructor() {
    this.endpoint =
      process.env.SIIGO_ENDPOINT ||
      process.env.MINIO_ENDPOINT ||
      'http://localhost:9000';
    const accessKeyId =
      process.env.SIIGO_ACCESS_KEY ||
      process.env.MINIO_ACCESS_KEY ||
      'koda_admin';
    const secretAccessKey =
      process.env.SIIGO_SECRET_KEY ||
      process.env.MINIO_SECRET_KEY ||
      'koda_secret_key_2026';
    const region =
      process.env.SIIGO_REGION ||
      process.env.MINIO_REGION ||
      'us-east-1';

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    const certBucket =
      process.env.SIIGO_BUCKET_CERTIFICATES ||
      process.env.MINIO_BUCKET_CERTIFICATES ||
      'certificates';
    const avatarsBucket =
      process.env.SIIGO_BUCKET_AVATARS || 'avatars';

    const buckets = [certBucket, avatarsBucket];

    for (const bucket of buckets) {
      try {
        await this.ensureBucketExists(bucket);
        this.logger.log(`Bucket de Siigo Storage '${bucket}' verificado y listo.`);
      } catch (err: any) {
        this.logger.warn(
          `No se pudo inicializar bucket '${bucket}' en Siigo Storage: ${err.message}`,
        );
      }
    }
  }

  async ensureBucketExists(bucket: string): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch {
      this.logger.log(`Creando bucket '${bucket}' en Siigo Storage...`);
      try {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: bucket }));

        // Política de lectura pública para assets y certificados
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicRead',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };

        await this.s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: bucket,
            Policy: JSON.stringify(policy),
          }),
        );
      } catch (err: any) {
        this.logger.warn(`Aviso al configurar bucket '${bucket}': ${err.message}`);
      }
    }
  }

  async uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
    const { bucket, key, buffer, mimeType, metadata } = options;

    await this.ensureBucketExists(bucket);

    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const fileSizeBytes = buffer.length;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        Metadata: {
          ...metadata,
          'sha256-hash': sha256Hash,
        },
      }),
    );

    const storagePath = `${bucket}/${key}`;
    const storageUrl = await this.getPublicUrl(bucket, key);

    return {
      storagePath,
      storageUrl,
      fileSizeBytes,
      sha256Hash,
    };
  }

  async getPublicUrl(bucket: string, key: string): Promise<string> {
    return `${this.endpoint.replace(/\/$/, '')}/${bucket}/${key}`;
  }

  async getFileStream(
    bucket: string,
    key: string,
  ): Promise<{ stream: Readable; mimeType: string; size?: number }> {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    return {
      stream: response.Body as Readable,
      mimeType: response.ContentType || 'application/octet-stream',
      size: response.ContentLength,
    };
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }
}
