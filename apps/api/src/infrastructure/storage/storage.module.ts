import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OBJECT_STORAGE_SERVICE_TOKEN } from './object-storage.interface';
import { MinioStorageService } from './minio-storage.service';
import { SupabaseStorageService } from './supabase-storage.service';
import { SupabaseService } from '../../database/supabase.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    MinioStorageService,
    SupabaseStorageService,
    SupabaseService,
    {
      provide: OBJECT_STORAGE_SERVICE_TOKEN,
      useFactory: (
        configService: ConfigService,
        minioService: MinioStorageService,
        supabaseStorageService: SupabaseStorageService,
      ) => {
        const driver = configService.get<string>('STORAGE_DRIVER') || 'minio';
        if (driver.toLowerCase() === 'supabase') {
          return supabaseStorageService;
        }
        return minioService;
      },
      inject: [ConfigService, MinioStorageService, SupabaseStorageService],
    },
  ],
  exports: [OBJECT_STORAGE_SERVICE_TOKEN, MinioStorageService, SupabaseStorageService],
})
export class StorageModule {}
