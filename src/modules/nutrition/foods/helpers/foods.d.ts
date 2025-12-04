import { GetFoodsDto } from 'src/modules/backoffice/foods/adapters/in/dtos/get-foods.dto';
import { InternalFood } from 'src/shared/adapters/out/schemas/internal-food.schema';
import { GetRecordsResponse } from 'src/shared/adapters/in/dtos/get-records-response';

export type GetFoods = Omit<GetFoodsDto, 'targetLanguage'>;

export type GetInternalFoodsResponse = GetRecordsResponse & {
  data: InternalFood[];
};
