import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { StorageService } from 'src/shared/services/storage.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';

import { createWriteStream, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { finished } from 'stream/promises';

export const uploadFileStream = async (readStream: Function, uploadDir: string, filename: string) => {
  try {
    const fileName = filename;
    const filePath = join(uploadDir, fileName);
    mkdirSync(uploadDir, { recursive: true });
    const inStream = readStream();
    const outStream = createWriteStream(filePath);
    inStream.pipe(outStream);
    await finished(outStream);

    return filePath;
  } catch (error: unknown) {
    throw new InternalServerErrorException((error as Error).message);
  }
};

@Injectable()
export class UploadMealImageService {
  private uploadDir = 'uploads';
  constructor(private readonly storageService: StorageService, private readonly crps: NutritionalMealsPersistenceService) {}

  async uploadFile(file: UploadDto): Promise<string> {
    this.crps;
    for (const [index, image] of file.images.entries()) {
      const imageFile: any = await image;
      const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
      const uploadDir = join(process.cwd(), this.uploadDir, `nutritionalMeals_${'profileData.id'}`, 'images');
      const savedFilePath = await uploadFileStream(imageFile.createReadStream, uploadDir, fileName);

      const fileBuffer = readFileSync(savedFilePath);
      await this.storageService.saveFile('athvio-images', `nutritional-meals/${fileName}`, fileBuffer);
    }
    this.storageService;
    return 'feo';
  }
}
