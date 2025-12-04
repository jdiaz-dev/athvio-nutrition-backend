import { Module } from '@nestjs/common';
import { HttpHandlerService } from 'src/shared/adapters/out/network/http-handler.service';
import { HttpModule } from '@nestjs/axios';
import { PatientPlansPreparatorService } from 'src/shared/application/patient-plans-preparator.service';
import { StorageService } from 'src/shared/adapters/out/storage/storage.service';
import { FileUploaderService } from 'src/shared/application/file-uploader.service';
import { UploadScalar } from 'src/shared/adapters/in/graphql/upload.scalar';
import { UploadFileManagerService } from 'src/shared/application/upload-file-manager.service';
import { MealImagesManagerService } from 'src/shared/application/meal-images-manager.service';
import { FoodsProviderService } from 'src/shared/application/foods-provider.service';

@Module({
  imports: [HttpModule],
  providers: [
    HttpHandlerService,
    FoodsProviderService,
    StorageService,
    PatientPlansPreparatorService,
    FileUploaderService,
    UploadScalar,
    UploadFileManagerService,
    MealImagesManagerService,
  ],
  exports: [
    HttpHandlerService,
    FoodsProviderService,
    PatientPlansPreparatorService,
    FileUploaderService,
    StorageService,
    UploadScalar,
    UploadFileManagerService,
    MealImagesManagerService,
  ],
})
export class SharedModule {}
