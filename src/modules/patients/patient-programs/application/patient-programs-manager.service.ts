import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { MealImageSources } from 'src/shared/enums/project';
import { PatientProgramsPersistenceService } from 'src/modules/patients/patient-programs/adapters/out/patient-programs-persistence.service';
import {
  GetPatientProgramsDto,
  GetPatientProgramsResponse,
} from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/get-patient-programs.dto';
import { CreatePatientProgram } from 'src/modules/patients/patient-programs/types/patient-program';

@Injectable()
export class PatientProgramsManagerService {
  constructor(private pps: PatientProgramsPersistenceService) {}

  async createPatientPrograms(patientPlans: CreatePatientProgram[]) {
    const program = await this.pps.createPatientPrograms(
      patientPlans.map(({ plans, ...rest }) => ({
        uuid: randomUUID(),
        ...rest,
        ...(plans && {
          plans: plans.map(({ meals, ...restPlan }) => ({
            ...restPlan,
            uuid: randomUUID(),
            meals: meals.map(({ image, ...restMeal }) => ({
              ...restMeal,
              ...(image && { image, imageSource: MealImageSources.PROGRAM }),
              uuid: randomUUID(),
            })),
          })),
        }),
      })),
    );

    return program;
  }

  async getPatientPrograms(
    { patient, ...rest }: GetPatientProgramsDto,
    selectors: Record<string, number>,
  ): Promise<GetPatientProgramsResponse> {
    const programs = await this.pps.getPatientPrograms({ patient, ...rest }, selectors);
    return programs;
  }
}
