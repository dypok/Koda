import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoadmapService } from './roadmap.service';
import { SeedRoadmapDto } from './dto/seed-roadmap.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { OptionalSupabaseAuthGuard } from '../../common/guards/optional-supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { GraphDataset } from './roadmap-graph.types';

@ApiExcludeController()
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get(':lang/courses')
  @UseGuards(OptionalSupabaseAuthGuard)
  @ApiOperation({ summary: 'Obtener el grafo de cursos (nodos + conexiones) de un lenguaje' })
  @ApiResponse({ status: 200, description: 'Dataset del grafo de cursos' })
  async getCoursesGraph(
    @Param('lang') lang: string,
    @CurrentUser() authUser?: SupabaseAuthUser,
  ): Promise<{ dataset: GraphDataset }> {
    const dataset = await this.roadmapService.getCoursesGraph(lang, authUser?.id);
    return { dataset };
  }

  @Get('courses/:courseId/lessons')
  @UseGuards(OptionalSupabaseAuthGuard)
  @ApiOperation({ summary: 'Obtener el grafo de lecciones (nodos + conexiones) de un curso' })
  @ApiResponse({ status: 200, description: 'Dataset del grafo de lecciones' })
  async getLessonsGraph(
    @Param('courseId') courseId: string,
    @CurrentUser() authUser?: SupabaseAuthUser,
  ): Promise<{ dataset: GraphDataset }> {
    const dataset = await this.roadmapService.getLessonsGraph(courseId, authUser?.id);
    return { dataset };
  }

  @Post('seed')
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Sembrar (upsert) un dataset de grafo diseñado en el frontend' })
  @ApiResponse({ status: 201, description: 'Dataset sembrado con éxito' })
  async seed(@Body() body: SeedRoadmapDto): Promise<{ success: boolean }> {
    const courseId =
      body.courseId ??
      body.coursesDataset.nodes.find((n) => n.isUnlocked)?.targetCourseId ??
      body.coursesDataset.nodes[0]?.targetCourseId ??
      body.language;

    await this.roadmapService.seedDataset(body.language, courseId, body.coursesDataset, body.lessonsDataset);
    return { success: true };
  }
}
