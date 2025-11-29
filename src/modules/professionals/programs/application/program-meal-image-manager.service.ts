import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { UploadDto } from 'src/shared/dtos/upload.dto';
import { EnumSources, MealImageSources } from 'src/shared/enums/project';
import { UploadFileManagerService } from 'src/shared/services/upload-file-manager.service';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';

@Injectable()
export class ProgramMealImageManagerService {
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

        if (image && typeof image !== 'string') {
          return {
            uuid,
            ...rest,
            image: (await this.uploadImage({
              meal: uuid,
              image,
            })) as string,
            imageSource: MealImageSources.UPLOADED,
          };
        }

        return {
          uuid,
          ...(image && { image: image as string }),
          ...(imageSource && { imageSource }),
          ...rest,
        };
      }),
    );
    return imageMealsProcessed;
  }
}
