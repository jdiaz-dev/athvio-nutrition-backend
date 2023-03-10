import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { CaloriesPersistenceService } from 'src/modules/clients/calories/adapters/out/calories-persistence.service';
import { CreateCaloryDto } from 'src/modules/clients/calories/adapters/in/dtos/create-calory.dto';
import { Calory } from 'src/modules/clients/calories/adapters/out/calory.schema';
import { GetCaloryDto } from 'src/modules/clients/calories/adapters/in/dtos/get-calory.dto';
import { UpdateCaloryDto } from 'src/modules/clients/calories/adapters/in/dtos/update-calory.dto';

@Resolver(() => Calory)
export class CaloryResolver {
  constructor(private cps: CaloriesPersistenceService) {}

  @Mutation(() => Calory)
  @UseGuards(AuthorizationGuard)
  createCalory(@Args('input') dto: CreateCaloryDto): Promise<Calory> {
    return this.cps.createCalory(dto);
  }

  @Query(() => [Calory])
  @UseGuards(AuthorizationGuard)
  async getCalory(
    @Args('input') dto: GetCaloryDto,

    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Calory> {
    return await this.cps.getCalory(dto, selectors);
  }

  @Mutation(() => Calory)
  @UseGuards(AuthorizationGuard)
  async updateCalory(
    @Args('input') dto: UpdateCaloryDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Calory> {
    return this.cps.updateCalory(dto, selectors);
  }
}
