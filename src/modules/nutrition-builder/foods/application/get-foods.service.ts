import { Injectable } from '@nestjs/common';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/nutrition-builder/foods/adapters/in/dtos/get-foods.dto';
import { ProviderFoodTransformerService } from 'src/modules/nutrition-builder/foods/adapters/out/providers/provider-foods-transformer.service';
import { FoodDatabases } from 'src/shared/enums/project';

@Injectable()
export class GetFoodsService {
  constructor(private readonly foodsTransformer: ProviderFoodTransformerService) {}

  async getFoods(dto: GetFoodsDto): Promise<GetFoodsResponse> {
    //default search
    /* if (dto.foodDatabase === FoodDatabases.ALL && dto.search[0] === '') {
      return this.foodsTransformer.getFoodFromProvider(dto);
    } */
    if (dto.foodDatabase === FoodDatabases.SYSTEM) {
      return this.foodsTransformer.getFoodFromProvider(dto);
    }

    const [providerFoods] = await Promise.all([this.foodsTransformer.getFoodFromProvider(dto)]);

    return {
      data: [...providerFoods.data],
      meta: {
        total: providerFoods.meta.total,
        limit: dto.limit,
        offset: dto.offset,
      },
    };
  }
}
