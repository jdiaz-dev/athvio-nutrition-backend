import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  GetAutocompleteFoodNamesDto,
  GetAutocompleteFoodNamesResponse,
} from 'src/modules/foods/adapters/in/dtos/get-autocomplete-food-names.dto';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { FoodsPersistenceService } from 'src/modules/foods/adapters/out/foods-persistence.service';
import { FoodTextSearcherService } from 'src/modules/foods/application/food-text-searcher.service';
import { GetFoodsService } from 'src/modules/foods/application/get-foods.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class FoodsResolver {
  constructor(
    private readonly fps: FoodsPersistenceService,
    private readonly gfs: GetFoodsService,
    private readonly ftss: FoodTextSearcherService,
  ) {}

  @Query(() => GetFoodsResponse)
  async getFoods(@Args('input') dto: GetFoodsDto): Promise<GetFoodsResponse> {
    const clientGroup = await this.fps.getFoods(dto);
    clientGroup;
    const data = await this.gfs.getFoods(dto);

    data.forEach((food) => {
      console.log('------food', food.measures);
    });

    const res: GetFoodsResponse = {
      data,
      meta: {
        limit: dto.limit,
        offset: dto.offset,
        total: data.length,
      },
    };

    return res;
  }

  @Query(() => GetAutocompleteFoodNamesResponse)
  getAutoCompleteFoodNames(@Args('input') dto: GetAutocompleteFoodNamesDto): Promise<GetAutocompleteFoodNamesResponse> {
    return this.ftss.getFoodNames(dto);
  }
}
