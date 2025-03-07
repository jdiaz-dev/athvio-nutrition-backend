import { z } from 'zod';

const restrictionPrompt = 'Void processed foods and processed supplements. ';
const betterCasePrompt = "Use only organic foods but you void use 'organic' word in the response. ";
const undesiredCookingMethodPrompt = 'Void to add grilled foods. ';

export const basicNutritionPrompt = (
  stringDiseases: string,
  days: number,
  meals: number,
  _macros: {
    carbs: number;
    protein: number;
    fat: number;
    calories: number;
  },
) => {
  days;
  const planPeriodPrompt = `"""Build a nutritional plan for ${days} days in total""". """Every day must have ${meals} meals and at least 3 ingredients in every meal""". """It nutritional plan is intended to heal ${stringDiseases}""".`;
  const macros = `"""Every day must be configured with ${_macros.calories} kcal""".`;
  return planPeriodPrompt + macros + restrictionPrompt + betterCasePrompt + undesiredCookingMethodPrompt;
};

export const nutritionalPlanPrompt = (
  diseases: string,
  recommendationsForCauses: string,
  recommendationForDiseases: string,
  nutritionalPreferences: string,
) => {
  return `The diseases was caused by ${diseases}, therefore include mainly this recommendations: ${recommendationsForCauses}, ${recommendationForDiseases} and include these nutritional preferences: ${nutritionalPreferences}`;
};

const MacrosSchema = z.object({
  weightInGrams: z.number(),
  label: z.enum(['Tablespoon', 'Cup', 'Stick', 'Gram', 'Ounce', 'Pound', 'Pat']),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  calories: z.number(),
  amount: z.number(),
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
  name: z.string(),
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
