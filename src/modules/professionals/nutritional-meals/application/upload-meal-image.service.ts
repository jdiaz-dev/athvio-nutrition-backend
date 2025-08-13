import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { WrapperType } from 'src/shared/types.d';

@Injectable()
export class UploadMealImageService {
  private readonly mealDirectory = 'nutritional-meals';

  constructor(
    @Inject(forwardRef(() => NutritionalMealsManagerService)) private readonly nmms: WrapperType<NutritionalMealsManagerService>,
    private readonly nmps: NutritionalMealsPersistenceService,
    private readonly fileUploaderService: FileUploaderService,
  ) {}

  async uploadImage({ nutritionalMeal, image }: UploadDto): Promise<NutritionalMeal> {
    const { uuid } = await this.nmms.getNutritionalMeal({ nutritionalMeal }, { _id: 1, uuid: 1 });
    const fileName = await this.fileUploaderService.uploadFile(uuid, image as unknown as Promise<any>, this.mealDirectory);
    const res = await this.nmps.updateNutritionalMeal({
      nutritionalMeal: uuid,
      image: `${this.fileUploaderService.storageUrl}/${this.mealDirectory}/${fileName}`,
    });
    return res;
  }
}
