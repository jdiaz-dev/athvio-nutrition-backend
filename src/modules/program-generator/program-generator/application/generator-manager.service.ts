import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { GenerateNutritionalPlanDto } from '../adapters/in/dtos/generate-nutritional-plan.dto';
import { Injectable } from '@nestjs/common';
import { DiseaseCausesPersistenceService } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause-persistence.service';
import { DiseasesPersistenceService } from 'src/modules/program-generator/diseases/adapters/out/diseases-persistence.service';
import { NutritionalPreferencesPersistenceService } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preferences-persistence.service';
import { NutritionalPlanGeneratorService } from 'src/modules/program-generator/program-generator/application/nutritional-plan-generator.service';

@Injectable()
export class GeneratorManagerService {
  constructor(
    private readonly dps: DiseasesPersistenceService,
    private readonly dcps: DiseaseCausesPersistenceService,
    private readonly npps: NutritionalPreferencesPersistenceService,
    private readonly npgs: NutritionalPlanGeneratorService,
  ) {}
  async generateNutritionalPlanForPatient(
    dto: GenerateNutritionalPlanDto,
    selectors: Record<string, number>,
  ): Promise<PatientPlan[]> {
    const _selectors = { _id: 1, name: 1 };
    selectors;
    const diseaseCauses = await this.dcps.getDiseaseCauses(dto.diseaseCauses, _selectors);
    const disease = await this.dps.getDiseases(dto.diseases, _selectors);
    const nutritionalPreferences = await this.npps.getNutritionalPreferences(dto.nutritionalPreferences, _selectors);

    const nutritionalPlan = await this.npgs.generateNutritionalPlan({
      stringDiseases: disease.map((item) => item.name).join(','),
      stringCauseDiseases: diseaseCauses.map((item) => item.name).join(','),
      stringNutritionalPreferences: nutritionalPreferences.map((item) => item.name).join(','),
    });

    return nutritionalPlan as PatientPlan[];
  }
}
