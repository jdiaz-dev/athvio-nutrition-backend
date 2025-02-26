import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Disease, DiseaseDocument } from 'src/modules/program-generator/diseases/adapters/out/disease.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class DiseasesPersistenceService {
  constructor(
    @InjectModel(Disease.name) private readonly diseaseModel: Model<DiseaseDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async getDisease(disease: string): Promise<Disease> {
    try {
      const res = await this.diseaseModel.findOne({ _id: disease });
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getDiseases(diseases: string[], selectors: Record<string, number>): Promise<Disease[]> {
    try {
      const res = await this.diseaseModel.find({ _id: { $in: diseases } }, selectors);

      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getAllDiseases(selectors: string[]): Promise<Disease[]> {
    try {
      const res = await this.diseaseModel.find({}, selectors);

      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
