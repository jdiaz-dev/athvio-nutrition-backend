import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TranslatorService } from 'src/cli/services/translator.service';
import { FullDatabaseService } from 'src/cli/services/full-database.service';
import { PopulateDbWithTranslatedFoods } from 'src/cli/commands/populate-db-with-translated-foods.command';

@Module({
  imports: [SharedModule],
  providers: [TranslatorService, FullDatabaseService, PopulateDbWithTranslatedFoods],
})
export class CliModule {}
