import { Module } from '@nestjs/common';
import { HttpHandlerService } from 'src/shared/services/http-handler.service';
import { HttpModule } from '@nestjs/axios';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';
import { StorageService } from 'src/shared/services/storage.service';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';
import { UploadFileManagerService } from 'src/shared/services/upload-file-manager.service';

@Module({
  imports: [HttpModule],
  providers: [
    HttpHandlerService,
    StorageService,
    PatientPlansPreparatorService,
    FileUploaderService,
    UploadScalar,
    UploadFileManagerService,
  ],
  exports: [
    HttpHandlerService,
    PatientPlansPreparatorService,
    FileUploaderService,
    StorageService,
    UploadScalar,
    UploadFileManagerService,
  ],
})
export class SharedModule {}
