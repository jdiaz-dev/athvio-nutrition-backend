import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { NutritionalPreferencesResolver } from 'src/modules/program-generator/nutritional-preferences/adapters/in/nutritional-preferences.resolver';

import { NutritionalPreferencesPersistenceService } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preferences-persistence.service';
import { NutritionalPreferencesManagerService } from 'src/modules/program-generator/nutritional-preferences/application/nutritional-preferences-manager.service';

@Module({
  imports: [AuthenticationModule],
  providers: [NutritionalPreferencesResolver, NutritionalPreferencesManagerService, NutritionalPreferencesPersistenceService],
  exports: [NutritionalPreferencesManagerService],
})
export class NutritionalPreferencesModule {}
