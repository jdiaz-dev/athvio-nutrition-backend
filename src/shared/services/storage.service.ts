import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ErrorStorageEnum } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class StorageService {
  private s3client: S3Client;
  constructor(private readonly logger: AthvioLoggerService) {
    this.s3client = new S3Client({
      region: process.env.REGION,
    });
  }

  async saveFile(bucketName: string, fileName: string, fileContent: Buffer) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
        ACL: 'public-read',
      });
      const res = await this.s3client.send(command);
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(ErrorStorageEnum.SAVE_FILE);
    }
  }
  async deleteFile(bucketName: string, fileName: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
      const res = await this.s3client.send(command);
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(ErrorStorageEnum.DELETE_FILE);
    }
  }
}
