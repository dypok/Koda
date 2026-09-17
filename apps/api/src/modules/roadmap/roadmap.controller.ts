import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoadmapService } from './roadmap.service';
import { SeedRoadmapDto } from './dto/seed-roadmap.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import type { GraphDataset } from './roadmap-graph.types';

@ApiTags('Roadmap (Grafo Visual)')
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get(':lang/courses')
  @ApiOperation({ summary: 'Obtener el grafo de cursos (nodos + conexiones) de un lenguaje' })
  @ApiResponse({ status: 200, description: 'Dataset del grafo de cursos' })
  async getCoursesGraph(@Param('lang') lang: string): Promise<{ dataset: GraphDataset }> {
    const dataset = await this.roadmapService.getCoursesGraph(lang);
    return { dataset };
  }

  @Get('courses/:courseId/lessons')
  @ApiOperation({ summary: 'Obtener el grafo de lecciones (nodos + conexiones) de un curso' })
  @ApiResponse({ status: 200, description: 'Dataset del grafo de lecciones' })
  async getLessonsGraph(@Param('courseId') courseId: string): Promise<{ dataset: GraphDataset }> {
    const dataset = await this.roadmapService.getLessonsGraph(courseId);
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
