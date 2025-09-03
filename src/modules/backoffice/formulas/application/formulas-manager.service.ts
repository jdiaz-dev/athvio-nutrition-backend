import { Injectable } from '@nestjs/common';
import { Formula } from 'src/modules/backoffice/formulas/adapters/out/formula.schema';
import { FormulasPersistenceService } from 'src/modules/backoffice/formulas/adapters/out/formulas-persistence.service';

@Injectable()
export class FormulasManagerService {
  constructor(private readonly fps: FormulasPersistenceService) {}
  async getFormula(selectors: Record<string, number>): Promise<Formula> {
    const res = await this.fps.getFormula('Metabolismo basal', selectors);
    return res;
  }
}
