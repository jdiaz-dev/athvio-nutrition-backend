import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';

import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Formula, FormulaDocument } from 'src/modules/backoffice/formulas/adapters/out/formula.schema';
import { MongodbQueryBuilder } from 'src/shared/database/mongodb-query-builder';
import { Trazability } from 'src/shared/types';

@Injectable()
export class FormulasPersistenceService extends MongodbQueryBuilder<FormulaDocument> {
  constructor(
    @InjectModel(Formula.name) protected readonly formulaModel: Model<FormulaDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(formulaModel, logger, Formula.name, als);
  }
  async getFormula(groupName: string, selectors: Record<string, number>): Promise<Formula> {
    const res = await this.initializeQuery(this.getFormula.name).findOne({ spanishGroupName: groupName }, selectors);
    return res;
  }
}
