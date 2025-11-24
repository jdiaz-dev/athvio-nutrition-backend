import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { UploadMealImageService } from 'src/modules/professionals/nutritional-meals/application/upload-meal-image.service';
import { UploadImageToDefaultMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload-image-to-default-meal.dto';

@Resolver(() => NutritionalMeal)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class NutritionalMealsSystemResolver {
  constructor(private readonly uploadMealImageService: UploadMealImageService) {}
  @Mutation(() => NutritionalMeal)
  async uploadImageToDefaultMeal(@Args('input') file: UploadImageToDefaultMealDto): Promise<NutritionalMeal> {
    return await this.uploadMealImageService.uploadImage(file);
  }
}
