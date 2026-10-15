import { PdfGeneratorService } from './pdf-generator.service';

describe('PdfGeneratorService', () => {
  let service: PdfGeneratorService;

  beforeEach(() => {
    service = new PdfGeneratorService();
  });

  it('debe generar un buffer PDF compacto (< 100 KB) con hash criptográfico SHA-256', async () => {
    const result = await service.generateCertificatePdf({
      code: 'KODA-PY-000001',
      studentName: 'Dylan Gamero',
      studentIdMasked: 'CC ***678',
      courseTitle: 'Python 3.12: De Cero a Desarrollador Profesional',
      languageSlug: 'python',
      issueDate: new Date('2026-10-15'),
      verificationUrl: 'https://koda.app/verificar/KODA-PY-000001',
    });

    expect(result.buffer).toBeInstanceOf(Buffer);
    expect(result.buffer.length).toBeGreaterThan(0);
    // Verificar que el PDF sea compacto (menor a 100 KB)
    expect(result.fileSizeBytes).toBeLessThan(100 * 1024);
    // Verificar que el hash SHA-256 sea de 64 caracteres hexadecimales
    expect(result.sha256Hash).toMatch(/^[a-f0-9]{64}$/);
    // Verificar encabezado mágico de PDF (%PDF-)
    expect(result.buffer.toString('utf-8', 0, 5)).toBe('%PDF-');
  });
});
