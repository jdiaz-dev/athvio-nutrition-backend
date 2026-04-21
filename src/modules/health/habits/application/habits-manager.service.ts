import { Injectable } from '@nestjs/common';
import { HabitsPersistenceService } from 'src/modules/health/habits/adapters/out/habits-persistence.service';

@Injectable()
export class HabitsManagerService {
  constructor(private hps: HabitsPersistenceService) {}

  async getHabits(selectors: Record<string, number>) {
    const habits = await this.hps.getHabits(selectors);
    return habits;
  }
}
