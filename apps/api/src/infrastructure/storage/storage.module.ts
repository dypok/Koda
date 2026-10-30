import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OBJECT_STORAGE_SERVICE_TOKEN } from './object-storage.interface';
import { SiigoStorageService } from './siigo-storage.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    SiigoStorageService,
    {
      provide: OBJECT_STORAGE_SERVICE_TOKEN,
      useExisting: SiigoStorageService,
    },
  ],
  exports: [OBJECT_STORAGE_SERVICE_TOKEN, SiigoStorageService],
})
export class StorageModule {}
