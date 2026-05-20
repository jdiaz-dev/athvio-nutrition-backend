import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MealImageSources } from 'src/shared/enums/project';
import { PatientProgramsPersistenceService } from 'src/modules/patients/patient-programs/adapters/out/patient-programs-persistence.service';
import {
  GetPatientProgramsDto,
  GetPatientProgramsResponse,
} from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/get-patient-programs.dto';
import { CreatePatientProgramDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/create-patient-program.dto';
import { CreatePatientProgram } from 'src/modules/patients/patient-programs/types/patient-program';
import { PatientManagerService } from 'src/modules/patients/patients/application/patient-manager.service';
import { UpdatePatientProgramDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/update-patient-program.dto';
import { ErrorPatientProgramEnum } from 'src/shared/enums/messages-response';
import { DeletePatientProgramDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/delete-program.dto';

@Injectable()
export class PatientProgramsManagerService {
  constructor(
    private pps: PatientProgramsPersistenceService,
    private pms: PatientManagerService,
  ) {}
  async createPatientProgram(dto: CreatePatientProgramDto) {
    await this.pms.getPatient(dto.patient);
    const patientProgram = await this.pps.createPatientProgram({
      uuid: randomUUID(),
      ...dto,
    });
    return patientProgram;
  }
  async createPatientPrograms(patientPlans: CreatePatientProgram[]) {
    const patientProgram = await this.pps.createPatientPrograms(
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

    return patientProgram;
  }

  async getPatientPrograms(
    { patient, ...rest }: GetPatientProgramsDto,
    selectors: Record<string, number>,
  ): Promise<GetPatientProgramsResponse> {
    const programs = await this.pps.getPatientPrograms({ patient, ...rest }, selectors);
    return programs;
  }
  async updatePatientProgram(dto: UpdatePatientProgramDto) {
    const patientProgram = await this.pps.updatePatientProgram(dto);
    if (patientProgram == null) throw new BadRequestException(ErrorPatientProgramEnum.PATIENT_PROGRAM_NOT_FOUND);
    return patientProgram;
  }
  async deletePatientProgram(dto: DeletePatientProgramDto, selectors: string[]) {
    const patientProgram = await this.pps.deletePatientProgram(dto, selectors);
    if (patientProgram == null) throw new BadRequestException(ErrorPatientProgramEnum.PATIENT_PROGRAM_NOT_FOUND);
    return patientProgram;
  }
}
