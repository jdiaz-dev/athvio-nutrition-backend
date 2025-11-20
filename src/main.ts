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
import cors from '@fastify/cors';

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter();
  const fastify = adapter.getInstance();
  fastify
  await fastify.register(cors, {
    origin: (origin, cb) => {
      console.log('>>> CORS origin callback:', origin);

      // Allow non-browser or same-origin requests (no Origin header)
      if (!origin) {
        return cb(null, true);
      }

      // For now, allow everything to be sure CORS is not the problem
      return cb(null, true);

      // After debug, you can go back to:
      // if (whiteListOrigins.includes(origin)) return cb(null, true);
      // return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: '*', // debug: allow everything
  });
  /* fastify.addContentTypeParser(
    'multipart',
    (request: any, _payload: any, done: (err: Error | null) => void) => {
      (request as any).isMultipart = true;
      done(null);
    },
  );

  fastify.addHook('preValidation', async (request: any, reply: any) => {
    if (!request.isMultipart) return;
    request.body = await processRequest(request.raw, reply.raw);
  }); */
  fastify.addHook('onRequest', async (request, _reply) => {
    console.log(
    '>>> onRequest',
    request.method,
    request.url,
    'Origin:',
    request.headers.origin,
  );
});
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const configService = app.get(ConfigService);
  const whiteListOrigins = configService.get<string[]>('whiteListOrigins');
  const port = configService.get<string>('port') || process.env.PORT;
  console.log('------whiteListOrigins', whiteListOrigins)
  /* adapter.enableCors({
    // origin: whiteListOrigins,
    origin: (origin, callback) => {
      console.log('---1111', origin);
      // Allow non-browser clients (no Origin header)
      if (!origin) {
        return callback(null, true);
      }

      if (whiteListOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked CORS origin:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }) */

  

  /* app.enableCors({
    // origin: whiteListOrigins,
    origin: (origin, callback) => {
      console.log('---1111', origin);
      // Allow non-browser clients (no Origin header)
      if (!origin) {
        return callback(null, true);
      }

      if (whiteListOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked CORS origin:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }); */

  

  // This still works via middie, though in the long term you'd probably switch
  // to @fastify/helmet for native Fastify integration.
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

  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

void bootstrap();
