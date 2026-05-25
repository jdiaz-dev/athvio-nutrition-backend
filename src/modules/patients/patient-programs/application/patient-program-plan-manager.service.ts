import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AddPatientProgramPlanDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/add-patient-program-plan.dto';
import { DeletePatientProgramPlanDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/delete-patient-program-plan.dto';
import { DuplicatePatientProgramPlanDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/duplicate-patient-program-plan.dto';
import { UpdatePatientProgramPlanWeekDayDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/update-patient-program-plan-week-day.dto';
import { PatientProgramPlansPersistenceService } from 'src/modules/patients/patient-programs/adapters/out/patient-program-plans-persistence.service';
import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { PatientProgramsManagerService } from 'src/modules/patients/patient-programs/application/patient-programs-manager.service';
import { MealImagesManagerService } from 'src/shared/application/meal-images-manager.service';
import { ErrorPatientProgramEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PatientProgramPlanManagerService {
  constructor(
    private readonly pms: PatientProgramsManagerService,
    private readonly pppps: PatientProgramPlansPersistenceService,
    private readonly mims: MealImagesManagerService,
  ) {}

  async addPatientProgramPlan(
    { patient, patientProgram, planBody }: AddPatientProgramPlanDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const { meals, ...rest } = planBody;
    const imageMealsProcessed = await this.mims.processImageMeals(meals);

    const patientProgramRes = await this.pppps.addPatientProgramPlanWithMeals(
      {
        patient,
        patientProgram,
        planBody: {
          uuid: randomUUID(),
          ...rest,
          meals: imageMealsProcessed,
        },
      },
      selectors,
    );
    if (patientProgramRes == null) throw new BadRequestException(ErrorPatientProgramEnum.PATIENT_PROGRAM_NOT_FOUND);
    return patientProgramRes;
  }
  async duplicatePatientProgramPlan(
    { patient, patientProgram, plan, day, week }: DuplicatePatientProgramPlanDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const _patientProgram = await this.pms.getPatientProgram(
      { patient, patientProgram, plan },
      { plans: 1, name: 1, description: 1 },
    );

    for (let x = 0; x < _patientProgram.plans[0].meals.length; x++) {
      delete _patientProgram.plans[0].meals[x]._id;
      delete _patientProgram.plans[0].meals[x].updatedAt;
    }
    const baseProgramPlan = _patientProgram.plans[0];
    const programUpdated = await this.pppps.addPatientProgramPlanWithMeals(
      {
        patient,
        patientProgram,
        planBody: {
          uuid: randomUUID(),
          day,
          week,
          title: baseProgramPlan.title,
          meals: baseProgramPlan.meals,
          planDetail: { isDuplicate: true, source: plan },
        },
      },
      selectors,
    );
    return programUpdated;
  }
  async updatePatientProgramPlanWeekDay(
    dto: UpdatePatientProgramPlanWeekDayDto,
    selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    const programRes = await this.pppps.updatePatientProgramPlanWeekDay(dto, selectors);
    if (programRes == null) throw new BadRequestException(ErrorPatientProgramEnum.PATIENT_PROGRAM_NOT_FOUND);

    return programRes;
  }
  async deletePatientProgramPlan(dto: DeletePatientProgramPlanDto, selectors: string[]): Promise<PatientProgram> {
    const programRes = await this.pppps.deletePatientProgramPlan(dto, selectors);
    if (programRes == null) throw new BadRequestException(ErrorPatientProgramEnum.PATIENT_PROGRAM_NOT_FOUND);

    return programRes;
  }
}
