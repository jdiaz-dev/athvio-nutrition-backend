import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { NutritionalPreferencesResolver } from 'src/modules/program-generator/nutritional-preferences/adapters/in/nutritional-preferences.resolver';

import { NutritionalPreferencesPersistenceService } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preferences-persistence.service';
import { NutritionalPreferencesManagerService } from 'src/modules/program-generator/nutritional-preferences/application/nutritional-preferences-manager.service';

@Module({
  imports: [AuthModule],
  providers: [NutritionalPreferencesResolver, NutritionalPreferencesManagerService, NutritionalPreferencesPersistenceService],
  exports: [NutritionalPreferencesManagerService],
})
export class NutritionalPreferencesModule {}
