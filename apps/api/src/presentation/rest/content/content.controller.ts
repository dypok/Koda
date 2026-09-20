import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetTracksUseCase,
  GetTrackCoursesUseCase,
  GetCourseDetailUseCase,
  GetLessonDetailUseCase,
  GetVisualEffectsUseCase,
} from '../../../application/use-cases/curriculum';

@ApiTags('Content & Curriculum')
@Controller('content')
export class ContentController {
  constructor(
    private readonly getTracksUseCase: GetTracksUseCase,
    private readonly getTrackCoursesUseCase: GetTrackCoursesUseCase,
    private readonly getCourseDetailUseCase: GetCourseDetailUseCase,
    private readonly getLessonDetailUseCase: GetLessonDetailUseCase,
    private readonly getVisualEffectsUseCase: GetVisualEffectsUseCase,
  ) {}

  @Get('tracks')
  @ApiOperation({ summary: 'Listar todas las pistas profesionales de carrera (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Catálogo de pistas profesionales activas' })
  async getTracks() {
    const tracks = await this.getTracksUseCase.execute();
    return { tracks };
  }

  @Get('tracks/:slug')
  @ApiOperation({ summary: 'Obtener cursos en grafo DAG de una pista profesional (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Pista profesional y sus cursos en topología DAG' })
  @ApiResponse({ status: 404, description: 'Pista profesional no encontrada' })
  async getTrackBySlug(@Param('slug') slug: string) {
    const result = await this.getTrackCoursesUseCase.execute(slug);
    return result;
  }

  @Get('courses/:slug')
  @ApiOperation({ summary: 'Obtener detalle de un curso con sus módulos y secciones (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Estructura modular del curso' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  async getCourseBySlug(@Param('slug') slug: string) {
    const result = await this.getCourseDetailUseCase.execute(slug);
    return result;
  }

  @Get('lessons/:slug')
  @ApiOperation({ summary: 'Obtener micro-lección atómica con la Tríada Evaluativa (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Micro-lección con teoría, consola interactiva, quiz A/B/C/D y predicción' })
  @ApiResponse({ status: 404, description: 'Lección no encontrada' })
  async getLessonBySlug(@Param('slug') slug: string) {
    const lesson = await this.getLessonDetailUseCase.execute(slug);
    return { lesson };
  }

  @Get('visual-effects')
  @ApiOperation({ summary: 'Catálogo de presets de aristas aceleradas por GPU (MongoDB)' })
  @ApiResponse({ status: 200, description: 'Efectos visuales del roadmap' })
  async getVisualEffects() {
    const effects = await this.getVisualEffectsUseCase.execute();
    return { effects };
  }
}
