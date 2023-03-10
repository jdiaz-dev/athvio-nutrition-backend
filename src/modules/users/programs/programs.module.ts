import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramTagsModule } from 'src/modules/users/program-tags/program-tags.module';
import { MealsResolver } from 'src/modules/users/programs/adapters/in/meals.resolver';
import { PlansResolver } from 'src/modules/users/programs/adapters/in/plans.resolver';
import { ProgramsResolver } from 'src/modules/users/programs/adapters/in/programs.resolver';
import { MealsPersistenceService } from 'src/modules/users/programs/adapters/out/meals-persistence.service';
import { PlansPersistenceService } from 'src/modules/users/programs/adapters/out/plans-persistence.service';
import { Program, ProgramSchema } from 'src/modules/users/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/users/programs/adapters/out/programs-persistence.service';
import { ManageProgramTagService } from 'src/modules/users/programs/application/manage-program-tag.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }]), ProgramTagsModule],
  providers: [
    ...[ProgramsResolver, PlansResolver, MealsResolver],
    ...[ProgramsPersistenceService, ManageProgramTagService, PlansPersistenceService, MealsPersistenceService],
  ],
})
export class ProgramsModule {}
