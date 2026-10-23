import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SecurityExceptionFilter } from './common/filters/security-exception.filter';
import { PiiMaskingLoggerInterceptor } from './common/interceptors/pii-masking-logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Headers de seguridad HTTP con Helmet
    // 1. Headers de seguridad HTTP con Helmet reforzado (OWASP / Zero-Leakage)
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          connectSrc: ["'self'", 'https:', 'wss:'],
          fontSrc: ["'self'", 'https:', 'data:'],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      } : false,
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      xssFilter: true,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // 1.1 Límites de tamaño de payload contra ataques de agotamiento de memoria (DoS)
  app.use(json({ limit: '100kb' }));
  app.use(urlencoded({ extended: true, limit: '100kb' }));

  // 1.2 Filtro global de excepciones sin fuga de stack traces ni internals
  app.useGlobalFilters(new SecurityExceptionFilter());

  // 1.3 Interceptor para ofuscación de PII y credenciales en logs de observabilidad
  app.useGlobalInterceptors(new PiiMaskingLoggerInterceptor());

  // 2. Prefijo global para la API REST v1
  app.setGlobalPrefix('api/v1');

  // 3. CORS seguro: orígenes explícitos y soporte de desarrollo local
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://app.localhost:3000',
        'https://koda.academy',
        'https://app.koda.academy',
      ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (como cURL, SSR o herramientas internas de confianza)
      if (!origin) return callback(null, true);

      // Permitir cualquier subdominio en localhost o 127.0.0.1 durante desarrollo
      if (
        process.env.NODE_ENV !== 'production' &&
        /^http:\/\/(?:[a-zA-Z0-9-]+\.)?(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Permitir dominios y subdominios oficiales de Koda
      if (/^https:\/\/(?:[a-zA-Z0-9-]+\.)?(?:koda\.academy|koda\.app|koda\.com)$/.test(origin)) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // En producción: Bloqueo explícito de orígenes no reconocidos
      if (isProduction) {
        return callback(new Error('CORS access denied: origin not allowed by Koda security policy'), false);
      }

      return callback(null, true);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // 4. Validación declarativa estricta con sanitización
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 5. Configuración de OpenAPI Swagger (solo en entornos de desarrollo)
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Koda API (REST v2.0 - Superficie Transaccional)')
      .setDescription(
        'Especificación OpenAPI 3.0 para la plataforma Koda. ' +
        'Conforme a la Arquitectura Híbrida formalizada en ADR-012, la superficie REST (/api/v1) está reservada exclusivamente para ' +
        'estándares HTTP nativos y operaciones pesadas: Autenticación con Supabase Auth (/auth), Gestión de Perfiles y PII Legal (/users), ' +
        'Evaluación Diagnóstica Inicial (/learning/diagnostic), Certificaciones y Streaming PDF (/certificates), y Monitoreo de Infraestructura. ' +
        'Las consultas interactivas de currículo, grafo DAG de roadmap y mutaciones formativas se consumen a través de GraphQL (/graphql).'
      )
      .setVersion('2.0.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingresa el Access Token JWT emitido por Supabase Auth',
        in: 'header',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[Koda API] Backend running at http://localhost:${port}/api/v1`);
  if (!isProduction) {
    console.log(`[Koda API] Swagger Documentation at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
