import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientPlanCommentsResolver } from 'src/modules/clients/client-plans/adapters/in/client-plans-comments.resolver';
import { ClientPlansResolver } from 'src/modules/clients/client-plans/adapters/in/client-plans.resolver';
import { ClientPlanCommentPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plan-comment-persistence.service';
import { ClientPlan, ClientPlanSchema } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlansPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plans-persistence.service';
import { AddClientPlanCommentService } from 'src/modules/clients/client-plans/application/add-client-plan-comment.service';
import { CreateClientPlanService } from 'src/modules/clients/client-plans/application/create-client-plan.service';
import { ClientsModule } from 'src/modules/clients/clients/clients.module';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersModule } from 'src/modules/security/users/users.module';
import { PlanMealsPersistenceService } from 'src/modules/clients/client-plans/adapters/out/plan-meals-persistence.service';
import { MealsResolver } from 'src/modules/clients/client-plans/adapters/in/meals.resolver';

const resolvers = [ClientPlansResolver, ClientPlanCommentsResolver, MealsResolver];
const services = [
  ClientPlansPersistenceService,
  CreateClientPlanService,
  ClientPlanCommentPersistenceService,
  AddClientPlanCommentService,
  PlanMealsPersistenceService,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ClientPlan.name, schema: ClientPlanSchema }]),
    UsersModule,
    ProfessionalsModule,
    ClientsModule,
  ],
  providers: [...resolvers, ...services],
})
export class ClientPlansModule {}
