import { Query, Resolver } from '@nestjs/graphql';

import { Disease } from '../out/disease.schema';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { DiseasesManagerService } from 'src/modules/program-generator/diseases/application/diseases-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class DiseasesResolver {
  constructor(private readonly dms: DiseasesManagerService) {}

  @Query(() => [Disease])
  async getAllDiseases(): Promise<Disease[]> {
    const diseases = await this.dms.getAllDiseases();
    return diseases;
  }
}
