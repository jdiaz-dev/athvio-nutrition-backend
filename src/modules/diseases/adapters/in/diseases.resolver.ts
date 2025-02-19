import { Info, Query, Resolver } from '@nestjs/graphql';

import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';
import { Disease } from '../out/disease.schema';
import { DiseasesPersistenceService } from 'src/modules/diseases/adapters/out/diseases-persistence.service';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class DiseasesResolver {
  constructor(private readonly dps: DiseasesPersistenceService) {}

  @Query(() => [Disease])
  async getDiseases(@Info(...selectorExtractor()) selectors: string[]): Promise<Disease[]> {
    const patientGroup = await this.dps.getDiseases(selectors);
    return patientGroup;
  }
}
