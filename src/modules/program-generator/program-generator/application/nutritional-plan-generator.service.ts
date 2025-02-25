import { Injectable } from '@nestjs/common';

import { GptService } from 'src/modules/program-generator/gpt/adapters/out/gpt.service';
import { basicNutritionPrompt, nutritionalPlanPrompt } from 'src/modules/program-generator/program-generator/application/prompts';

type Parameters = {
  stringDiseases: string;
  stringCauseDiseases: string;
  stringNutritionalPreferences: string;
};
@Injectable()
export class NutritionalPlanGeneratorService {
  constructor(private gpt: GptService) {}
  async generateNutritionalPlan(params: Parameters): Promise<any[]> {
    const nutritionalPrompt =
      basicNutritionPrompt(params.stringDiseases) +
      nutritionalPlanPrompt(params.stringCauseDiseases, params.stringNutritionalPreferences);

    const res = await this.gpt.chatCompletion(nutritionalPrompt);
    return res.nutritionalDayPlans;
  }
}
