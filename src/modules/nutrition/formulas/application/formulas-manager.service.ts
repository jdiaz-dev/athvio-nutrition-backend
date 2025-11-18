import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Formula } from 'src/modules/nutrition/formulas/adapters/out/formula.schema';
import { FormulasPersistenceService } from 'src/modules/nutrition/formulas/adapters/out/formulas-persistence.service';
import { FormulaErrorEnum } from 'src/modules/nutrition/formulas/domain/formula.enum';

@Injectable()
export class FormulasManagerService {
  constructor(private readonly fps: FormulasPersistenceService) {}
  async getFormula(selectors: Record<string, number>): Promise<Formula> {
    const res = await this.fps.getFormula('Metabolismo basal', selectors);
    if (res === null) throw new InternalServerErrorException(FormulaErrorEnum.FORMULA_NOT_FOUND);
    return res;
  }
}
