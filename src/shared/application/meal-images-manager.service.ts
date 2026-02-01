import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { EnumSources, MealImageSources } from 'src/shared/enums/project';
import { UploadFileManagerService } from 'src/shared/application/upload-file-manager.service';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/web/dtos/meal/meal-body.input';
import { UploadDto } from 'src/shared/adapters/in/dtos/upload.dto';

@Injectable()
export class MealImagesManagerService {
  constructor(private readonly ufms: UploadFileManagerService) {}

  private async uploadImage({ meal, image: newImage }: UploadDto & { meal: string }): Promise<string> {
    const fileName = await this.ufms.uploadToStorage(EnumSources.PROFESSIONAL, meal, newImage);
    const url = await this.ufms.getFileUploadedUrl(fileName);

    return url;
  }
  async processImageMeals(meals: MealBodyInput[]) {
    const imageMealsProcessed = await Promise.all(
      meals.map(async ({ image, imageSource, ...rest }) => {
        const uuid = randomUUID();
        const isNonExistingMeal = !rest.meal;

        if (image && typeof image !== 'string') {
          return {
            ...(isNonExistingMeal && { uuid }),
            ...rest,
            image: (await this.uploadImage({
              meal: isNonExistingMeal ? uuid : rest.meal,
              image,
            })) as string,
            imageSource: MealImageSources.UPLOADED,
          };
        }

        return {
          ...(isNonExistingMeal && { uuid }),
          ...(image && { image: image as string }),
          ...(imageSource && { imageSource }),
          ...rest,
        };
      }),
    );
    return imageMealsProcessed;
  }
}
