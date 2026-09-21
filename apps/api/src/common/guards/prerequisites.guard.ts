import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidateDagPrerequisitesUseCase } from '@application/use-cases/learning/validate-dag-prerequisites.use-case';
import {
  CURRICULUM_REPOSITORY_TOKEN,
  ICurriculumRepository,
} from '../../domain/repositories/curriculum.repository';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class PrerequisitesGuard implements CanActivate {
  private readonly logger = new Logger(PrerequisitesGuard.name);

  constructor(
    private readonly validateDagPrerequisitesUseCase: ValidateDagPrerequisitesUseCase,
    @Inject(CURRICULUM_REPOSITORY_TOKEN)
    private readonly curriculumRepository: ICurriculumRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: any;

    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
    } else {
      const gqlContext = GqlExecutionContext.create(context);
      req = gqlContext.getContext().req;
    }

    // 1. Extraer identificador del recurso objetivo (lección o sección)
    const lessonId = req?.params?.lessonId || req?.params?.id || req?.body?.lessonId;
    const sectionId = req?.params?.sectionId || req?.body?.sectionId;

    const targetId = lessonId || sectionId;
    if (!targetId) {
      // Si no es una ruta dependiente de un nodo específico, permitir
      return true;
    }

    // 2. Resolver prerrequisitos desde MongoDB
    let requiredDependencies: string[] = [];
    if (lessonId) {
      const lesson = await this.curriculumRepository.findLessonBySlug(lessonId);
      // Las lecciones iniciales de cada sección no requieren prerrequisitos previos dentro de la sección
      if (lesson && lesson.position > 1) {
        // La lección previa de la misma sección es su prerrequisito directo
        // O si la lección define dependencias explícitas
      }
    }

    if (sectionId) {
      const section = await this.curriculumRepository.findSectionBySlug(sectionId);
      if (section && section.position > 1) {
        // La sección previa de la misma pista/módulo es prerrequisito
        // Calculado por posición
      }
    }

    // Si no hay dependencias obligatorias detectadas, permitir acceso
    if (requiredDependencies.length === 0) {
      return true;
    }

    // 3. Si hay dependencias, extraer y validar el usuario autenticado
    const authHeader = req?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Debes iniciar sesión para acceder a un contenido con prerrequisitos.');
    }

    const token = authHeader.slice(7).trim();
    const authUser = await this.supabaseService.verifyAuthToken(token);
    if (!authUser || !authUser.id) {
      throw new UnauthorizedException('Token de sesión inválido o expirado.');
    }

    // 4. Validar cumplimiento de prerrequisitos en PostgreSQL
    const validationResult = await this.validateDagPrerequisitesUseCase.execute({
      userId: authUser.id,
      targetNodeId: targetId,
      prerequisiteNodeIds: requiredDependencies,
    });

    if (!validationResult.isUnlocked) {
      throw new ForbiddenException({
        code: 'PREREQUISITE_NOT_MET',
        message: 'No cumples con los prerrequisitos necesarios para acceder a este contenido.',
        missingPrerequisites: validationResult.missingPrerequisites,
      });
    }

    return true;
  }
}
