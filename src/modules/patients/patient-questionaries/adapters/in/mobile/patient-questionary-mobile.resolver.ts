import { Args, Info, Query, Resolver, Mutation } from '@nestjs/graphql';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientQuestionaryManagerService } from 'src/modules/patients/patient-questionaries/application/patient-questionary-manager.service';
import { PatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/patient-questionary.schema';
import { UpdateAnswersDto } from 'src/modules/patients/patient-questionaries/adapters/in/mobile/dtos/update-answers.dto';
import { GetQuestionaryForPatientDto } from 'src/modules/patients/patient-questionaries/adapters/in/mobile/dtos/get-questionary-for-patient.dto';

@Resolver()
export class PatientQuestionaryMobileResolver {
  constructor(private readonly pqms: PatientQuestionaryManagerService) {}

  @Query(() => PatientQuestionary)
  getQuestionaryForPatient(
    @Args('input') dto: GetQuestionaryForPatientDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.pqms.getQuestionaryForPatient(dto, selectors);
  }
  @Mutation(() => PatientQuestionary)
  updatePatientQuestionaryAnswers(
    @Args('input') dto: UpdateAnswersDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    return this.pqms.updateAnswers(dto, selectors);
  }
}
