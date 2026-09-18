import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerrainAssessmentManager } from 'src/modules/health/terrain-assessment/application/terrain-manager.service';
import {
  TerrainAssessment,
  TerrainAssessmentSchema,
} from 'src/modules/health/terrain-assessment/adapters/out/terrain-assesment.schema';
import { TerrainAssessmentPersistence } from 'src/modules/health/terrain-assessment/adapters/out/terrain-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: TerrainAssessment.name, schema: TerrainAssessmentSchema }])],
  providers: [TerrainAssessmentPersistence, TerrainAssessmentManager],
  exports: [TerrainAssessmentManager],
})
export class TerrainAssessmentModule {}
