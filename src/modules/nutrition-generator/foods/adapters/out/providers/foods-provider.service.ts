import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FoodParsedResponse } from 'src/modules/nutrition-generator/foods/adapters/out/providers/food.types';
import { ErrorFoodsProvider } from 'src/shared/enums/messages-response';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';

@Injectable()
export class FoodsProviderService {
  private readonly baseUrl: string;
  private readonly appId: string;
  private readonly key: string;

  constructor(private http: HttpWrapperService, private configService: ConfigService) {
    this.baseUrl = this.configService.get('foodProvider.foodApi.edamamFoodParserUrl');
    this.appId = this.configService.get('foodProvider.foodApi.edamamFoodAppId');
    this.key = this.configService.get('foodProvider.foodApi.edamamFoodKey');
  }

  async getFoods(ingredientsText = '', session?: string): Promise<FoodParsedResponse> {
    const parserDomain = '/api/food-database/v2/parser';
    const url = `${this.baseUrl}${parserDomain}?app_id=${this.appId}&app_key=${this.key}&ingr=${ingredientsText}`;
    const nextUrl = `${this.baseUrl}${parserDomain}?session=${session}&app_id=${this.appId}&app_key=${this.key}&ingr=${ingredientsText}`;

    const res = await this.http.get<FoodParsedResponse>(session ? nextUrl : url, ErrorFoodsProvider.GET_FOOD);
    return res;
  }
  async autoCompleteText(foodText: string): Promise<string[]> {
    const autoCompleteDomain = '/auto-complete';
    const url = `${this.baseUrl}${autoCompleteDomain}?app_id=${this.appId}&app_key=${this.key}&q=${foodText}`;
    const res = await this.http.get<string[]>(url, ErrorFoodsProvider.FOOD_AUTOCOMPLETE);
    return res;
  }
}
