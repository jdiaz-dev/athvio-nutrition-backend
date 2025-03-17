import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthenticationModule } from './modules/auth/auth/authentication.module';
import configuration from './configuration';
import { UsersModule } from 'src/modules/auth/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { QuestionaryModule } from 'src/modules/professionals/questionary/adapters/questionary.module';
import { GraphqlModule } from 'src/infraestructure/graphql.module';
import { DatabaseModule } from 'src/infraestructure/database.module';
import { SecurityModule } from 'src/infraestructure/security.module';
import { PatientsDomainsModule } from 'src/modules/patients/patient-domains.module';
import { ProgramGeneratorDomainsModule } from 'src/modules/program-generator/program-generator-domains.module';
import { ProfessionalDomainsModule } from 'src/modules/professionals/professional-domains.module';
import { ObservabilityModule } from 'src/infraestructure/observability/observability.module';
import { FoodsModule } from 'src/modules/program-generator/foods/foods.module';

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
    AuthenticationModule,
    QuestionaryModule,
    MailModule,

    ProfessionalDomainsModule,
    PatientsDomainsModule,
    FoodsModule,
  ].concat(process.env.DEPLOY_PROGRAM_GENERATOR ? ProgramGeneratorDomainsModule : []),
  controllers: [AppController],
})
export class AppModule {}
