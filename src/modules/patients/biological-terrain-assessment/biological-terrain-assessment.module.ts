import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BiologicalTerrainAssessmentManager } from 'src/modules/patients/biological-terrain-assessment/application/biological-terrain-manager.service';
import { BiologicalTerrainAssessmentPersistence } from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assessment-persistence.service';
import {
  BiologicalTerrainAssessment,
  BiologicalTerrainAssessmentSchema,
} from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assesment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BiologicalTerrainAssessment.name, schema: BiologicalTerrainAssessmentSchema }])],
  providers: [BiologicalTerrainAssessmentPersistence, BiologicalTerrainAssessmentManager],
  exports: [BiologicalTerrainAssessmentManager],
})
export class BiologicalTerrainAssessmentModule {}
