import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Disease, DiseaseDocument } from 'src/modules/nutrition-builder/diseases/adapters/out/disease.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class DiseasesPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(@InjectModel(Disease.name) private readonly diseaseModel: Model<DiseaseDocument>) {}

  async getDisease(disease: string): Promise<Disease> {
    try {
      const res = await this.diseaseModel.findOne({ _id: disease });
      return res;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getDiseases(selectors: string[]): Promise<Disease[]> {
    try {
      const res = await this.diseaseModel.find({}, selectors);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
