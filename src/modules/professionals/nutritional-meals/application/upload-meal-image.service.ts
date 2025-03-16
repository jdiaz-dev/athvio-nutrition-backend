import { Injectable } from '@nestjs/common';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { StorageService } from 'src/shared/services/storage.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';

@Injectable()
export class UploadMealImageService {
  private uploadDir = 'uploads';
  private bucketName = 'athvio-images';
  constructor(
    private readonly nmps: NutritionalMealsPersistenceService,
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
    private readonly FileUploaderService: FileUploaderService,
  ) {}

  async uploadFile({ nutritionalMeal, image }: UploadDto): Promise<NutritionalMeal> {
    const mealDirectory = 'nutritional-meals';
    const storageUrl = this.configService.get<string>('storage.storageUrl');
    const { _id } = await this.nmps.getNutritionalMeal({ nutritionalMeal }, ['_id']);

    const imageFile: any = await image;
    const fileName = `${Date.now()}_${_id}_${imageFile.filename}`;
    const uploadDir = join(process.cwd(), this.uploadDir, mealDirectory);
    const savedFilePath = await this.FileUploaderService.uploadFileStream(imageFile.createReadStream, uploadDir, fileName);

    const fileBuffer = readFileSync(savedFilePath);
    await this.storageService.saveFile(this.bucketName, `${mealDirectory}/${fileName}`, fileBuffer);
    const res = await this.nmps.updateNutritionalMeal({
      nutritionalMeal: _id,
      image: `${storageUrl}/${mealDirectory}/${fileName}`,
    });
    return res;
  }
}
