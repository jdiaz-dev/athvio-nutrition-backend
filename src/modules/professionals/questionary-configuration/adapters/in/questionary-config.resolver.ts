import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { GetQuestionaryConfigDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/get-questionary-config.dto';
import { QuestionaryConfigManager } from 'src/modules/professionals/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { EnableQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/enable-questionary-detail.dto';

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
  enableQuestionaryDetail(
    @Args('input') dto: EnableQuestionaryDetailDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    return this.qcm.enableQuestionaryDetail(dto, selectors);
  }
}
