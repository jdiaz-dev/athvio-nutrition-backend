import { Command, CommandRunner } from 'nest-commander';
import { FullDatabaseService } from 'src/cli/services/full-database.service';

@Command({
  name: 'pupulate-db-with-spanish-foods',
  description: 'translate foods from spanish to english and save in db',
})
export class PopulateDbWithTranslatedFoods extends CommandRunner {
  constructor(private readonly fullDatabaseService: FullDatabaseService) {
    super();
  }

  async run(): Promise<void> {
    this.fullDatabaseService;
    console.log('Starting database population with translated foods...');
    // await this.fullDatabaseService.fullNamedFoods();
  }
}
