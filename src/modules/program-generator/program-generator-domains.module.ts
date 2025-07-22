import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiseaseCausesModule } from 'src/modules/program-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-generator/diseases/diseases.module';
import { FoodAnalyzersModule } from 'src/modules/program-generator/food-analyzer/food-analyzer.module';
import { GptModule } from 'src/modules/program-generator/gpt/gpt.module';
import { Neo4jModule } from 'src/modules/program-generator/neo4j/neo4j.module';
import { NutritionalPreferencesModule } from 'src/modules/program-generator/nutritional-preferences/nutritional-preferences.module';
import { ProgramGeneratorModule } from 'src/modules/program-generator/program-generator/program-generator.module';
import { Neo4jConfig } from 'src/modules/program-generator/shared/types';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        database: configService.get<string>('database.neo4j.database'),
        scheme: configService.get('database.neo4j.scheme'),
        host: configService.get<string>('database.neo4j.host'),
        port: configService.get<string>('database.neo4j.port'),
        username: configService.get<string>('database.neo4j.username'),
        password: configService.get<string>('database.neo4j.password'),
      }),
    }),
    DiseaseCausesModule,
    DiseasesModule,
    NutritionalPreferencesModule,
    GptModule,
    ProgramGeneratorModule,
    FoodAnalyzersModule,
  ],
})
export class ProgramGeneratorDomainsModule {}
