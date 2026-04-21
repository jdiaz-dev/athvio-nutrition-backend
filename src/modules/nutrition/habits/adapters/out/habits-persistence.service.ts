import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';
import { Habit, HabitDocument } from 'src/modules/nutrition/habits/adapters/out/habits.schema';

@Injectable()
export class HabitsPersistenceService extends MongodbQueryBuilder<HabitDocument> {
  constructor(
    @InjectModel(Habit.name) protected readonly habitModel: Model<HabitDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(habitModel, logger, Habit.name, als);
  }

  async getHabits(selectors: Record<string, number>): Promise<Habit[]> {
    const habits = await this.initializeQuery(this.getHabits.name).find(
      {},
      {
        projection: {
          ...selectors,
        },
      },
    );
    return habits;
  }
}
