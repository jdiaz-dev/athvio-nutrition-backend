import { Module } from '@nestjs/common';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';
import { AthvioLoggerService } from 'src/shared/services/athvio-logger.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';

@Module({
  imports: [HttpModule, LoggerModule.forRoot()],
  providers: [HttpWrapperService, AthvioLoggerService, PatientPlansPreparatorService],
  exports: [HttpWrapperService, AthvioLoggerService, PatientPlansPreparatorService],
})
export class SharedModule {}
