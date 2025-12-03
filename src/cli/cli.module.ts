import { forwardRef, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TranslatorService } from 'src/cli/services/translator.service';
import { FullDatabaseService } from 'src/cli/services/full-database.service';
import { PopulateDbWithTranslatedFoods } from 'src/cli/commands/populate-db-with-translated-foods.command';
import { MongoDbModule } from 'src/shared/infrastructure/mongodb.module';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration, validateEnvironmentVariables } from 'src/configuration';
import { ObservabilityModule } from 'src/infraestructure/observability/observability.module';
import { FoodsModule } from 'src/modules/nutrition/foods/foods.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      validate: validateEnvironmentVariables,
    }),
    forwardRef(() => SharedModule),
    ObservabilityModule,
    MongoDbModule,
    forwardRef(() => FoodsModule),
  ],
  providers: [TranslatorService, FullDatabaseService, PopulateDbWithTranslatedFoods],
})
export class CliModule {}
