import 'reflect-metadata';
import { workerData, parentPort, MessagePort } from 'worker_threads';
import { monitorEventLoopDelay, performance } from 'perf_hooks';
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

  const port = configService.get<string>('port') || process.env.PORT;
  await app.listen(port, '0.0.0.0');
  console.log(`[Worker] Server running on port ${port}`);

  // Notify main thread the app is ready
  parentPort?.postMessage({ status: 'ready', port, startedAt: new Date().toISOString() });

  // ── Telemetry via dedicated MessageChannel injected by main thread ──────────
  const telemetryPort: MessagePort | undefined = workerData?.telemetryPort;

  if (!telemetryPort) {
    console.warn('[Worker] No telemetryPort in workerData — ELU will not be reported to main thread');
  } else {
    const histogram = monitorEventLoopDelay({ resolution: 10 });
    histogram.enable();
    let lastELU = performance.eventLoopUtilization();

    setInterval(() => {
      const currentELU = performance.eventLoopUtilization(lastELU);
      lastELU = performance.eventLoopUtilization();
      const mem = process.memoryUsage();

      telemetryPort.postMessage({
        elu: {
          utilization: parseFloat((currentELU.utilization * 100).toFixed(2)),
          lagMean_ms: parseFloat((histogram.mean / 1e6).toFixed(3)),
          lagMax_ms: parseFloat((histogram.max / 1e6).toFixed(3)),
          lagP99_ms: parseFloat((histogram.percentile(99) / 1e6).toFixed(3)),
        },
        uptime: process.uptime(),
        memoryUsage: {
          rss: mem.rss,
          heapUsed: mem.heapUsed,
          heapTotal: mem.heapTotal,
          external: mem.external,
        },
        timestamp: new Date().toISOString(),
      });

      histogram.reset();
    }, 1_000);
  }

  // ── Ping handler — lets main thread probe worker event loop latency ─────────
  parentPort?.on('message', (msg: any) => {
    if (msg?.__ping__ && msg.port) {
      msg.port.postMessage('pong');
      msg.port.close();
    }
  });
}

void bootstrap();
