import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { FullDatabaseService } from 'src/modules/program-generator/foods/application/full-database.service';

//todo: remove resolver
@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PopulatorDatabaseResolver {
  constructor(private readonly fullDatabaseService: FullDatabaseService) {}

  @Query(() => [String])
  async populateSpanishFoods(): Promise<string[]> {
    await this.fullDatabaseService.fullFoods();
    return ['end'];
  }
}
