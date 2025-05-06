import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';

import { LayersServer } from 'src/shared/enums/project';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import {
  InternalCounter,
  InternalCounterDocument,
} from 'src/modules/program-generator/foods/adapters/out/internal-counter.schema';

@Injectable()
export class InternalCountersPersistenceService {
  constructor(
    @InjectModel(InternalCounter.name) private readonly internalCounterModel: Model<InternalCounterDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async saveInternalCounter(data: Omit<InternalCounter, '_id' | 'createdAt' | 'updatedAt'>): Promise<InternalCounter> {
    try {
      const res: any = await this.internalCounterModel.create(data);
      return res;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getLastInternalCounter(): Promise<InternalCounter | null> {
    try {
      const lastRecord = await this.internalCounterModel.find({}, ['_id', 'total', 'uri', 'nextUri'], {
        sort: { createdAt: -1 },
        limit: 1,
      });
      return lastRecord[0];
    } catch (error: unknown) {
      this.logger.error({
        layer: LayersServer.INFRAESTRUCTURE,
        error,
        message: (error as Error).message,
      });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
