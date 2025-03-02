import { GenerateNutritionalPlanDto } from '../adapters/in/dtos/generate-nutritional-plan.dto';
import { Injectable } from '@nestjs/common';
import { CreatePatientPlanManagerService } from 'src/modules/patients/patient-plans/application/create-patient-plan-manager.service';
import { DiseaseCausesPersistenceService } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause-persistence.service';
import { DiseasesPersistenceService } from 'src/modules/program-generator/diseases/adapters/out/diseases-persistence.service';
import { NutritionalPreferencesPersistenceService } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preferences-persistence.service';
import { NutritionalPlanGeneratorService } from 'src/modules/program-generator/program-generator/application/nutritional-plan-generator.service';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';

@Injectable()
export class GeneratorManagerService {
  constructor(
    private readonly dps: DiseasesPersistenceService,
    private readonly dcps: DiseaseCausesPersistenceService,
    private readonly npps: NutritionalPreferencesPersistenceService,
    private readonly npgs: NutritionalPlanGeneratorService,
    private readonly cppms: CreatePatientPlanManagerService,
    private readonly ppps: PatientPlansPreparatorService,
  ) {}
  async generateNutritionalPlanForPatient(dto: GenerateNutritionalPlanDto, selectors: Record<string, number>) {
    selectors;
    const diseaseCauses = await this.dcps.getDiseaseCauses(dto.diseaseCauses);
    const disease = await this.dps.getDiseases(dto.diseases);
    const nutritionalPreferences = await this.npps.getNutritionalPreferences(dto.nutritionalPreferences);

    const nutritionalPlan: any = await this.npgs.generateNutritionalPlan({
      stringDiseases: disease.map((item) => item.name).join(','),
      stringCauseDiseases: diseaseCauses.map((item) => item.name).join(','),
      stringNutritionalPreferences: nutritionalPreferences.map((item) => item.name).join(','),
    });

    const preparedPatientPlans: [] = [];
    this.ppps.preparePatientPlans(
      nutritionalPlan,
      { patient: dto.patient, assignmentStartDate: dto.startDate, startingDay: 1 },
      preparedPatientPlans,
      true,
    );
    const assignedNutritionalPlans = await this.cppms.createManyPatientPlan(preparedPatientPlans);
    return assignedNutritionalPlans;
  }
}
