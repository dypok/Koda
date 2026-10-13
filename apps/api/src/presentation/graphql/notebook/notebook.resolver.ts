import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
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
    description: 'Obtener lista de errores persistentes pendientes para práctica (SM-2)',
  })
  async getMistakes(
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
    @Context() context?: any,
  ): Promise<MistakesNotebookItemType[]> {
    const resolvedUserId = userId || context?.req?.user?.id || 'demo-user-id';
    return this.notebookService.getMistakes(resolvedUserId);
  }

  @Mutation(() => ResolveMistakeResponseType, {
    name: 'resolveMistake',
    description: 'Remediar un error del cuaderno y recibir bonificación de +5 XP (SM-2)',
  })
  async resolveMistake(
    @Args('questionId', { type: () => String }) questionId: string,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
    @Context() context?: any,
  ): Promise<ResolveMistakeResponseType> {
    const resolvedUserId = userId || context?.req?.user?.id || 'demo-user-id';
    return this.notebookService.resolveMistake(resolvedUserId, questionId);
  }
}
