import { Meal } from 'src/shared/adapters/database/schemas/meal-plan';

export type WrapperType<T> = T;

export type Trazability = {
  traceId: string;
};
