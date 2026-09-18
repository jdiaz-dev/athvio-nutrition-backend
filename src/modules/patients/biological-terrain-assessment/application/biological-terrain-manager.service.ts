import { BadRequestException, Injectable } from '@nestjs/common';
import { TerrainAssessmentDocument } from 'src/modules/health/terrain-assessment/adapters/out/terrain-assesment.schema';
import { TerrainAssessmentPersistence } from 'src/modules/health/terrain-assessment/adapters/out/terrain-persistence.service';
import { ErrorTerrainAssessment } from 'src/shared/enums/messages-response';

@Injectable()
export class TerrainAssessmentManager {
  constructor(private readonly btap: TerrainAssessmentPersistence) {}

  async getAssessment(): Promise<TerrainAssessmentDocument> {
    const assessment = await this.btap.findAssessment();
    if (!assessment) throw new BadRequestException(ErrorTerrainAssessment.BIOLOGICALASSESSMENT_NOT_FOUND);
    return assessment;
  }
}
