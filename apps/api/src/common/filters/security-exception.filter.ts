import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class SecurityExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SecurityExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Manejar casos donde el contexto no es HTTP (p. ej. GraphQL)
    if (!response || typeof response.status !== 'function') {
      return exception;
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const timestamp = new Date().toISOString();
    const path = request?.url || '';
    const method = request?.method || '';

    // En desarrollo o pruebas, se permite más detalle para depuración
    if (!isProduction) {
      const responsePayload = isHttpException
        ? exception.getResponse()
        : {
            statusCode: status,
            message: (exception as any)?.message || 'Internal Server Error',
            error: (exception as any)?.name || 'Error',
            stack: (exception as any)?.stack,
          };

      return response.status(status).json({
        ...(typeof responsePayload === 'object' ? responsePayload : { message: responsePayload }),
        timestamp,
        path,
      });
    }

    // EN PRODUCCIÓN: Blindaje total contra fugas de información
    if (isHttpException) {
      const exceptionResponse = exception.getResponse();
      // Si es un error controlado (4xx o HttpException explícita)
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const { ...sanitized } = exceptionResponse as any;
        delete sanitized.stack;
        return response.status(status).json({
          ...sanitized,
          timestamp,
          path,
        });
      }

      return response.status(status).json({
        statusCode: status,
        message: exceptionResponse,
        timestamp,
        path,
      });
    }

    // Error 500 no controlado (Base de datos, Prisma, TypeError, etc.)
    // Se registra internamente el error con stack trace completo
    this.logger.error(
      `[Unhandled Exception] ${method} ${path} - Error: ${(exception as any)?.message}`,
      (exception as any)?.stack,
    );

    // Respuesta genérica estandarizada hacia el cliente exterior sin fuga de internals
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp,
      path,
    });
  }
}
