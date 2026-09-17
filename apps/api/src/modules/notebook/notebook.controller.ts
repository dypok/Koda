import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotebookService } from './notebook.service';
import type { MistakesNotebookItem } from '@koda/types';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

@ApiTags('Mistakes Notebook')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('notebook')
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Get('mistakes')
  @ApiOperation({ summary: 'Obtener lista de errores persistentes pendientes para práctica' })
  @ApiResponse({ status: 200, description: 'Lista de errores' })
  getMistakes(@CurrentUser() user: SupabaseAuthUser): Promise<MistakesNotebookItem[]> {
    return this.notebookService.getMistakes(user.id);
  }

  @Post('mistakes/:questionId/resolve')
  @ApiOperation({ summary: 'Remediar un error del cuaderno y recibir bonificación de +5 XP' })
  @ApiResponse({ status: 200, description: 'Error remediado con éxito' })
  resolveMistake(@CurrentUser() user: SupabaseAuthUser, @Param('questionId') questionId: string) {
    return this.notebookService.resolveMistake(user.id, questionId);
  }
}
