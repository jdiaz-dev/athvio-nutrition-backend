import { Info, Query, Resolver } from '@nestjs/graphql';

import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { NutritionalPreferencesPersistenceService } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preferences-persistence.service';
import { NutritionalPreference } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preference.schema';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class NutritionalPreferencesResolver {
  constructor(private readonly nps: NutritionalPreferencesPersistenceService) {}

  @Query(() => [NutritionalPreference])
  async getAllNutritionalPreferences(@Info(...selectorExtractor()) selectors: string[]): Promise<NutritionalPreference[]> {
    const nutritionalPreference = await this.nps.getAllNutritionalPreferences(selectors);
    return nutritionalPreference;
  }
}
