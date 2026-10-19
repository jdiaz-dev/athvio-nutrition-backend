import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UpdateBiologicalTerrainAssessmentDto } from 'src/modules/patients/biological-terrain-assessment/adapters/in/dtos/update-biological-terrain-assessment.dto';
import { BiologicalTerrainAssessment } from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assesment.schema';
import { BiologicalTerrainAssessmentPersistence } from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assessment-persistence.service';
import { ErrorBiologicalTerrainAssessment } from 'src/shared/enums/messages-response';

@Injectable()
export class BiologicalTerrainAssessmentManager {
  constructor(private readonly btap: BiologicalTerrainAssessmentPersistence) {}

  async createBiologicalAssessment({
    generalObservations,
    functionalScreeningQuestions,
    ...rest
  }: Omit<BiologicalTerrainAssessment, '_id'>): Promise<BiologicalTerrainAssessment> {
    const assessment = await this.btap.createBiologicalTerrain({
      uuid: randomUUID(),
      generalObservations: generalObservations.map((generalObservation) => ({ uuid: randomUUID(), ...generalObservation })),
      functionalScreeningQuestions: functionalScreeningQuestions.map((functionalScreeningQuestion) => ({
        uuid: randomUUID(),
        ...functionalScreeningQuestion,
      })),
      ...rest,
    });
    return assessment;
  }
  async getBiologicalAssessment(patient: string, selectors: Record<string, number>): Promise<BiologicalTerrainAssessment> {
    const assessment = await this.btap.getBiologicalTerrain(patient, selectors);
    if (!assessment) throw new BadRequestException(ErrorBiologicalTerrainAssessment.BIOLOGICAL_TERRAIN_ASSESSMENT_NOT_FOUND);
    return assessment;
  }
  async updateBiologicalTerrain(
    dto: UpdateBiologicalTerrainAssessmentDto,
    selectors: Record<string, number>,
  ): Promise<BiologicalTerrainAssessment | null> {
    const assessment = await this.btap.updateBiologicalTerrain(dto, selectors);
    if (!assessment) throw new BadRequestException(ErrorBiologicalTerrainAssessment.BIOLOGICAL_TERRAIN_ASSESSMENT_NOT_FOUND);

    return assessment;
  }
}
