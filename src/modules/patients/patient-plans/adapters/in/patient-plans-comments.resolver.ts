import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddPatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/add-patient-plan-comment.dto';
import { DeletePatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/delete-patient-plan-comment.dto';
import { UpdatePatientPlanCommentDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/patient-plan-comment/update-patient-plan-comment.dto';
import { PatientPlanCommentPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-comment-persistence.service';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { AddPatientPlanCommentService } from 'src/modules/patients/patient-plans/application/add-patient-plan-comment.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';

@Resolver()
export class PatientPlanCommentsResolver {
  constructor(private cpcps: PatientPlanCommentPersistenceService, private acpcs: AddPatientPlanCommentService) {}

  @Mutation(() => PatientPlan)
  @UseGuards(AuthorizationGuard)
  addPatientPlanComment(
    @Args('input') dto: AddPatientPlanCommentDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientPlan> {
    return this.acpcs.addPatientPlanComment(dto, selectors);
  }

  @Mutation(() => PatientPlan)
  @UseGuards(AuthorizationGuard)
  async updatePatientPlanComment(
    @Args('input') dto: UpdatePatientPlanCommentDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientPlan> {
    return this.cpcps.updatePatientPlanComment(dto, selectors);
  }

  @Mutation(() => PatientPlan)
  @UseGuards(AuthorizationGuard)
  async deletePatientPlanComment(
    @Args('input') dto: DeletePatientPlanCommentDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<PatientPlan> {
    return this.cpcps.deletePatientPlanComment(dto, selectors);
  }
}
