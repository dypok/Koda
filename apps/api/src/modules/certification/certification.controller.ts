import { Controller, Get, Post, Body, Param, UseGuards, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
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

  @Post('issue')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Emitir certificado oficial para un lenguaje completado' })
  @ApiResponse({ status: 201, description: 'Certificado emitido exitosamente' })
  issue(
    @CurrentUser() user: SupabaseAuthUser,
    @Body('languageSlug') languageSlug: string,
  ) {
    return this.certificationService.issueCertificate(user.id, languageSlug || 'python');
  }

  @Get(':id/download-info')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Obtener información de descarga y almacenamiento en Object Storage (solo el titular)' })
  @ApiResponse({ status: 200, description: 'Metadatos de Storage Path y URL' })
  getDownloadInfo(@CurrentUser() user: SupabaseAuthUser, @Param('id') id: string) {
    return this.certificationService.getDownloadInfo(user.id, id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Descarga física directa del archivo PDF del certificado' })
  @ApiResponse({ status: 200, description: 'Stream binario del PDF' })
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const fileData = await this.certificationService.getCertificatePdfStream(id);

    res.set({
      'Content-Type': fileData.mimeType,
      'Content-Disposition': `attachment; filename="${fileData.filename}"`,
      ...(fileData.size ? { 'Content-Length': fileData.size.toString() } : {}),
    });

    fileData.stream.pipe(res);
  }
}
