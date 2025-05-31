import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/create-calory.dto';
import { Calory } from 'src/modules/patients/calories/adapters/out/calory.schema';
import { GetCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/get-calory.dto';
import { UpdateCaloryDto } from 'src/modules/patients/calories/adapters/in/dtos/update-calory.dto';
import { CaloryManagerService } from 'src/modules/patients/calories/application/calory-manager.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver(() => Calory)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class CaloryResolver {
  constructor(private ccs: CaloryManagerService) {}

  @Mutation(() => Calory)
  createCalory(@Args('input') dto: CreateCaloryDto): Promise<Calory> {
    return this.ccs.createCalory(dto);
  }

  @Query(() => Calory)
  async getCalory(
    @Args('input') dto: GetCaloryDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Calory> {
    return await this.ccs.getCalory(dto, selectors);
  }

  @Mutation(() => Calory)
  async updateCalory(@Args('input') dto: UpdateCaloryDto, @Info(...selectorExtractor()) selectors: string[]): Promise<Calory> {
    return this.ccs.updateCalory(dto, selectors);
  }
}
