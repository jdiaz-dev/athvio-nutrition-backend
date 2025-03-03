import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { NutritionalPreference } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preference.schema';
import { NutritionalPreferencesPersistenceService } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preferences-persistence.service';
import { ErrorNutritionalPreferencesEnum } from 'src/modules/program-generator/shared/constants';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class NutritionalPreferencesManagerService {
  constructor(private readonly logger: AthvioLoggerService, private readonly npps: NutritionalPreferencesPersistenceService) {}

  async getNutritionalPreferences(nutritionalPreferences: string[]): Promise<NutritionalPreference[]> {
    const res = await this.npps.getNutritionalPreferences(nutritionalPreferences);
    if (res.length === 0) {
      const message = ErrorNutritionalPreferencesEnum.NUTRITIONAL_PREFERENCES_NOT_FOUND;
      this.logger.warn({
        layer: LayersServer.APPLICATION,
        message,
        nutritionalPreferences,
      });
      throw new BadRequestException(message);
    }
    return res;
  }
  async getAllNutritionalPreferences(): Promise<NutritionalPreference[]> {
    const res = await this.npps.getAllNutritionalPreferences();

    if (res.length === 0) {
      const message = ErrorNutritionalPreferencesEnum.EMPTY_NODE;
      this.logger.error({ layer: LayersServer.APPLICATION, message });
      throw new InternalServerErrorException(message);
    }

    return res;
  }
}
