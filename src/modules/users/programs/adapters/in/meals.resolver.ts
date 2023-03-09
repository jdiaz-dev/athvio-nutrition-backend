import { UseGuards } from '@nestjs/common';
import { Args, Context, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { AddPlanMealDto } from 'src/modules/users/programs/adapters/in/dtos/plan-meal/add-plan-meal.dto';
import { MealsPersistenceService } from 'src/modules/users/programs/adapters/out/meals-persistence.service';
import { Program } from 'src/modules/users/programs/adapters/out/program.schema';
import { selectorExtractor } from 'src/shared/helpers/functions';

@Resolver()
export class MealsResolver {
  constructor(private readonly mps: MealsPersistenceService) {}

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  createPlanMeal(
    @Args('input') dto: AddPlanMealDto,
    @Context() context: any,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.addPlanMeal(dto, context.req.user.userId, selectors);
  }

  /* @Query(() => Program)
  @UseGuards(AuthorizationGuard)
  async getProgram(
    @Args('input') dto: GetProgramDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    const program = await this.mps.getProgram(dto, context.userId, selectors);
    return program;
  }

  @Query(() => [Program])
  @UseGuards(AuthorizationGuard)
  async getPrograms(
    @Args('input') dto: GetProgramsDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program[]> {
    const program = await this.mps.getPrograms(dto, context.userId, selectors);
    return program;
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async updateProgram(@Args('input') dto: UpdateProgramDto, @CurrentUser() context: IUserContext): Promise<Program> {
    return this.mps.updateProgram(dto, context.userId);
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async addProgramTag(
    @Args('input') dto: AddProgramTagDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.addProgramTag(dto, context.userId, selectors);
  }
  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  deleteProgram(
    @Args('input') dto: DeleteProgramDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.deleteProgram(dto, context.userId, selectors);
  } */
}
