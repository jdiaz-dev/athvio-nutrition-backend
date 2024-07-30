import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { GetQuestionaryConfigDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/get-questionary-config.dto';
import { QuestionaryConfigManager } from 'src/modules/professionals/questionary-configuration/application/questionary-configuration-manager.service';
import { QuestionaryConfig } from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config.schema';
import { AddQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/add-questionary-details.dto';
import { UpdateQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/update-questionary-details.dto';
import { DeleteQuestionaryDetailDto } from 'src/modules/professionals/questionary-configuration/adapters/in/dtos/delete-questionary-details.dto';

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
  addQuestionaryDetail(
    @Args('input') dto: AddQuestionaryDetailDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.addQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => QuestionaryConfig)
  updateQuestionaryDetail(
    @Args('input') dto: UpdateQuestionaryDetailDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.updateQuestionaryDetail(dto, selectors);
  }
  @Mutation(() => QuestionaryConfig)
  deleteQuestionaryDetail(
    @Args('input') dto: DeleteQuestionaryDetailDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ) {
    return this.qcm.deleteQuestionaryDetail(dto, selectors);
  }
}
