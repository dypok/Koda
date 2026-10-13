import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseService } from '../../database/supabase.service';

export interface MaybeAuthenticatedRequest extends Request {
  user?: SupabaseAuthUser;
}

/**
 * Guard flexible que extrae el usuario autenticado si se proporciona un Bearer token válido,
 * pero permite continuar la ejecución sin error 401 si no hay token (soporte onboarding anónimo).
 * Soporta contextos HTTP y GraphQL.
 */
@Injectable()
export class OptionalSupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: MaybeAuthenticatedRequest;
    if (context.getType<string>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      request = gqlCtx.getContext().req;
    } else {
      request = context.switchToHttp().getRequest<MaybeAuthenticatedRequest>();
    }

    if (!request?.headers) {
      return true;
    }

    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : undefined;

    if (!token) {
      return true;
    }

    try {
      const user = await this.supabaseService.verifyAuthToken(token);
      if (user) {
        request.user = user;
      }
    } catch {
      // Si el token es inválido o falla, no se bloquea la solicitud de navegación opcional
    }

    return true;
  }
}

