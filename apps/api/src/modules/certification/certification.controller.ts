import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CertificationService } from './certification.service';
import type { CertificateVerificationResponse } from '@koda/types';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

@ApiTags('Certification')
@Controller('certificates')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Get('verify/:code')
  @ApiOperation({ summary: 'Verificación pública de certificado por código QR/ID' })
  @ApiResponse({ status: 200, description: 'Datos de verificación pública' })
  @ApiResponse({ status: 404, description: 'Certificado no encontrado' })
  verify(@Param('code') code: string): Promise<CertificateVerificationResponse> {
    return this.certificationService.verifyCertificate(code);
  }

  @Get(':id/download-info')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Obtener información de descarga y almacenamiento en Supabase Storage (solo el titular)' })
  @ApiResponse({ status: 200, description: 'Metadatos de Supabase Storage Path y URL pública' })
  getDownloadInfo(@CurrentUser() user: SupabaseAuthUser, @Param('id') id: string) {
    return this.certificationService.getDownloadInfo(user.id, id);
  }
}
