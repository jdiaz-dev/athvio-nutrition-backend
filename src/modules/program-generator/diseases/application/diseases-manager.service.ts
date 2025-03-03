import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { Disease } from 'src/modules/program-generator/diseases/adapters/out/disease.schema';
import { DiseasesPersistenceService } from 'src/modules/program-generator/diseases/adapters/out/diseases-persistence.service';
import { ErroDiseasesEnum } from 'src/modules/program-generator/shared/constants';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class DiseasesManagerService {
  constructor(private readonly logger: AthvioLoggerService, private readonly dps: DiseasesPersistenceService) {}

  async getDiseases(diseases: string[]): Promise<Disease[]> {
    const res = await this.dps.getDiseases(diseases);

    if (res.length === 0) {
      const message = ErroDiseasesEnum.DISEASES_NOT_FOUND;
      this.logger.warn({
        layer: LayersServer.APPLICATION,
        message,
        diseases,
      });
      throw new BadRequestException(message);
    }

    return res;
  }
  async getAllDiseases(): Promise<Disease[]> {
    const res = await this.dps.getAllDiseases();

    if (res.length === 0) {
      const message = ErroDiseasesEnum.EMPTY_NODE;
      this.logger.error({ layer: LayersServer.APPLICATION, message });
      throw new InternalServerErrorException(message);
    }

    return res;
  }
}
