import { Module } from '@nestjs/common';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';
import { HttpModule } from '@nestjs/axios';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';
import { StorageService } from 'src/shared/services/storage.service';

@Module({
  imports: [HttpModule],
  providers: [HttpWrapperService, StorageService, PatientPlansPreparatorService],
  exports: [HttpWrapperService, StorageService, PatientPlansPreparatorService],
})
export class SharedModule {}
