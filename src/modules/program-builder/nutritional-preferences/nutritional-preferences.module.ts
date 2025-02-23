import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { NutritionalPreferencesResolver } from 'src/modules/program-builder/nutritional-preferences/adapters/in/nutritional-preferences.resolver';
import {
  NutritionalPreference,
  NutritionalPreferenceSchema,
} from 'src/modules/program-builder/nutritional-preferences/adapters/out/nutritional-preference.schema';
import { NutritionalPreferencesPersistenceService } from 'src/modules/program-builder/nutritional-preferences/adapters/out/nutritional-preferences-persistence.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NutritionalPreference.name, schema: NutritionalPreferenceSchema }]),
    AuthenticationModule,
  ],
  providers: [NutritionalPreferencesResolver, NutritionalPreferencesPersistenceService],
})
export class NutritionalPreferencesModule {}
