import { Module } from '@nestjs/common';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { PdfGeneratorService } from './pdf-generator.service';

@Module({
  controllers: [CertificationController],
  providers: [CertificationService, PdfGeneratorService],
  exports: [CertificationService, PdfGeneratorService],
})
export class CertificationModule {}
