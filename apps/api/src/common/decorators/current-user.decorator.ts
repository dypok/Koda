import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { AuthenticatedRequest } from '../guards/supabase-auth.guard';

/**
 * Extrae el usuario autenticado adjuntado por SupabaseAuthGuard.
 * Solo usar en rutas protegidas con @UseGuards(SupabaseAuthGuard).
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SupabaseAuthUser => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
