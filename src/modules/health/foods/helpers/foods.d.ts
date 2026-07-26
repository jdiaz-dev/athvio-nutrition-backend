import { InternalFood } from 'src/shared/adapters/out/schemas/internal-food.schema';
import { GetRecordsResponse } from 'src/shared/adapters/nestjs/dtos/get-records-response';
import { GetFoodsDto } from 'src/modules/health/foods/adapters/in/dtos/get-foods.dto';

export type GetFoods = Omit<GetFoodsDto, 'targetLanguage'>;

export type GetInternalFoodsResponse = GetRecordsResponse & {
  data: InternalFood[];
};
