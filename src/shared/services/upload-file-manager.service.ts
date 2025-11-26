import { Injectable } from '@nestjs/common';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { EnumSources } from 'src/shared/enums/project';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';
import { ConfigService } from '@nestjs/config';

enum TemporalRole {
  MASTER = 'master',
}

@Injectable()
export class UploadFileManagerService {
  private readonly mealDirectory = 'nutritional-meals';

  constructor(
    private readonly fileUploaderService: FileUploaderService,
    private readonly configService: ConfigService,
  ) {}
  async getFileUploadedUrl(fileName: string, role?: string): Promise<string> {
    return role === TemporalRole.MASTER
      ? `${this.configService.get<string>('storage.internalFoodStorageUrl')}/${this.mealDirectory}/${fileName}`
      : `${this.configService.get<string>('storage.foodImagesStorageUrl')}/${fileName}`;
  }
  getFilenameUploadedFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  async uploadToStorage(source: EnumSources, uuid: string, image: UploadScalar, role?: string): Promise<string> {
    let fileName: string;
    if (source === EnumSources.SYSTEM && role === TemporalRole.MASTER) {
      fileName = await this.fileUploaderService.uploadFile(
        this.configService.get<string>('storage.internalFoodImagesStorage'),
        uuid,
        image as unknown as Promise<any>,
        this.configService.get<string>('storage.internalFoodImagesDirectory'),
      );
    } else {
      fileName = await this.fileUploaderService.uploadFile(
        this.configService.get<string>('storage.foodImagesStorage'),
        uuid,
        image as unknown as Promise<any>,
      );
    }
    return fileName;
  }
}
