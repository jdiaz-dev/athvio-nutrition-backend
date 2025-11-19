import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { GraphqlModule } from 'src/infraestructure/graphql.module';
import { DatabaseModule } from 'src/infraestructure/database.module';
import { SecurityModule } from 'src/infraestructure/security.module';
import { PatientsDomainsModule } from 'src/modules/patients/patient-subdomains.module';
import { ProgramGeneratorDomainsModule } from 'src/modules/program-generator/program-generator-domains.module';
import { ProfessionalDomainsModule } from 'src/modules/professionals/professional-subdomains.module';
import { ObservabilityModule } from 'src/infraestructure/observability/observability.module';
import { BackofficeDomainsModule } from 'src/modules/backoffice/backoffice-subdomains.module';
import { getConfiguration, validateEnvironmentVariables } from 'src/configuration';
import { AuthDomainsModule } from 'src/modules/auth/auth-subdomains.module';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { Trazability } from 'src/shared/types';
import { OnboardingModule } from 'src/modules/onboarding/onboarding.module';
import { NutritionDomainsModule } from 'src/modules/nutrition/nutrition-subdomains.module';

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
    OnboardingModule,
    NutritionDomainsModule,
    ProfessionalDomainsModule,
    PatientsDomainsModule,
    BackofficeDomainsModule,
    ProgramGeneratorDomainsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  constructor(private readonly als: AsyncLocalStorage<Trazability>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((_req: any, _res: any, next: any) => {
        const store = {
          traceId: randomUUID(),
        };
        this.als.run(store, () => next());
      })
      .forRoutes('*');
  }
}
