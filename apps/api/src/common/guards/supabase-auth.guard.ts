import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseService } from '../../database/supabase.service';

export interface AuthenticatedRequest extends Request {
  user: SupabaseAuthUser;
}

/**
 * Valida el JWT de Supabase Auth enviado como "Authorization: Bearer <token>"
 * y adjunta el usuario resuelto a `request.user`. No emite tokens (eso lo hace
 * Supabase Auth en el frontend); solo verifica los ya emitidos.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

    if (!token) {
      throw new UnauthorizedException('No se ha proporcionado el token de autorización.');
    }

    const user = await this.supabaseService.verifyAuthToken(token);
    if (!user) {
      throw new UnauthorizedException('Sesión inválida o expirada. Por favor, inicia sesión nuevamente.');
    }

    request.user = user;
    return true;
  }
}
