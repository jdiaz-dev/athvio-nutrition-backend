import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import {
  DiseaseCause,
  DiseaseCauseDocument,
} from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class DiseaseCausesPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(
    @InjectModel(DiseaseCause.name) private readonly diseaseCauseModel: Model<DiseaseCauseDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async getDiseaseCause(diseaseCause: string): Promise<DiseaseCause> {
    try {
      const res = await this.diseaseCauseModel.findOne({ _id: diseaseCause });
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getDiseaseCauses(diseaseCauses: string[], selectors: Record<string, number>): Promise<DiseaseCause[]> {
    try {
      const res = await this.diseaseCauseModel.find({ _id: { $in: diseaseCauses } }, selectors);
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getAllDiseaseCauses(selectors: string[]): Promise<DiseaseCause[]> {
    try {
      const res = await this.diseaseCauseModel.find({}, selectors);
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
