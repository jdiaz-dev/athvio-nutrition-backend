import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';
import { FileUploaderService } from 'src/shared/services/file-uploader.service';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { WrapperType } from 'src/shared/types.d';
import { EnumSources } from 'src/shared/enums/project';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';
import { ConfigService } from '@nestjs/config';
import { UploadImageToDefaultMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload-image-to-default-meal.dto';

enum TemporalRole {
  MASTER = 'master',
}

@Injectable()
export class UploadMealImageService {
  private readonly mealDirectory = 'nutritional-meals';

  constructor(
    @Inject(forwardRef(() => NutritionalMealsManagerService)) private readonly nmms: WrapperType<NutritionalMealsManagerService>,
    private readonly nmps: NutritionalMealsPersistenceService,
    private readonly fileUploaderService: FileUploaderService,
    private readonly configService: ConfigService,
  ) {
    console.log(this.configService.get<string>('storage'));
  }
  private async uploadImageToStorage(source: EnumSources, uuid: string, image: UploadScalar, role?: string): Promise<string> {
    let fileName: string;
    if (source === EnumSources.SYSTEM && role === TemporalRole.MASTER) {
      fileName = await this.fileUploaderService.uploadFile(
        this.configService.get<string>('storage.foodInternalImagesStorage'),
        uuid,
        image as unknown as Promise<any>,
        this.configService.get<string>('storage.foodInternalImagesDirectory'),
      );
    } else {
      fileName = await this.fileUploaderService.uploadFile(
        this.configService.get<string>('storage.foodImagesStorage'),
        uuid,
        image as unknown as Promise<any>,
      );
    }
    return fileName;
  }
  private async getBaseUrl(role?: string, fileName?: string): Promise<string> {
    return role === TemporalRole.MASTER
      ? `${this.configService.get<string>('storage.foodInternalStorageUrl')}/${this.mealDirectory}/${fileName}`
      : `${this.configService.get<string>('storage.foodImagesStorageUrl')}/${fileName}`;
  }
  async uploadImage({
    nutritionalMeal,
    image,
    role,
  }: UploadDto & Partial<UploadImageToDefaultMealDto>): Promise<NutritionalMeal> {
    const { uuid, source } = await this.nmms.getNutritionalMeal({ nutritionalMeal }, { _id: 1, uuid: 1, source: 1 });

    const fileName = await this.uploadImageToStorage(source, uuid, image, role);
    const imageBaseUrl = await this.getBaseUrl(role, fileName);

    const res = await this.nmps.updateNutritionalMeal({
      nutritionalMeal: uuid,
      image: `${imageBaseUrl}/${this.mealDirectory}/${fileName}`,
    });
    return res;
  }
}
