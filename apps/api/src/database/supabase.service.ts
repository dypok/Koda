import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly client: SupabaseClient;
  private readonly certificatesBucket: string;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Faltan variables de entorno de Supabase. Define SUPABASE_URL y ' +
          'SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY) en tu .env antes de iniciar la API. ' +
          'Copia apps/api/.env.example y completa tus credenciales del proyecto.',
      );
    }

    this.certificatesBucket =
      this.configService.get<string>('SUPABASE_STORAGE_CERTIFICATES_BUCKET') ||
      'certificates';

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    this.logger.log(`Supabase Client initialized (${supabaseUrl})`);
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // ---------------------------------------------------------------------------
  // Supabase Storage Operations
  // ---------------------------------------------------------------------------

  async uploadCertificate(
    fileName: string,
    fileBuffer: Buffer,
    contentType = 'application/pdf',
  ): Promise<{ path: string; publicUrl: string }> {
    const filePath = `certificates/${fileName}`;

    const { data, error } = await this.client.storage
      .from(this.certificatesBucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading certificate to Supabase Storage: ${error.message}`);
      throw error;
    }

    const { data: publicUrlData } = this.client.storage
      .from(this.certificatesBucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    };
  }

  getCertificatePublicUrl(filePath: string): string {
    const { data } = this.client.storage
      .from(this.certificatesBucket)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  async deleteCertificate(filePath: string): Promise<void> {
    const { error } = await this.client.storage
      .from(this.certificatesBucket)
      .remove([filePath]);

    if (error) {
      this.logger.error(`Error deleting certificate: ${error.message}`);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Supabase Auth Operations
  // ---------------------------------------------------------------------------

  async verifyAuthToken(token: string) {
    const { data, error } = await this.client.auth.getUser(token);
    if (error || !data.user) {
      return null;
    }
    return data.user;
  }
}
