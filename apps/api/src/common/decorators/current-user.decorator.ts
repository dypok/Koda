import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { AuthenticatedRequest } from '../guards/supabase-auth.guard';

/**
 * Extrae el usuario autenticado adjuntado por SupabaseAuthGuard o OptionalSupabaseAuthGuard.
 * Soporta contextos HTTP y GraphQL.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SupabaseAuthUser | undefined => {
    if (ctx.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(ctx);
      return gqlContext.getContext().req?.user;
    }
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request?.user;
  },
);

