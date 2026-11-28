import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { FormulasManagerService } from 'src/modules/health/formulas/application/formulas-manager.service';
import { BodyMassIndexManagerService } from 'src/modules/health/formulas/application/body-mass-index-manager.service';
import { Formula } from 'src/modules/health/formulas/adapters/out/formula.schema';
import { CalculateBodyMassIndexDto } from 'src/modules/health/formulas/adapters/in/dtos/calculate-body-mass-index.dto';
import { BodyMassIndexResult } from 'src/modules/health/formulas/adapters/in/dtos/body-mass-index-result.dto';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
export class FormulasResolver {
  constructor(
    private readonly fms: FormulasManagerService,
    private readonly bmims: BodyMassIndexManagerService,
  ) {}

  @Query(() => Formula)
  getFormula(@Info(...selectorExtractorForAggregation()) selectors: Record<string, number>): Promise<Formula> {
    return this.fms.getFormula(selectors);
  }

  @Query(() => BodyMassIndexResult)
  calculateBodyMassIndex(@Args('input') dto: CalculateBodyMassIndexDto): Promise<BodyMassIndexResult> {
    return this.bmims.calculateBodyMassIndex(dto);
  }
}
