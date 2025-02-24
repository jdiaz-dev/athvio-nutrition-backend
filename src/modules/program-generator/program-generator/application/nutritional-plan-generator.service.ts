import { Injectable } from '@nestjs/common';

import { GptService } from 'src/modules/program-generator/gpt/adapters/out/gpt.service';
import {
  basicNutritionPrompt,
  detailJsonPrompt,
  nutritionalPlanPrompt,
  planJsonStructurePrompt,
} from 'src/modules/program-generator/program-generator/application/prompts';

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
      basicNutritionPrompt() +
      nutritionalPlanPrompt(params.stringDiseases, params.stringCauseDiseases, params.stringNutritionalPreferences) +
      planJsonStructurePrompt +
      detailJsonPrompt;
    const res = await this.gpt.chatCompletion(nutritionalPrompt);
    return res.nutritionalDayPlans;
  }
}
