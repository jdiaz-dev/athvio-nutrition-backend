import { Command, CommandRunner } from 'nest-commander';
import { FullDatabaseService } from 'src/cli/services/full-database.service';

@Command({
  name: 'translate-foods',
  description: 'translate foods from english to spanish and save in db',
})
export class TranslateFoods extends CommandRunner {
  constructor(private readonly fullDatabaseService: FullDatabaseService) {
    super();
  }

  async run(): Promise<void> {
    await this.fullDatabaseService.fullNamedFoods();
  }
}
