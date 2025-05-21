import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { ProfessionalQuestionaryManager } from 'src/modules/questionaries/professional-questionaries/application/profesional-questionary-manager.service';
import { ProfessionalQuestionary } from 'src/modules/questionaries/professional-questionaries/adapters/out/professional-questionary.schema';
import { AddCustomQuestionaryDetailsDto } from 'src/modules/questionaries/professional-questionaries/adapters/in/dtos/add-custom-questionary-details.dto';
import { UpdateCustomQuestionaryDetailsDto } from 'src/modules/questionaries/professional-questionaries/adapters/in/dtos/update-custom-questionary-details.dto';
import { DeleteCustomQuestionaryDetailsDto } from 'src/modules/questionaries/professional-questionaries/adapters/in/dtos/delete-custom-questionary-details.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class CustomQuestionaryDetailResolver {
  constructor(private qcm: ProfessionalQuestionaryManager) {}
  @Mutation(() => ProfessionalQuestionary)
  addCustomQuestionaryDetails(
    @Args('toAddInput') dto: AddCustomQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.addQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => ProfessionalQuestionary)
  updateCustomQuestionaryDetails(
    @Args('toUpdateInput') dto: UpdateCustomQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.updateQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => ProfessionalQuestionary)
  deleteCustomQuestionaryDetails(
    @Args('toDeleteInput') dto: DeleteCustomQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.deleteQuestionaryDetail(dto, selectors);
  }
}
