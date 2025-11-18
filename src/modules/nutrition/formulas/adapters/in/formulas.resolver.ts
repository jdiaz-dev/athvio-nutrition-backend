import { Info, Query, Resolver } from '@nestjs/graphql';
import { FormulasManagerService } from 'src/modules/nutrition/formulas/application/formulas-manager.service';
import { Formula } from 'src/modules/nutrition/formulas/adapters/out/formula.schema';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
export class FormulasResolver {
  constructor(private readonly fms: FormulasManagerService) {}

  @Query(() => Formula)
  getFormula(@Info(...selectorExtractorForAggregation()) selectors: Record<string, number>): Promise<Formula> {
    return this.fms.getFormula(selectors);
  }
}
