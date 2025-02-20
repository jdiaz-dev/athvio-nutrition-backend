import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { ProfessionalsModule } from './modules/professionals/professionals/professionals.module';
import { ProgramsModule } from './modules/professionals/programs/programs.module';
import { ProgramTagsModule } from './modules/professionals/program-tags/program-tags.module';
import { PatientGroupsModule } from './modules/professionals/patient-groups/patient-groups.module';
import { PatientsModule } from './modules/patients/patients/patients.module';
import { CaloriesModule } from './modules/patients/calories/calories.module';
import { PatientPlansModule } from './modules/patients/patient-plans/patient-plans.module';
import { ChatsModule } from './modules/patients/chats/chats.module';
import { AuthenticationModule } from './modules/authentication/authentication/authentication.module';
import configuration from './configuration';
import { UsersModule } from 'src/modules/authentication/users/users.module';
import { FoodsModule } from 'src/modules/foods/foods.module';
import { NutritionalMealsModule } from 'src/modules/professionals/nutritional-meals/nutritional-meals.module';
import { QuestionaryConfigurationModule } from 'src/modules/professionals/questionary-configuration/questionary-configuration.module';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from 'src/shared/guards/gql-throttler.guard';
import { QuestionaryModule } from 'src/modules/professionals/questionary/adapters/questionary.module';
import { DiseasesModule } from 'src/modules/diseases/diseases.module';
import { GraphqlModule } from 'src/infraestructure/graphql.module';
import { DatabaseModule } from 'src/infraestructure/database.module';
import { SecurityModule } from 'src/infraestructure/security.module';
// import { ProfessionalDomainModules } from 'src/modules/professionals/professional-domain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    SecurityModule,
    GraphqlModule,
    SharedModule,

    UsersModule,

    ProfessionalsModule,
    // ProfessionalDomainModules,
    ProgramsModule,
    ProgramTagsModule,
    PatientGroupsModule,
    NutritionalMealsModule,

    PatientsModule,
    CaloriesModule,
    PatientPlansModule,
    ChatsModule,

    AuthenticationModule,
    FoodsModule,
    QuestionaryConfigurationModule,
    QuestionaryModule,
    MailModule,
    DiseasesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
