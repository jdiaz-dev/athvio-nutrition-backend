import { InternalFood } from 'src/shared/adapters/out/schemas/internal-food.schema';
import { GetRecordsResponse } from 'src/shared/adapters/in/dtos/get-records-response';
import { GetFoodsDto } from 'src/modules/nutrition/foods/adapters/in/dtos/get-foods.dto';

export type GetFoods = Omit<GetFoodsDto, 'targetLanguage'>;

export type GetInternalFoodsResponse = GetRecordsResponse & {
  data: InternalFood[];
};
