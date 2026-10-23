import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from '@common/guards/supabase-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { NotebookService } from '../../../modules/notebook/notebook.service';
import {
  MistakesNotebookItemType,
  ResolveMistakeResponseType,
} from './types/notebook.type';

@Resolver()
export class NotebookResolver {
  constructor(private readonly notebookService: NotebookService) {}

  @Query(() => [MistakesNotebookItemType], {
    name: 'mistakesNotebook',
    description: 'Obtener lista de errores persistentes pendientes para práctica (SM-2) aislados por usuario autenticado',
  })
  @UseGuards(SupabaseAuthGuard)
  async getMistakes(
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<MistakesNotebookItemType[]> {
    // Blindaje anti-IDOR: el userId proviene estrictamente del JWT verificado
    return this.notebookService.getMistakes(authUser.id);
  }

  @Mutation(() => ResolveMistakeResponseType, {
    name: 'resolveMistake',
    description: 'Remediar un error del cuaderno y recibir bonificación de +5 XP (SM-2) validando la identidad del estudiante',
  })
  @UseGuards(SupabaseAuthGuard)
  async resolveMistake(
    @Args('questionId', { type: () => String }) questionId: string,
    @CurrentUser() authUser: SupabaseAuthUser,
  ): Promise<ResolveMistakeResponseType> {
    // Blindaje anti-IDOR: el userId proviene estrictamente del JWT verificado
    return this.notebookService.resolveMistake(authUser.id, questionId);
  }
}
