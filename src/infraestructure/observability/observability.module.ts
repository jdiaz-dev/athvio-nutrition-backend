import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { Options } from 'pino-http';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { AsyncLocalStorage } from 'node:async_hooks';

@Global()
@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({
      pinoHttp: [
        {
          name: 'athvio-log',
          autoLogging: false,
          transport: {
            target: 'pino-pretty',
          },
        },
      ] as Options,
    }),
  ],
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    AthvioLoggerService,
  ],
  exports: [AsyncLocalStorage, AthvioLoggerService],
})
export class ObservabilityModule {}
