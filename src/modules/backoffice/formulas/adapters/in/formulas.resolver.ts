import { UseGuards } from '@nestjs/common';
import { Info, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { FormulasManagerService } from 'src/modules/backoffice/formulas/application/formulas-manager.service';
import { Formula } from 'src/modules/backoffice/formulas/adapters/out/formula.schema';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class FormulasResolver {
  constructor(private readonly fms: FormulasManagerService) {}

  @Query(() => Formula)
  getFormula(@Info(...selectorExtractorForAggregation()) selectors: Record<string, number>): Promise<Formula> {
    return this.fms.getFormula(selectors);
  }
}
