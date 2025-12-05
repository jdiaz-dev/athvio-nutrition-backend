import { Command, CommandRunner } from 'nest-commander';
import { FullDatabaseService } from 'src/cli/services/full-database.service';

@Command({
  name: 'update-nutrient-foods',
  description: 'add nutrients to existing internal foods in db',
})
export class UpdateNutrientFoods extends CommandRunner {
  constructor(private readonly fullDatabaseService: FullDatabaseService) {
    super();
  }

  async run(): Promise<void> {
    await this.fullDatabaseService.updateNutrientDetails();
  }
}
