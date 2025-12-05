import { forwardRef, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TranslatorService } from 'src/cli/services/translator.service';
import { FullDatabaseService } from 'src/cli/services/full-database.service';
import { TranslateFoods } from 'src/cli/commands/translate-foods.command';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfiguration, validateEnvironmentVariables } from 'src/configuration';
import { ObservabilityModule } from 'src/infraestructure/observability/observability.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InternalFood, InternalFoodSchema } from 'src/shared/adapters/out/schemas/internal-food.schema';
import { InternalFoodsDaoService } from 'src/cli/services/internal-foods-dao.service';
import { UpdateNutrientFoods } from 'src/cli/commands/update-nutrient-foods.command';

const commands = [TranslateFoods, UpdateNutrientFoods];
const services = [TranslatorService, InternalFoodsDaoService, FullDatabaseService];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      validate: validateEnvironmentVariables,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongodb'),
      }),
    }),
    MongooseModule.forFeature([{ name: InternalFood.name, schema: InternalFoodSchema }]),
    ObservabilityModule,
    forwardRef(() => SharedModule),
  ],
  providers: [...services, ...commands],
})
export class CliModule {}
