import { Injectable } from '@nestjs/common';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { StorageService } from 'src/shared/services/storage.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';

@Injectable()
export class UploadMealImageService {
  constructor(private readonly storageService: StorageService, private readonly crps: NutritionalMealsPersistenceService) {}

  async uploadFile(file: UploadDto): Promise<string> {
    file;
    this.crps;

    await this.storageService.saveFile('athvio-images/nutritionalMeals', 'filename', 'fileStream');
    return 'feo';
  }
}
