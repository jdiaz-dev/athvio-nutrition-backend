import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientQuestionaryManager } from 'src/modules/questionaries/patient-questionaries/application/patient-questionary-manager.service';
import { PatientQuestionary } from 'src/modules/questionaries/patient-questionaries/adapters/out/patient-questionary.schema';
import { GetPatientQuestionaryDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/get-patient-questionary.dto';
import { UpdateAnswerAndAdditionalNotesDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/update-custom-questionary-details.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientQuestionaryResolver {
  constructor(private qcm: PatientQuestionaryManager) {}

  @Query(() => PatientQuestionary)
  getPatientQuestionary(
    @Args('input') dto: GetPatientQuestionaryDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.qcm.getPatientQuestionary(dto, selectors);
  }
  @Mutation(() => PatientQuestionary)
  updateAnswerAndAdditionalNotes(
    @Args('input') dto: UpdateAnswerAndAdditionalNotesDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.qcm.updateAnswerAndAdditionalNotes(dto, selectors);
  }
}
