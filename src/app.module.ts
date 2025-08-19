import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { GraphqlModule } from 'src/infraestructure/graphql.module';
import { DatabaseModule } from 'src/infraestructure/database.module';
import { SecurityModule } from 'src/infraestructure/security.module';
import { PatientsDomainsModule } from 'src/modules/patients/patient-domains.module';
import { ProgramGeneratorDomainsModule } from 'src/modules/program-generator/program-generator-domains.module';
import { ProfessionalDomainsModule } from 'src/modules/professionals/professional-domains.module';
import { ObservabilityModule } from 'src/infraestructure/observability/observability.module';
import { BackofficeDomainsModule } from 'src/modules/backoffice/backoffice-domains.module';
import { getConfiguration, validateEnvironmentVariables } from 'src/configuration';
import { AuthDomainsModule } from 'src/modules/auth/auth-domains.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      validate: validateEnvironmentVariables,
    }),
    DatabaseModule,
    SecurityModule,
    GraphqlModule,
    ObservabilityModule,

    SharedModule,
    MailModule,

    AuthDomainsModule,
    ProfessionalDomainsModule,
    PatientsDomainsModule,
    BackofficeDomainsModule,
    ProgramGeneratorDomainsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
