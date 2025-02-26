import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import {
  NutritionalPreference,
  NutritionalPreferenceDocument,
} from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preference.schema';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class NutritionalPreferencesPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(
    @InjectModel(NutritionalPreference.name) private readonly nutritionalPreferenceModel: Model<NutritionalPreferenceDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async getNutritionalPreference(diseaseCause: string): Promise<NutritionalPreference> {
    try {
      const res = await this.nutritionalPreferenceModel.findOne({ _id: diseaseCause });
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getNutritionalPreferences(
    nutritionalPreferences: string[],
    selectors: Record<string, number>,
  ): Promise<NutritionalPreference[]> {
    try {
      const res = await this.nutritionalPreferenceModel.find({ _id: { $in: nutritionalPreferences } }, selectors);
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async getAllNutritionalPreferences(selectors: string[]): Promise<NutritionalPreference[]> {
    try {
      const res = await this.nutritionalPreferenceModel.find({}, selectors);
      return res;
    } catch (error) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
