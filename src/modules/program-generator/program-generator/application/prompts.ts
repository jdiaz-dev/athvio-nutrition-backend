import { z } from 'zod';

const restrictionPrompt = 'Evita alimentos procesados y suplementos procesados.';
const betterCasePrompt = "Usa solamente alimentos orgánicos pero evita usar la palabra 'orgánico' en la respuesta.";
const undesiredCookingMethodPrompt = 'Evita añadir alimentos a la parrilla.';

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
  const planPeriodPrompt =
    `Crea un plan nutricional para ${days} dias en total.` +
    `Cada dia debe tener ${meals} comidas y al menos 3 ingredientes en cada comida (tambien puede tener más ingredientes).` +
    `Este plan nutricional esta destinado a curar ${stringDiseases}.`;
  return planPeriodPrompt + restrictionPrompt + betterCasePrompt + undesiredCookingMethodPrompt;
};

export const nutritionalPlanPrompt = (
  diseaseCauses: string,
  recommendationsForCauses: string,
  recommendationForDiseases: string,
  nutritionalPreferences: string,
) => {
  return (
    `La enfermedad fue causada por ${diseaseCauses}, por lo tanto debes revisar y cumplir solo y únicamente con las siguientes recomendaciones.` +
    `${recommendationsForCauses}.` +
    `${recommendationForDiseases}.` +
    `${nutritionalPreferences}.`
  );
};

const MacrosSchema = z.object({
  weightInGrams: z.number(),
  label: z.enum([
    'Unidad',
    'Unidades',
    'Cucharada',
    'Cucharadas',
    'Taza',
    'Tazas',
    'Rama',
    'Ramas',
    'Gramo',
    'Gramos',
    'Litro',
    'Litros',
    'Onza',
    'Onzas',
    'Libra',
    'Libras',
    'Mano',
    'Manos',
  ]),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  calories: z.number(),
  amount: z.number().min(1).max(1000),
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
  mealTag: z.enum(['Infusiones en ayunas', 'Desayuno', 'Almuerzo', 'Cena']),
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
