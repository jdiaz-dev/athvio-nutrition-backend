import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/nestjs/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { BiologicalTerrainAssessmentManager } from 'src/modules/patients/biological-terrain-assessment/application/biological-terrain-manager.service';
import { GetBiologicalTerrainAssesmentDto } from 'src/modules/patients/biological-terrain-assessment/adapters/in/dtos/get-patient-questionary.dto';
import { BiologicalTerrainAssessment } from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assesment.schema';
import { UpdateBiologicalTerrainAssessmentDto } from 'src/modules/patients/biological-terrain-assessment/adapters/in/dtos/update-biological-terrain-assessment.dto';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class BiologicalTerrainAssessmentResolver {
  constructor(private readonly btam: BiologicalTerrainAssessmentManager) {}

  @Query(() => BiologicalTerrainAssessment)
  getBiologicalTerrainAssessment(
    @Args('input') dto: GetBiologicalTerrainAssesmentDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<BiologicalTerrainAssessment> {
    return this.btam.getBiologicalAssessment(dto.patient, selectors);
  }
  @Mutation(() => BiologicalTerrainAssessment)
  updateBiologicalTerrainAssessment(
    @Args('input') dto: UpdateBiologicalTerrainAssessmentDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<BiologicalTerrainAssessment> {
    return this.btam.updateBiologicalTerrain(dto, selectors);
  }
}
