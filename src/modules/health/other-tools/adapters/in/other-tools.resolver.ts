import { UseGuards } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/nestjs/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { OtherTool } from 'src/modules/health/other-tools/adapters/out/other-tool.schema';
import { OtherToolsManagerService } from 'src/modules/health/other-tools/application/other-tools-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class OtherToolsResolver {
  constructor(private readonly otms: OtherToolsManagerService) {}

  @Query(() => [OtherTool])
  getOtherTools(@Info(...selectorExtractorForAggregation()) selectors: Record<string, number>): Promise<OtherTool[]> {
    return this.otms.getOtherTools(selectors);
  }
}
