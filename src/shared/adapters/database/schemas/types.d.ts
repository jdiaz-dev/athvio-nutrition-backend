import { Meal } from 'src/shared/adapters/database/schemas/meal-plan';

export type RequiredDataMeal = Omit<Meal, '_id' | 'isDeleted' | 'createdAt' | 'updatedAt'>;
