import { Module } from '@nestjs/common';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';
import { AthvioLoggerService } from 'src/shared/services/athvio-logger.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [HttpModule, LoggerModule.forRoot()],
  providers: [HttpWrapperService, AthvioLoggerService],
  exports: [HttpWrapperService, AthvioLoggerService],
})
export class SharedModule {}
