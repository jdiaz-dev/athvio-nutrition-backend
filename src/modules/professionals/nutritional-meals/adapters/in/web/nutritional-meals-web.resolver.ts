import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/create-nutritional-meal.dto';
import { DeleteNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/delete-nutritional-meal.dto';
import { GetNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meal.dto';
import {
  GetNutritionalMealsForProfessionalDto,
  GetNutritionalMealsResponse,
} from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meals-for-professional.dto';
import { UpdateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/update-nutritional-meal.dto';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { NutritionalMealDatabases } from 'src/modules/professionals/nutritional-meals/helpers/constants';
import { UploadMealImageService } from 'src/modules/professionals/nutritional-meals/application/upload-meal-image.service';
import { UploadDto } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.dto';

@Resolver(() => NutritionalMeal)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class NutritionalMealsWebResolver {
  constructor(
    private readonly nmms: NutritionalMealsManagerService,
    private readonly uploadMealImageService: UploadMealImageService,
  ) {}

  @Query(() => [String])
  getNutritionalMealDatabases(): string[] {
    const res = Object.values(NutritionalMealDatabases);
    return res;
  }
  @Mutation(() => NutritionalMeal)
  createNutritionalMeal(@Args('input') dto: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    return this.nmms.createNutritionalMeal(dto);
  }

  @Query(() => NutritionalMeal)
  async getNutritionalMeal(
    @Args('input') dto: GetNutritionalMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<NutritionalMeal> {
    const nutritionalMeal = await this.nmms.getNutritionalMeal(dto, selectors);
    return nutritionalMeal;
  }

  @Query(() => GetNutritionalMealsResponse)
  async getNutritionalMealsForProfessional(
    @Args('input') dto: GetNutritionalMealsForProfessionalDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const nutritionalMeal = await this.nmms.getNutritionalMealsForProfessional(dto, selectors);
    return nutritionalMeal;
  }

  @Mutation(() => NutritionalMeal)
  async updateNutritionalMeal(@Args('input') dto: UpdateNutritionalMealDto): Promise<NutritionalMeal> {
    return this.nmms.updateNutritionalMeal(dto);
  }

  @Mutation(() => NutritionalMeal)
  deleteNutritionalMeal(@Args('input') dto: DeleteNutritionalMealDto): Promise<NutritionalMeal> {
    return this.nmms.deleteNutritionalMeal(dto);
  }
  @Mutation(() => NutritionalMeal)
  async uploadImage(@Args('input') file: UploadDto): Promise<NutritionalMeal> {
    return await this.uploadMealImageService.uploadImage(file);
  }
}
