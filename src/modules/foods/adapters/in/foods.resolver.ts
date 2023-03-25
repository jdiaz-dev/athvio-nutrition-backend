import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetFoodsDto, GetFoodsResponse } from 'src/modules/foods/adapters/in/dtos/get-foods.dto';
import { FoodsPersistenceService } from 'src/modules/foods/adapters/out/foods-persistence.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';

@Resolver()
export class FoodsResolver {
  constructor(private readonly fps: FoodsPersistenceService) {}
  @Query(() => GetFoodsResponse)
  @UseGuards(AuthorizationGuard)
  async getFoods(@Args('input') dto: GetFoodsDto): Promise<GetFoodsResponse> {
    const clientGroup = await this.fps.getFoods(dto);
    return clientGroup;
  }
}
