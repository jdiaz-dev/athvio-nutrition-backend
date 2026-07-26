import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/nestjs/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientProgramMealsManagerService } from 'src/modules/patients/patient-programs/application/patient-program-meals-manager.service';
import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { AddPatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/add-patient-program-meal.dto';
import { DeletePatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/delete-patient-program-meal.dto';
import { UpdatePatientProgramMealDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program-plan-meals/update-patient-program-meal.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientProgramMealsResolver {
  constructor(private readonly pmms: PatientProgramMealsManagerService) {}

  @Mutation(() => PatientProgram)
  createPatientProgramMeal(
    @Args('toAddInput') dto: AddPatientProgramMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    return this.pmms.addPatientProgramMeal(dto, selectors);
  }

  @Mutation(() => PatientProgram)
  async updatePatientProgramMeal(
    @Args('toUpdateInput') dto: UpdatePatientProgramMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    return this.pmms.updatePatientProgramMeal(dto, selectors);
  }

  @Mutation(() => PatientProgram)
  async deletePatientProgramMeal(
    @Args('toDeleteInput') dto: DeletePatientProgramMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientProgram> {
    return this.pmms.deletePatientProgramMeal(dto, selectors);
  }
}
