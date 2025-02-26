import { Module } from '@nestjs/common';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';
import { HttpModule } from '@nestjs/axios';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';

@Module({
  imports: [HttpModule],
  providers: [HttpWrapperService, PatientPlansPreparatorService],
  exports: [HttpWrapperService, PatientPlansPreparatorService],
})
export class SharedModule {}
