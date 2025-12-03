import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { GetProfessionalQuestionaryDto } from 'src/modules/professionals/professional-questionaries/adapters/in/dtos/get-professional-questionary.dto';
import { ProfessionalQuestionaryManager } from 'src/modules/professionals/professional-questionaries/application/profesional-questionary-manager.service';
import { ProfessionalQuestionary } from 'src/modules/professionals/professional-questionaries/adapters/out/professional-questionary.schema';
import { EnableQuestionaryDetailsDto } from 'src/modules/professionals/professional-questionaries/adapters/in/dtos/enable-questionary-details.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class ProfessionalQuestionaryResolver {
  constructor(private qcm: ProfessionalQuestionaryManager) {}

  @Query(() => ProfessionalQuestionary)
  getProfessionalQuestionary(
    @Args('input') dto: GetProfessionalQuestionaryDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    return this.qcm.getProfessionalQuestionary(dto.professional, selectors);
  }
  @Mutation(() => ProfessionalQuestionary)
  enableQuestionaryDetails(
    @Args('input') dto: EnableQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    return this.qcm.enableQuestionaryDetails(dto, selectors);
  }
}
