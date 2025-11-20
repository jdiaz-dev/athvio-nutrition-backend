import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// @ts-ignore
import processRequest from 'graphql-upload/processRequest.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter();
  const fastify = adapter.getInstance();

  // Register CORS plugin BEFORE creating the app
  await fastify.register(import('@fastify/cors'), {
    origin: true, // We'll configure this properly after getting config
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  fastify.addContentTypeParser(
    'multipart',
    (request: any, _payload: any, done: (err: Error | null) => void) => {
      (request as any).isMultipart = true;
      done(null);
    },
  );

  fastify.addHook('preValidation', async (request: any, reply: any) => {
    if (!request.isMultipart) return;
    request.body = await processRequest(request.raw, reply.raw);
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const configService = app.get(ConfigService);
  const whiteListOrigins = configService.get<string[]>('whiteListOrigins');
  const port = configService.get<string>('port') || process.env.PORT;

  // Re-register CORS with proper whitelist after getting config
  await app.register(import('@fastify/cors'), {
    origin: (origin, cb) => {
      if (!origin || whiteListOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Use @fastify/helmet instead of helmet
  await app.register(helmet, {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  });

  // Add Permissions-Policy using Fastify hook instead of Express middleware
  fastify.addHook('onSend', async (_request, reply) => {
    reply.header(
      'Permissions-Policy',
      [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'fullscreen=()',
        'payment=()',
        'usb=()',
        'accelerometer=()',
        'autoplay=()',
        'clipboard-read=()',
        'clipboard-write=()',
        'magnetometer=()',
        'gyroscope=()',
        'publickey-credentials-get=()',
        'screen-wake-lock=()',
        'xr-spatial-tracking=()',
        'interest-cohort=()',
      ].join(', '),
    );
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, '0.0.0.0'); // Important for production deployment
  console.log(`Server running on port ${port}`);
}

void bootstrap();