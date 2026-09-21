import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { BiologicalTerrainAssessment } from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assesment.schema';
import { BiologicalTerrainAssessmentPersistence } from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assessment-persistence.service';

@Injectable()
export class BiologicalTerrainAssessmentManager {
  constructor(private readonly btap: BiologicalTerrainAssessmentPersistence) {}

  async createBiologicalAssessment(
    assessmentBody: Omit<BiologicalTerrainAssessment, '_id'>,
  ): Promise<BiologicalTerrainAssessment> {
    const assessment = await this.btap.createBiologicalTerrain({ uuid: randomUUID(), ...assessmentBody });
    return assessment;
  }
  async getBiologicalAssessment(patient: string, selectors: Record<string, number>): Promise<BiologicalTerrainAssessment> {
    const assessment = await this.btap.getBiologicalTerrain(patient, selectors);
    return assessment;
  }
}
