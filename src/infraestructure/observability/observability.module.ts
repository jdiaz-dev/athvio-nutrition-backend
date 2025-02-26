import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { Options } from 'pino-http';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

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
  providers: [AthvioLoggerService],
  exports: [AthvioLoggerService],
})
export class ObservabilityModule {}
