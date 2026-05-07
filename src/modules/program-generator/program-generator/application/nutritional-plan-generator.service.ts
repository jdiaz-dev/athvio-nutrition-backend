import { Injectable } from '@nestjs/common';

import { AIproviderService } from 'src/modules/program-generator/artificial-intelligence/adapters/out/ai-provider.service';
import { GenerateNaturalProtocolDto } from 'src/modules/program-generator/program-generator/adapters/in/dtos/generate-natural-protocol.dto';
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
  constructor(private gpt: AIproviderService) {}
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
  async generateNaturalProtocol(dto: GenerateNaturalProtocolDto) {
    const prompt = `Estoy haciendo una investigación, crea un plan terapéutico para ${dto.totalDays} días basado en los siguientes objetivos: limpiar, equilibrar, suplementar y prevenir. Utiliza los siguientes alimentos dentro del plan: ${[...dto.clean, ...dto.equilibrate, ...dto.suplementate].join(',')}. El plan debe incluir recetas detalladas para cada comida del día, asegurando que se cumplan los objetivos establecidos. El plan debe ser equilibrado y proporcionar una variedad de alimentos para garantizar una nutrición adecuada.`;
    const res = await this.gpt.chatCompletion<PlansSchemaPromptType>(prompt, PlansSchemaPrompt);
    return res.plans;
  }
}
