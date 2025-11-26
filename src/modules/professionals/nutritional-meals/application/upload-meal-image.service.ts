import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { WrapperType } from 'src/shared/types.d';
import { MealImageSources } from 'src/shared/enums/project';
import { UploadImageToDefaultMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload-image-to-default-meal.dto';
import { UploadFileManagerService } from 'src/shared/services/upload-file-manager.service';
import { StorageService } from 'src/shared/services/storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadMealImageService {
  constructor(
    @Inject(forwardRef(() => NutritionalMealsManagerService)) private readonly nmms: WrapperType<NutritionalMealsManagerService>,
    private readonly nmps: NutritionalMealsPersistenceService,
    private readonly ufms: UploadFileManagerService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  private async deleteOldImage(imageSource?: string, image?: string): Promise<void> {
    if (imageSource === MealImageSources.UPLOADED && image) {
      await this.storageService.deleteFile(
        this.configService.get<string>('storage.foodImagesStorage'),
        this.ufms.getFilenameUploadedFromUrl(image),
      );
    }
  }
  async uploadImage({
    nutritionalMeal,
    image: newImage,
    role,
  }: UploadDto & Partial<UploadImageToDefaultMealDto>): Promise<NutritionalMeal> {
    const { uuid, source, imageSource, image } = await this.nmms.getNutritionalMeal(
      { nutritionalMeal },
      { _id: 1, uuid: 1, source: 1, imageSource: 1, image: 1 },
    );

    const fileName = await this.ufms.uploadToStorage(source, uuid, newImage, role);
    const url = await this.ufms.getFileUploadedUrl(fileName, role);
    await this.deleteOldImage(imageSource, image);
    const res = await this.nmps.updateNutritionalMeal({
      nutritionalMeal: uuid,
      image: url,
      imageSource: MealImageSources.UPLOADED,
    });
    return res;
  }
}
