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
  stringDiseases: string;
  stringCauseDiseases: string;
  stringNutritionalPreferences: string;
};
@Injectable()
export class NutritionalPlanGeneratorService {
  constructor(private gpt: GptService) {}
  async generateNutritionalPlan(params: Parameters): Promise<NutritionalDayPlanSchema[]> {
    const nutritionalPrompt =
      basicNutritionPrompt(params.stringDiseases) +
      nutritionalPlanPrompt(params.stringCauseDiseases, params.stringNutritionalPreferences);

    const res = await this.gpt.chatCompletion<PlansSchemaPromptType>(nutritionalPrompt, PlansSchemaPrompt);
    return res.plans;
  }
}
