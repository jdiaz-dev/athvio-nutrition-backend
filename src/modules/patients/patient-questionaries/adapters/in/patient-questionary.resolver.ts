import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientQuestionaryManagerService } from 'src/modules/patients/patient-questionaries/application/patient-questionary-manager.service';
import { PatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary.schema';
import { GetPatientQuestionaryDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/get-patient-questionary.dto';
import { UpdateAnswersAndAdditionalNotesDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/update-answers-and-additional-notes.dto';
import { SendPatientQuestionaryDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/send-patient-questionary.dto';
import { SendPatientQuestionaryService } from 'src/modules/patients/patient-questionaries/application/send-patient-questionary.service';
import { UpdateAnswersDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/update-answers.dto';
import { GetPatientQuestionaryByIdDto } from 'src/modules/patients/patient-questionaries/adapters/in/dtos/get-patient-questionary-by-id';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientQuestionaryResolver {
  constructor(
    private readonly pqms: PatientQuestionaryManagerService,
    private readonly spqs: SendPatientQuestionaryService,
  ) {}

  @Query(() => PatientQuestionary)
  getPatientQuestionary(
    @Args('input') dto: GetPatientQuestionaryDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.pqms.getPatientQuestionary(dto, selectors);
  }
  @Query(() => PatientQuestionary)
  getPatientQuestionaryById(
    @Args('input') dto: GetPatientQuestionaryByIdDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.pqms.getPatientQuestionaryById(dto, selectors);
  }
  @Mutation(() => PatientQuestionary)
  updatePatientQuestionaryAnswers(
    @Args('input') dto: UpdateAnswersDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.pqms.updateAnswers(dto, selectors);
  }
  @Mutation(() => PatientQuestionary)
  updateAnswersAndAdditionalNotes(
    @Args('input') dto: UpdateAnswersAndAdditionalNotesDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.pqms.updateAnswerAndAdditionalNotes(dto, selectors);
  }
  @Mutation(() => Boolean)
  sendPatientQuestionary(@Args('input') dto: SendPatientQuestionaryDto): Promise<boolean> {
    return this.spqs.sendPatientQuestionary(dto);
  }
}
