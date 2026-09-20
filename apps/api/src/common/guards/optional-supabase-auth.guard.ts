import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseService } from '../../database/supabase.service';

export interface MaybeAuthenticatedRequest extends Request {
  user?: SupabaseAuthUser;
}

/**
 * Guard flexible que extrae el usuario autenticado si se proporciona un Bearer token válido,
 * pero permite continuar la ejecución sin error 401 si no hay token (soporte onboarding anónimo).
 */
@Injectable()
export class OptionalSupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<MaybeAuthenticatedRequest>();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

    if (!token) {
      return true;
    }

    try {
      const user = await this.supabaseService.verifyAuthToken(token);
      if (user) {
        request.user = user;
      }
    } catch {
      // Si el token es inválido o falla, no se bloquea la solicitud de diagnóstico
    }

    return true;
  }
}
