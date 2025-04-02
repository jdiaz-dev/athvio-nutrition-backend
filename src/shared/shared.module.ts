import { Module } from '@nestjs/common';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';
import { HttpModule } from '@nestjs/axios';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';
import { StorageService } from 'src/shared/services/storage.service';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';

@Module({
  imports: [HttpModule],
  providers: [HttpWrapperService, StorageService, PatientPlansPreparatorService, FileUploaderService, UploadScalar],
  exports: [HttpWrapperService, PatientPlansPreparatorService, FileUploaderService, UploadScalar],
})
export class SharedModule {}
