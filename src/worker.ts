import 'reflect-metadata';
import { parentPort } from 'worker_threads';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// @ts-ignore
import processRequest from 'graphql-upload/processRequest.js';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from 'src/app.module';

function securityConfig(app: NestFastifyApplication, configService: ConfigService) {
  const whiteListOrigins = configService.get<string[]>('whiteListOrigins');

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
}

async function bootstrap(): Promise<void> {
  try {
    console.log('[Worker] Initializing NestJS application...');

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

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
    const configService = app.get(ConfigService);

    securityConfig(app, configService);
    app.useGlobalPipes(new ValidationPipe());

    const port = configService.get<string>('port') || process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');

    console.log(`[Worker] Server running on port ${port}`);

    // Notify parent thread that worker is ready
    if (parentPort) {
      parentPort.postMessage({
        type: 'ready',
        port,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle shutdown messages from parent
    if (parentPort) {
      parentPort.on('message', async (message) => {
        if (message.type === 'shutdown') {
          console.log('[Worker] Shutdown signal received, closing application...');
          await app.close();
          process.exit(0);
        }
      });
    }

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('[Worker] Uncaught Exception:', error);
      if (parentPort) {
        parentPort.postMessage({
          type: 'error',
          error: error.message,
          stack: error.stack,
        });
      }
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Worker] Unhandled Rejection at:', promise, 'reason:', reason);
      if (parentPort) {
        parentPort.postMessage({
          type: 'error',
          error: String(reason),
        });
      }
    });
  } catch (error) {
    console.error('[Worker] Failed to start application:', error);
    if (parentPort) {
      parentPort.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
    }
    process.exit(1);
  }
}

void bootstrap();
