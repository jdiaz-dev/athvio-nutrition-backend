import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FoodParsedResponse } from 'src/modules/foods/adapters/out/providers/food.types';
import { ErrorFoodsProvider } from 'src/shared/enums/messages-response';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';

@Injectable()
export class FoodsProviderService {
  constructor(private http: HttpWrapperService, private configService: ConfigService) {}

  async getFoods(foodText: string): Promise<FoodParsedResponse> {
    const baseUrl = this.configService.get('foodProvider.foodApi.edamamFoodParserUrl');
    const parserDomain = '/api/food-database/v2/parser';
    const appId = this.configService.get('foodProvider.foodApi.edamamFoodAppId');
    const key = this.configService.get('foodProvider.foodApi.edamamFoodKey');

    const url = `${baseUrl}${parserDomain}?app_id=${appId}&app_key=${key}&ingr=${foodText}`;

    const res = await this.http.get<FoodParsedResponse>(url, ErrorFoodsProvider.FOOD_PARSER);
    return res;
  }
  autoCompleteText() {}
}
