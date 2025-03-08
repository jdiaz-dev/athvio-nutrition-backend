import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';

export type GetNutritionalMeals = Pick<NutritionalMeal, 'patient'> & Partial<Pick<Chat, 'professional'>>;
