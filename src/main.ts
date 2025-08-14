import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// @ts-ignore
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const whiteListOrigins = configService.get<string[]>('whiteListOrigins');
  const port = configService.get<string>('port') || process.env.PORT;
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
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

          // defaultSrc: ["'none'"],
          // baseUri: ["'none'"],
          // formAction: ["'none'"],
          // frameAncestors: ["'none'"],
          // // allow nothing to load
          // connectSrc: ["'self'"],
        },
      },

      // referrerPolicy: { policy: 'no-referrer' },
      // // HSTS: only enable when you are 100% HTTPS in prod (looks like you are)
      // hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      // xFrameOptions: { action: 'deny' }, // same as X-Frame-Options: DENY
      // xContentTypeOptions: true,
    }),
  );
  app.use((_req: any, res: any, next: any) => {
    // Block features your API doesn’t need. Adjust as necessary.
    // Syntax: feature=(), or feature=("self" https://example.com)
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
        // (optional) disable FLoC / topics if your runtime recognizes it:
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
