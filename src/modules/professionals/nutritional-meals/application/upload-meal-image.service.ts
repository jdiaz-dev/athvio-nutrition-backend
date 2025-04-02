import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';

@Injectable()
export class UploadMealImageService {
  private readonly mealDirectory = 'nutritional-meals';

  constructor(
    @Inject(forwardRef(() => NutritionalMealsManagerService)) private readonly nmms: NutritionalMealsManagerService,
    private readonly nmps: NutritionalMealsPersistenceService,
    private readonly fileUploaderService: FileUploaderService,
  ) {}

  async uploadImage({ nutritionalMeal, image }: UploadDto): Promise<NutritionalMeal> {
    const { _id } = await this.nmms.getNutritionalMeal({ nutritionalMeal }, ['_id']);
    const fileName = await this.fileUploaderService.uploadFile(_id, image as unknown as Promise<any>, this.mealDirectory);
    const res = await this.nmps.updateNutritionalMeal({
      nutritionalMeal: _id,
      image: `${this.fileUploaderService.storageUrl}/${this.mealDirectory}/${fileName}`,
    });
    return res;
  }
}
