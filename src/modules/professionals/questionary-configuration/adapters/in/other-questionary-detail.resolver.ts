import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { QuestionaryConfigManager } from 'src/modules/professionals/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { AddOtherQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/add-other-questionary-details.dto';
import { UpdateOtherQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/update-other-questionary-details.dto';
import { DeleteOtherQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/delete-other-questionary-details.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class OtherQuestionaryDetailResolver {
  constructor(private qcm: QuestionaryConfigManager) {}
  @Mutation(() => QuestionaryConfig)
  addOtherQuestionaryDetails(
    @Args('toAdd') dto: AddOtherQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.addQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => QuestionaryConfig)
  updateOtherQuestionaryDetails(
    @Args('toUpdate') dto: UpdateOtherQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.updateQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => QuestionaryConfig)
  deleteOtherQuestionaryDetails(
    @Args('toDelete') dto: DeleteOtherQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.deleteQuestionaryDetail(dto, selectors);
  }
}
