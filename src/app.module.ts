import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth/auth.module';
import configuration from './configuration';
import { UsersModule } from 'src/modules/auth/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { GraphqlModule } from 'src/infraestructure/graphql.module';
import { DatabaseModule } from 'src/infraestructure/database.module';
import { SecurityModule } from 'src/infraestructure/security.module';
import { PatientsDomainsModule } from 'src/modules/patients/patient-domains.module';
import { ProgramGeneratorDomainsModule } from 'src/modules/program-generator/program-generator-domains.module';
import { ProfessionalDomainsModule } from 'src/modules/professionals/professional-domains.module';
import { ObservabilityModule } from 'src/infraestructure/observability/observability.module';
import { FoodsModule } from 'src/modules/program-generator/foods/foods.module';
import { OnboardingModule } from 'src/modules/auth/onboarding/onboarding.module';
import { QuestionaryDomainsModule } from 'src/modules/questionaries/questionary-domains.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    SecurityModule,
    GraphqlModule,
    ObservabilityModule,

    SharedModule,
    UsersModule,
    AuthModule,
    OnboardingModule,

    FoodsModule,
    MailModule,

    ProfessionalDomainsModule,
    PatientsDomainsModule,
    QuestionaryDomainsModule,
  ].concat(process.env.DEPLOY_PROGRAM_GENERATOR ? ProgramGeneratorDomainsModule : []),
  controllers: [AppController],
})
export class AppModule {}
