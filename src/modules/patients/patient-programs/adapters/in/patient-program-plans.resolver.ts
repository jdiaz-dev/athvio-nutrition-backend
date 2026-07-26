import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientProgramPlanManagerService } from 'src/modules/patients/patient-programs/application/patient-program-plan-manager.service';
import { AddPatientProgramPlanDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/add-patient-program-plan.dto';
import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { UpdatePatientProgramPlanWeekDayDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/update-patient-program-plan-week-day.dto';
import { DuplicatePatientProgramPlanDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/duplicate-patient-program-plan.dto';
import { DeletePatientProgramPlanDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plans/delete-patient-program-plan.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientProgramPlansResolver {
  constructor(private readonly pppms: PatientProgramPlanManagerService) {}

  @Mutation(() => PatientProgram)
  addPatientProgramPlan(
    @Args('input') dto: AddPatientProgramPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    return this.pppms.addPatientProgramPlan(dto, selectors);
  }

  @Mutation(() => PatientProgram)
  async duplicatePatientProgramPlan(
    @Args('input') dto: DuplicatePatientProgramPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    return await this.pppms.duplicatePatientProgramPlan(dto, selectors);
  }
  @Mutation(() => PatientProgram)
  async updatePatientProgramPlanWeekDay(
    @Args('input') dto: UpdatePatientProgramPlanWeekDayDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    return this.pppms.updatePatientProgramPlanWeekDay(dto, selectors);
  }

  @Mutation(() => PatientProgram)
  async deletePatientProgramPlan(
    @Args('input') dto: DeletePatientProgramPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientProgram> {
    return this.pppms.deletePatientProgramPlan(dto, selectors);
  }
}
