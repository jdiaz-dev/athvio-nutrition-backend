import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { NutritionalPreference } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preference.schema';
import { NutritionalPreferencesManagerService } from 'src/modules/program-generator/nutritional-preferences/application/nutritional-preferences-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class NutritionalPreferencesResolver {
  constructor(private readonly npms: NutritionalPreferencesManagerService) {}

  @Query(() => [NutritionalPreference])
  async getAllNutritionalPreferences(): Promise<NutritionalPreference[]> {
    const nutritionalPreference = await this.npms.getAllNutritionalPreferences();
    return nutritionalPreference;
  }
}
