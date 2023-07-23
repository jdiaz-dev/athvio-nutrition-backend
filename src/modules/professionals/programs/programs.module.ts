import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientPlansModule } from 'src/modules/clients/client-plans/client-plans.module';
import { ClientsModule } from 'src/modules/clients/clients/clients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { ProgramTagsModule } from 'src/modules/professionals/program-tags/program-tags.module';
import { MealsResolver } from 'src/modules/professionals/programs/adapters/in/meals.resolver';
import { PlansResolver } from 'src/modules/professionals/programs/adapters/in/plans.resolver';
import { ProgramsResolver } from 'src/modules/professionals/programs/adapters/in/programs.resolver';
import { MealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { Program, ProgramSchema } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { AssignProgramService } from 'src/modules/professionals/programs/application/assign-program.service';
import { ProgramManagementService } from 'src/modules/professionals/programs/application/program-management.service';
import { UsersModule } from 'src/modules/security/users/users.module';

const resolvers = [ProgramsResolver, PlansResolver, MealsResolver];
const services = [ProgramsPersistenceService, ProgramManagementService, PlansPersistenceService, MealsPersistenceService, AssignProgramService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }]),
    ProfessionalsModule,
    UsersModule,
    ProgramTagsModule,
    ClientsModule,
    ClientPlansModule
  ],
  providers: [...resolvers, ...services],
})
export class ProgramsModule {}
