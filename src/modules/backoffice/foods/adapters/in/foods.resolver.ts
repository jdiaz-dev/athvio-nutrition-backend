import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  GetAutocompleteFoodNamesDto,
  GetAutocompleteFoodNamesResponse,
} from 'src/modules/backoffice/foods/adapters/in/dtos/get-autocomplete-food-names.dto';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/backoffice/foods/adapters/in/dtos/get-foods.dto';
import { FoodTextSearcherService } from 'src/modules/backoffice/foods/application/food-text-searcher.service';
import { GetFoodsService } from 'src/modules/backoffice/foods/application/get-foods.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { FoodDatabases } from 'src/shared/enums/project';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class FoodsResolver {
  constructor(private readonly gfs: GetFoodsService, private readonly ftss: FoodTextSearcherService) {}

  @Query(() => [String])
  getFoodDatabases(): string[] {
    const res = Object.values(FoodDatabases);
    return res;
  }

  @Query(() => GetFoodsResponse)
  async getFoods(@Args('input') dto: GetFoodsDto): Promise<GetFoodsResponse> {
    const res = await this.gfs.getFoods(dto);
    return res;
  }

  @Query(() => GetAutocompleteFoodNamesResponse)
  async getAutoCompleteFoodNames(@Args('input') dto: GetAutocompleteFoodNamesDto): Promise<GetAutocompleteFoodNamesResponse> {
    const data = await this.ftss.getFoodNames(dto);
    return { foodNames: data };
  }
}
