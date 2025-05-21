import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { GetQuestionaryConfigDto } from 'src/modules/questionaries/questionary-configuration/adapters/in/dtos/get-questionary-config.dto';
import { QuestionaryConfigManager } from 'src/modules/questionaries/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfig } from 'src/modules/questionaries/questionary-configuration/adapters/out/questionary-config.schema';
import { EnableQuestionaryDetailsDto } from 'src/modules/questionaries/questionary-configuration/adapters/in/dtos/enable-questionary-details.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class QuestionaryConfigResolver {
  constructor(private qcm: QuestionaryConfigManager) {}

  @Query(() => QuestionaryConfig)
  getQuestionary(
    @Args('input') dto: GetQuestionaryConfigDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    return this.qcm.getQuestionaryConfig(dto.professional, selectors);
  }
  @Mutation(() => QuestionaryConfig)
  enableQuestionaryDetails(
    @Args('input') dto: EnableQuestionaryDetailsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    return this.qcm.enableQuestionaryDetails(dto, selectors);
  }
}
