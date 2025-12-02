import { Module } from '@nestjs/common';
import { HttpHandlerService } from 'src/shared/services/http-handler.service';
import { HttpModule } from '@nestjs/axios';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';
import { StorageService } from 'src/shared/services/storage.service';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';
import { UploadFileManagerService } from 'src/shared/services/upload-file-manager.service';
import { MealImagesManagerService } from 'src/shared/services/meal-images-manager.service';
import { MongoDbModule } from 'src/shared/infrastructure/mongodb.module';
import { FoodsProviderService } from 'src/shared/services/foods-provider.service';

@Module({
  imports: [MongoDbModule, HttpModule],
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
