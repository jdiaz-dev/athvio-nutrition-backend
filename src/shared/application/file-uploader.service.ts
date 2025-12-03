import { join } from 'node:path';
import { readFileSync, createWriteStream, mkdirSync } from 'node:fs';
import { finished } from 'node:stream/promises';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { StorageService } from 'src/shared/adapters/out/storage/storage.service';

@Injectable()
export class FileUploaderService {
  private readonly localUploadDir = 'uploads';
  private readonly localNestedDirectory = 'nutritional-meals';

  constructor(
    private readonly storageService: StorageService,
    private readonly logger: AthvioLoggerService,
  ) {}

  async uploadFile(storageName: string, entityId: string, file: Promise<any>, directory?: string): Promise<string> {
    const fileData = await file;
    const fileName = `${Date.now()}_${entityId}_${fileData.filename}`;
    const uploadDir = join(process.cwd(), this.localUploadDir, this.localNestedDirectory);
    const savedFilePath = await this.uploadFileInLocalDirectory(fileData.createReadStream, uploadDir, fileName);

    const fileBuffer = readFileSync(savedFilePath);
    await this.storageService.saveFile(storageName, directory ? `${directory}/${fileName}` : fileName, fileBuffer);
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
