import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { FoodsPersistenceService } from 'src/modules/foods/adapters/out/foods-persistence.service';
import { GetFoodsService } from 'src/modules/foods/application/get-foods.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';

@Resolver()
export class FoodsResolver {
  constructor(private readonly fps: FoodsPersistenceService, private readonly gfs: GetFoodsService) {}

  @Query(() => GetFoodsResponse)
  @UseGuards(AuthorizationGuard)
  async getFoods(@Args('input') dto: GetFoodsDto): Promise<GetFoodsResponse> {
    const clientGroup = await this.fps.getFoods(dto);
    clientGroup;
    const data = await this.gfs.getFoods(dto.search[0]);

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
}
/*
  name
  macros { //apply for custom recipes, edamam foods
    protein
    carbs
    fat
    calories
  }
  defaultMeasure :100g
  foodId?: string
  measures?: [
    {
      uri
      label
      weight (in grams)
    }
  ]

*/
