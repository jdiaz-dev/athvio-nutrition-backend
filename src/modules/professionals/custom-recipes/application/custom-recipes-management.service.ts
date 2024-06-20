import { Injectable } from '@nestjs/common';

import { CustomRecipe } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipe.schema';
import { CreateCustomRecipeDto } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/create-custom-recipe.dto';
import { CustomRecipesPersistenceService } from 'src/modules/professionals/custom-recipes/adapters/out/custom-recipes-persistence.service';
import { ProfessionalsPersistenceService } from 'src/modules/professionals/professionals/adapters/out/professionals-persistence.service';

@Injectable()
export class CustomRecipesManagementService {
  constructor(private pps: ProfessionalsPersistenceService, private crps: CustomRecipesPersistenceService) {}

  async createCustomRecipe(dto: CreateCustomRecipeDto): Promise<CustomRecipe> {
    await this.pps.getProfessionalById(dto.professional, { _id: 1 });
    const customRecipe = await this.crps.createCustomRecipe(dto);
    return customRecipe;
  }
}
