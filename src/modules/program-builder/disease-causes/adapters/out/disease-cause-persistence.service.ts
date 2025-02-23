import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DiseaseCause,
  DiseaseCauseDocument,
} from 'src/modules/program-builder/disease-causes/adapters/out/disease-cause.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class DiseaseCausesPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(@InjectModel(DiseaseCause.name) private readonly diseaseCauseModel: Model<DiseaseCauseDocument>) {}

  async getDiseaseCause(diseaseCause: string): Promise<DiseaseCause> {
    try {
      const res = await this.diseaseCauseModel.findOne({ _id: diseaseCause });
      return res;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getDiseaseCauses(selectors: string[]): Promise<DiseaseCause[]> {
    try {
      const res = await this.diseaseCauseModel.find({}, selectors);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
