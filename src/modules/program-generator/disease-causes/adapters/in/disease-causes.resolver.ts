import { Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { DiseaseCause } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause.schema';
import { DiseaseCausesManagerService } from 'src/modules/program-generator/disease-causes/application/disease-causes-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class DiseaseCausesResolver {
  constructor(private readonly dcms: DiseaseCausesManagerService) {}

  @Query(() => [DiseaseCause])
  async getAllDiseaseCauses(): Promise<DiseaseCause[]> {
    const patientGroup = await this.dcms.getAllDiseaseCauses();
    return patientGroup;
  }
}
