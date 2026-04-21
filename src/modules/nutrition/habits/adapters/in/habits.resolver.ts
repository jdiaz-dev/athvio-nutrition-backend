import { UseGuards } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { Habit } from 'src/modules/nutrition/habits/adapters/out/habits.schema';
import { HabitsManagerService } from 'src/modules/nutrition/habits/application/habits-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class HabitsResolver {
  constructor(private readonly hms: HabitsManagerService) {}

  @Query(() => [Habit])
  getHabits(@Info(...selectorExtractorForAggregation()) selectors: Record<string, number>): Promise<Habit[]> {
    return this.hms.getHabits(selectors);
  }
}
