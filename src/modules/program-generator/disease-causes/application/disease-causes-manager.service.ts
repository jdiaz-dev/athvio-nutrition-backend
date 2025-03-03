import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { DiseaseCausesPersistenceService } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause-persistence.service';
import { DiseaseCause } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause.schema';
import { ErrorDiseaseCausesEnum } from 'src/modules/program-generator/shared/constants';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class DiseaseCausesManagerService {
  constructor(private readonly logger: AthvioLoggerService, private readonly dcps: DiseaseCausesPersistenceService) {}

  async getDiseaseCauses(diseaseCauses: string[], diseases: string[]): Promise<DiseaseCause[]> {
    const res = await this.dcps.getDiseaseCauses(diseaseCauses, diseases);
    if (res.length === 0) {
      const message = ErrorDiseaseCausesEnum.DISEASE_CAUSES_NOT_FOUND;
      this.logger.warn({
        layer: LayersServer.APPLICATION,
        message,
        diseaseCauses,
      });
      throw new BadRequestException(message);
    }
    return res;
  }
  async getAllDiseaseCauses(): Promise<DiseaseCause[]> {
    const res = await this.dcps.getAllDiseaseCauses();
    if (res.length === 0) {
      const message = ErrorDiseaseCausesEnum.EMPTY_NODE;
      this.logger.error({ layer: LayersServer.APPLICATION, message });
      throw new InternalServerErrorException(message);
    }
    return res;
  }
}
