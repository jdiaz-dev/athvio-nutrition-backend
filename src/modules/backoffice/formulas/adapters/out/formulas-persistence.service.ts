import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Formula, FormulaDocument } from 'src/modules/backoffice/formulas/adapters/out/formula.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';

@Injectable()
export class FormulasPersistenceService extends MongodbQueryBuilder<FormulaDocument> {
  constructor(
    @InjectModel(Formula.name) protected readonly formulaModel: Model<FormulaDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(formulaModel, logger, Formula.name);
  }
  async getFormula(groupName: string, selectors: Record<string, number>): Promise<Formula> {
    const res = await this.initializeQuery(this.getFormula.name).findOne({ spanishGroupName: groupName }, selectors);
    return res;
  }
}
