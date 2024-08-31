import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { QuestionaryConfigManager } from 'src/modules/professionals/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { AddCustomQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/add-custom-questionary-details.dto';
import { UpdateCustomQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/update-custom-questionary-details.dto';
import { DeleteCustomQuestionaryDetailsDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/delete-custom-questionary-details.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class CustomQuestionaryDetailResolver {
  constructor(private qcm: QuestionaryConfigManager) {}
  @Mutation(() => QuestionaryConfig)
  addCustomQuestionaryDetails(
    @Args('toAdd') dto: AddCustomQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.addQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => QuestionaryConfig)
  updateCustomQuestionaryDetails(
    @Args('toUpdate') dto: UpdateCustomQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.updateQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => QuestionaryConfig)
  deleteCustomQuestionaryDetails(
    @Args('toDelete') dto: DeleteCustomQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.deleteQuestionaryDetail(dto, selectors);
  }
}
