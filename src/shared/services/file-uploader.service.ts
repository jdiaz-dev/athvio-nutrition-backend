import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import { finished } from 'stream/promises';
import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class FileUploaderService {
  constructor(private readonly logger: AthvioLoggerService) {}

  async uploadFileStream(readStream: Function, uploadDir: string, filename: string) {
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
