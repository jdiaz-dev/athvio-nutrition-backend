import { z } from 'zod';

const restrictionPrompt = 'Void processed foods and supplements. ';
const betterCasePrompt = "Use only organic foods but you void use 'organic' word in the response. ";
const undesiredCookingMethodPrompt = 'Void to add grilled foods. ';

export const basicNutritionPrompt = (stringDiseases: string, days: number = 7, meals: number = 2) => {
  const planPeriodPrompt = `Build a nutritional plan to heal ${stringDiseases}, must be for ${days} days, every day must have ${meals} meals and 3 ingredients in every meal. `;
  return planPeriodPrompt + restrictionPrompt + betterCasePrompt + undesiredCookingMethodPrompt;
};

export const nutritionalPlanPrompt = (stringCauseDiseases: string, nutritionalPreferences: string) => {
  return `The diseases was caused by ${stringCauseDiseases}, must include these nutritional preferences: ${nutritionalPreferences}`;
};

const MacrosSchema = z.object({
  weightInGrams: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  calories: z.number(),
});

const IngredientSchema = z
  .object({
    name: z.string(),
  })
  .merge(MacrosSchema);

const IngredientDetailSchema = z.object({
  ingredient: IngredientSchema,
  // equivalents: z.array(IngredientSchema),
});

const MealSchema = z.object({
  mealTag: z.string(),
  cookingInstructions: z.string(),
  ingredientDetails: z.array(IngredientDetailSchema),
  macros: MacrosSchema,
});

const NutritionalDayPlanSchema = z.object({
  day: z.number(),
  meals: z.array(MealSchema),
});

export type NutritionalDayPlanSchema = z.infer<typeof NutritionalDayPlanSchema>;

export const PlansSchemaPrompt = z.object({
  plans: z.array(NutritionalDayPlanSchema),
});
export type PlansSchemaPromptType = z.infer<typeof PlansSchemaPrompt>;
