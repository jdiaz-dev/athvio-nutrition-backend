import { GetFoodsDto } from 'src/modules/backoffice/foods/adapters/in/dtos/get-foods.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

export type GetFoods = Omit<GetFoodsDto, 'targetLanguage'>;

export type GetInternalFoodsResponse = GetRecordsResponse & {
  data: InternalFood[];
};
