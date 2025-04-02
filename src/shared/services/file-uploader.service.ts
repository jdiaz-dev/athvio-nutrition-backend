import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import { readFileSync } from 'fs';
import { finished } from 'stream/promises';
import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { StorageService } from 'src/shared/services/storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploaderService {
  private readonly uploadDir = 'uploads';
  private readonly bucketName = 'athvio-images';
  public readonly storageUrl: string;

  constructor(
    private readonly storageService: StorageService,
    private readonly logger: AthvioLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.storageUrl = this.configService.get<string>('storage.storageUrl');
  }

  async uploadFile(entityId: string, file: Promise<any>, directory: string): Promise<string> {
    const fileData = await file;
    const fileName = `${Date.now()}_${entityId}_${fileData.filename}`;
    const uploadDir = join(process.cwd(), this.uploadDir, directory);
    const savedFilePath = await this.uploadFileInLocalDirectory(fileData.createReadStream, uploadDir, fileName);

    const fileBuffer = readFileSync(savedFilePath);
    await this.storageService.saveFile(this.bucketName, `${directory}/${fileName}`, fileBuffer);
    return fileName;
  }
  private async uploadFileInLocalDirectory(readStream: Function, uploadDir: string, filename: string) {
    try {
      const filePath = join(uploadDir, filename);
      mkdirSync(uploadDir, { recursive: true });
      const inStream = readStream();
      const outStream = createWriteStream(filePath);
      inStream.pipe(outStream);
      await finished(outStream);

      return filePath;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
