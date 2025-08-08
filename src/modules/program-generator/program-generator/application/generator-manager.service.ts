import { GenerateNutritionalPlanDto } from '../adapters/in/dtos/generate-nutritional-plan.dto';
import { Injectable } from '@nestjs/common';
import { CreatePatientPlanManagerService } from 'src/modules/patients/patient-plans/application/create-patient-plan-manager.service';
import { DiseaseCausesManagerService } from 'src/modules/program-generator/disease-causes/application/disease-causes-manager.service';
import { DiseasesManagerService } from 'src/modules/program-generator/diseases/application/diseases-manager.service';
import { NutritionalPreferencesManagerService } from 'src/modules/program-generator/nutritional-preferences/application/nutritional-preferences-manager.service';
import { NutritionalPlanGeneratorService } from 'src/modules/program-generator/program-generator/application/nutritional-plan-generator.service';
import { PatientPlansPreparatorService } from 'src/shared/services/patient-plans-preparator.service';

@Injectable()
export class GeneratorManagerService {
  constructor(
    private readonly dms: DiseasesManagerService,
    private readonly dcms: DiseaseCausesManagerService,
    private readonly npms: NutritionalPreferencesManagerService,
    private readonly npgs: NutritionalPlanGeneratorService,
    private readonly cppms: CreatePatientPlanManagerService,
    private readonly ppps: PatientPlansPreparatorService,
  ) {}
  async generateNutritionalPlanForPatient(dto: GenerateNutritionalPlanDto, selectors: Record<string, number>) {
    selectors;
    const diseaseCauses = await this.dcms.getDiseaseCauses(dto.diseaseCauses, dto.diseases);
    const diseases = await this.dms.getDiseases(dto.diseases);
    const nutritionalPreferences = await this.npms.getNutritionalPreferences(dto.nutritionalPreferences);

    let _diseaseCauses = diseaseCauses.map((dc) => dc.name).join(',');

    let recommendationsForCauses: string[] = diseaseCauses.flatMap((dc) => dc.recommendations.map((r) => r.details));
    recommendationsForCauses = [...new Set(recommendationsForCauses)];
    const recommendationForCuasesJoined = recommendationsForCauses.join('.');

    let _diseases = diseases.map((d) => d.name).join('.');
    let recommendationForDiseases = diseases.flatMap((d) => d.recommendations.map((r) => r.details)).join('.');

    const nutritionalPlan: any = await this.npgs.generateNutritionalPlan({
      diseaseCauses: _diseaseCauses,
      diseases: _diseases,
      recommendationsForCauses: recommendationForCuasesJoined,
      recommendationForDiseases,
      nutritionalPreferences: nutritionalPreferences.flatMap((item) => item.spanishDetails).join('.'),
      totalDays: dto.totalDays,
      mealsByDay: dto.mealsByDay,
      macros: dto.macros,
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
