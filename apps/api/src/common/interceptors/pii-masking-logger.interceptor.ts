import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

const SENSITIVE_KEYS = new Set([
  'password',
  'password_hash',
  'passwordhash',
  'newpassword',
  'new_password',
  'oldpassword',
  'old_password',
  'token',
  'refreshtoken',
  'refresh_token',
  'accesstoken',
  'access_token',
  'authorization',
  'document_number',
  'documentnumber',
  'secret',
  'api_key',
  'apikey',
]);

/**
 * Sanitiza recursivamente objetos y arreglos para redactar PII y credenciales sensibles.
 */
function sanitizeSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeSensitiveData(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

@Injectable()
export class PiiMaskingLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isHttp = context.getType() === 'http';
    if (!isHttp) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    const sanitizedBody = sanitizeSensitiveData(req.body);
    const sanitizedQuery = sanitizeSensitiveData(req.query);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const res = context.switchToHttp().getResponse();
          const statusCode = res.statusCode;

          const logMessage = `[${method}] ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip}`;
          if (process.env.NODE_ENV !== 'production' && Object.keys(sanitizedBody || {}).length > 0) {
            this.logger.debug(`${logMessage} - Body: ${JSON.stringify(sanitizedBody)}`);
          } else {
            this.logger.log(logMessage);
          }
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          const statusCode = err?.status || 500;
          this.logger.warn(
            `[${method}] ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip} - Error: ${err?.message}`,
          );
        },
      }),
    );
  }
}
