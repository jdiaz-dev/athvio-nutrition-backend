import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiseaseCausesModule } from 'src/modules/program-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-generator/diseases/diseases.module';
import { FoodAnalyzersModule } from 'src/modules/program-generator/food-analyzer/food-analyzer.module';
import { AIproviderModule } from 'src/modules/program-generator/artificial-intelligence/ai-provider.module';
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
        database: configService.getOrThrow<string>('NEO4J_DATABASE'),
        scheme: configService.getOrThrow('NEO4J_SCHEME'),
        host: configService.getOrThrow<string>('NEO4J_HOST'),
        port: configService.getOrThrow<string>('NEO4J_PORT'),
        username: configService.getOrThrow<string>('NEO4J_USERNAME'),
        password: configService.getOrThrow<string>('NEO4J_PASSWORD'),
      }),
    }),
    DiseaseCausesModule,
    DiseasesModule,
    NutritionalPreferencesModule,
    AIproviderModule,
    ProgramGeneratorModule,
    FoodAnalyzersModule,
  ],
})
export class ProgramGeneratorDomainsModule {}
