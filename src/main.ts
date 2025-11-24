import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// @ts-ignore
import  processRequest from 'graphql-upload/processRequest.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter();
  const fastify = adapter.getInstance();

  fastify.addContentTypeParser(
    'multipart/form-data',
    (_request: any, _payload: any, done: (err: Error | null, body?: any) => void) => {
      done(null);
    },
  );

  fastify.addHook('preValidation', async (request: any, reply: any) => {
    if (request.headers['content-type']?.startsWith('multipart/form-data')) {
      request.body = await processRequest(request.raw, reply.raw);
    }
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const configService = app.get(ConfigService);
  const whiteListOrigins = configService.get<string[]>('whiteListOrigins');
  const port = configService.get<string>('port') || process.env.PORT;

  app.enableCors({
    origin: whiteListOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  app.use((_req: any, res: any, next: any) => {
    res.setHeader(
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
    next();
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

void bootstrap();