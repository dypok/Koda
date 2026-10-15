import { Injectable, Logger } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

export interface CertificatePdfData {
  code: string;
  studentName: string;
  studentIdMasked?: string;
  courseTitle: string;
  languageSlug: string;
  issueDate: Date;
  verificationUrl: string;
}

export interface GeneratedPdfResult {
  buffer: Buffer;
  sha256Hash: string;
  fileSizeBytes: number;
}

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);

  async generateCertificatePdf(data: CertificatePdfData): Promise<GeneratedPdfResult> {
    // 1. Crear documento PDF en orientación horizontal A4 (841.89 x 595.28 pt)
    const pdfDoc = await PDFDocument.create();
    const width = 841.89;
    const height = 595.28;
    const page = pdfDoc.addPage([width, height]);

    // 2. Fuentes estándar (vectoriales, no requieren assets externos)
    const fontSerif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontMono = await pdfDoc.embedFont(StandardFonts.CourierBold);

    // 3. Paleta institucional Koda
    const bgDark = rgb(0.04, 0.06, 0.11);       // #0a0f1c Dark Navy
    const borderGold = rgb(0.96, 0.62, 0.04);   // #f59e0b Ámbar Dorado
    const textWhite = rgb(0.98, 0.98, 0.98);    // Blanco
    const textMuted = rgb(0.60, 0.66, 0.76);    // Gris pizarra
    const accentCyan = rgb(0.22, 0.74, 0.97);   // #38bdf8

    // Fondo completo Dark Navy
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: bgDark,
    });

    // Marco exterior dorado institucional (con margen de 28 pt)
    page.drawRectangle({
      x: 28,
      y: 28,
      width: width - 56,
      height: height - 56,
      borderColor: borderGold,
      borderWidth: 2,
    });

    // Marco interior tenue (con margen de 34 pt)
    page.drawRectangle({
      x: 34,
      y: 34,
      width: width - 68,
      height: height - 68,
      borderColor: rgb(0.18, 0.24, 0.35),
      borderWidth: 1,
    });

    // Encabezado Koda
    page.drawText('KODA ACADEMY', {
      x: width / 2 - (fontSansBold.widthOfTextAtSize('KODA ACADEMY', 15) / 2),
      y: height - 75,
      size: 15,
      font: fontSansBold,
      color: borderGold,
    });

    // Título Principal
    const mainTitle = 'CERTIFICADO DE COMPETENCIA PROFESIONAL';
    page.drawText(mainTitle, {
      x: width / 2 - (fontSansBold.widthOfTextAtSize(mainTitle, 22) / 2),
      y: height - 120,
      size: 22,
      font: fontSansBold,
      color: textWhite,
    });

    // Leyenda de acreditación
    const certifyText = 'Por cuanto se certifica oficialmente que:';
    page.drawText(certifyText, {
      x: width / 2 - (fontSans.widthOfTextAtSize(certifyText, 12) / 2),
      y: height - 160,
      size: 12,
      font: fontSans,
      color: textMuted,
    });

    // Nombre del graduado
    const student = data.studentName.toUpperCase();
    page.drawText(student, {
      x: width / 2 - (fontSerif.widthOfTextAtSize(student, 28) / 2),
      y: height - 215,
      size: 28,
      font: fontSerif,
      color: textWhite,
    });

    // Línea divisoria bajo el nombre
    page.drawLine({
      start: { x: width / 2 - 160, y: height - 230 },
      end: { x: width / 2 + 160, y: height - 230 },
      thickness: 1,
      color: borderGold,
    });

    // Documento de identidad enmascarado
    if (data.studentIdMasked) {
      const idText = `Documento de Identidad: ${data.studentIdMasked}`;
      page.drawText(idText, {
        x: width / 2 - (fontMono.widthOfTextAtSize(idText, 10) / 2),
        y: height - 250,
        size: 10,
        font: fontMono,
        color: textMuted,
      });
    }

    // Texto de culminación
    const completeText = 'Ha culminado y aprobado con distinción técnica la ruta oficial:';
    page.drawText(completeText, {
      x: width / 2 - (fontSans.widthOfTextAtSize(completeText, 12) / 2),
      y: height - 290,
      size: 12,
      font: fontSans,
      color: textMuted,
    });

    // Título del curso / programa
    const course = data.courseTitle;
    page.drawText(course, {
      x: width / 2 - (fontSansBold.widthOfTextAtSize(course, 20) / 2),
      y: height - 325,
      size: 20,
      font: fontSansBold,
      color: accentCyan,
    });

    // Carga horaria y fecha
    const formattedDate = data.issueDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const infoMeta = `Intensidad: 40 horas prácticas de código real  ·  Fecha de Graduación: ${formattedDate}`;
    page.drawText(infoMeta, {
      x: width / 2 - (fontSans.widthOfTextAtSize(infoMeta, 11) / 2),
      y: height - 355,
      size: 11,
      font: fontSans,
      color: textMuted,
    });

    // 4. Generar código QR vectorial/binario para verificación pública
    const qrBuffer = await QRCode.toBuffer(data.verificationUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 100,
      color: {
        dark: '#ffffff',
        light: '#0a0f1c',
      },
    });

    const qrImage = await pdfDoc.embedPng(qrBuffer);
    const qrSize = 85;
    const qrX = width - 130;
    const qrY = 55;

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    // Etiquetas junto al QR
    page.drawText('ESCANEA PARA VERIFICAR', {
      x: qrX - 160,
      y: qrY + 60,
      size: 8,
      font: fontSansBold,
      color: borderGold,
    });

    page.drawText(`ID: ${data.code}`, {
      x: qrX - 160,
      y: qrY + 45,
      size: 9,
      font: fontMono,
      color: textWhite,
    });

    page.drawText('Validación pública criptográfica', {
      x: qrX - 160,
      y: qrY + 30,
      size: 7,
      font: fontSans,
      color: textMuted,
    });

    // Firmas Institucionales a la izquierda
    page.drawLine({
      start: { x: 80, y: 115 },
      end: { x: 260, y: 115 },
      thickness: 1,
      color: rgb(0.3, 0.4, 0.5),
    });
    page.drawText('DIRECCIÓN ACADÉMICA KODA', {
      x: 80,
      y: 98,
      size: 9,
      font: fontSansBold,
      color: textWhite,
    });
    page.drawText('Vexalith Studios · Koda Certification Engine', {
      x: 80,
      y: 85,
      size: 8,
      font: fontSans,
      color: textMuted,
    });

    // 5. Guardar con compresión de objetos (Flate/Deflate nativa)
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const buffer = Buffer.from(pdfBytes);
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const fileSizeBytes = buffer.length;

    this.logger.log(
      `Certificado '${data.code}' generado exitosamente: ${fileSizeBytes} bytes (~${Math.round(fileSizeBytes / 1024)} KB), Hash SHA-256: ${sha256Hash.slice(0, 12)}...`,
    );

    return {
      buffer,
      sha256Hash,
      fileSizeBytes,
    };
  }
}
