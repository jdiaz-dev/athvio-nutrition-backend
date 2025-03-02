import { Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { DiseaseCausesPersistenceService } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause-persistence.service';
import { DiseaseCause } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause.schema';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class DiseaseCausesResolver {
  constructor(private readonly dps: DiseaseCausesPersistenceService) {}

  @Query(() => [DiseaseCause])
  async getAllDiseaseCauses(): Promise<DiseaseCause[]> {
    const patientGroup = await this.dps.getAllDiseaseCauses();
    return patientGroup;
  }
}
