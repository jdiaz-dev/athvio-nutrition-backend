import { GetFoodsDto } from 'src/modules/program-generator/foods/adapters/in/dtos/get-foods.dto';

export type GetFoods = Omit<GetFoodsDto, 'targetLanguage'>;
