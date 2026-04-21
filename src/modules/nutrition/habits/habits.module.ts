import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { Habit, HabitSchema } from 'src/modules/nutrition/habits/adapters/out/habits.schema';
import { HabitsPersistenceService } from 'src/modules/nutrition/habits/adapters/out/habits-persistence.service';
import { HabitsManagerService } from 'src/modules/nutrition/habits/application/habits-manager.service';
import { HabitsResolver } from 'src/modules/nutrition/habits/adapters/in/habits.resolver';

const resolvers = [HabitsResolver];
const persistenceServices = [HabitsPersistenceService];
const applicationServices = [HabitsManagerService];

@Module({
  imports: [MongooseModule.forFeature([{ name: Habit.name, schema: HabitSchema }]), forwardRef(() => AuthModule)],
  providers: [...resolvers, ...persistenceServices, ...applicationServices],
})
export class HabitsModule {}
