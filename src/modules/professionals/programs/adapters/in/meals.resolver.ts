import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PlanMealsManagerService } from 'src/modules/professionals/programs/application/plan-meals-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class MealsResolver {
  constructor(private readonly pmms: PlanMealsManagerService) {}

  @Mutation(() => Program)
  createMeal(
    @Args('toAddInput') dto: AddMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.pmms.addMeal(dto, selectors);
  }

  @Mutation(() => Program)
  async updateMeal(
    @Args('toUpdateInput') dto: UpdateMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.pmms.updateMeal(dto, selectors);
  }

  @Mutation(() => Program)
  async deleteMeal(
    @Args('toDeleteInput') dto: DeleteMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.pmms.deleteMeal(dto, selectors);
  }
}
