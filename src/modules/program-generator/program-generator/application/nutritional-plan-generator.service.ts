import { Injectable } from '@nestjs/common';

import { GptService } from 'src/modules/program-generator/gpt/adapters/out/gpt.service';
import {
  basicNutritionPrompt,
  NutritionalDayPlanSchema,
  nutritionalPlanPrompt,
  PlansSchemaPrompt,
  PlansSchemaPromptType,
} from 'src/modules/program-generator/program-generator/application/prompts';

type Parameters = {
  diseases: string;
  diseaseCauses: string;
  recommendationsForCauses: string;
  recommendationForDiseases: string;
  nutritionalPreferences: string;
  totalDays: number;
  mealsByDay: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
    calories: number;
  };
};
@Injectable()
export class NutritionalPlanGeneratorService {
  constructor(private gpt: GptService) {}
  async generateNutritionalPlan({
    diseaseCauses,
    recommendationsForCauses,
    diseases,
    recommendationForDiseases,
    nutritionalPreferences,
    totalDays,
    mealsByDay,
    macros,
  }: Parameters): Promise<NutritionalDayPlanSchema[]> {
    const nutritionalPrompt =
      basicNutritionPrompt(diseases, totalDays, mealsByDay, macros) +
      nutritionalPlanPrompt(diseaseCauses, recommendationsForCauses, recommendationForDiseases, nutritionalPreferences) +
      `Debes cumplir con el objetivo calórico establecido para cada dia (${macros.calories} kcal).` +
      `Para cumplir con el objetivo calórico, incluye ingredientes alto en calorías.` +
      'Los ingredientes pueden ser simples o compuestos, ejemplo: zanahoria, jugo de zanahoria.' +
      'Asegurate que los macros para cada ingrediente sea bien calculado deacuerdo de acuerdo a la cantidad.' +
      'Los valores de los atributos deben estar en español';

    const res = await this.gpt.chatCompletion<PlansSchemaPromptType>(nutritionalPrompt, PlansSchemaPrompt);
    return res.plans;
  }
}
