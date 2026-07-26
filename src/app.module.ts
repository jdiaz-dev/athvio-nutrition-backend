import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { GraphqlModule } from 'src/shared/adapters/graphql.module';
import { SecurityModule } from 'src/shared/adapters/security.module';
import { PatientsSubDomainsModule } from 'src/modules/patients/patient-subdomains.module';
import { ProfessionalSubDomainsModule } from 'src/modules/professionals/professional-subdomains.module';
import { ObservabilityModule } from 'src/shared/adapters/observability/observability.module';
import { BackofficeSubDomainsModule } from 'src/modules/backoffice/backoffice-subdomains.module';
import { getEnvironmentVariables, validateEnvironmentVariables } from 'src/shared/adapters/configuration';
import { AuthSubDomainsModule } from 'src/modules/auth/auth-subdomains.module';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { Trazability } from 'src/shared/types';
import { OnboardingModule } from 'src/modules/onboarding/onboarding.module';
import { NutritionSubDomainsModule } from 'src/modules/health/nutrition-subdomains.module';
import { MongoDbModule } from 'src/shared/adapters/mongodb.module';
// import { ProgramGeneratorDomainsModule } from 'src/modules/program-generator/program-generator-domains.module';
import { HealthCheckController } from 'src/health-check.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVariables],
      validate: validateEnvironmentVariables,
    }),
    SharedModule,
    MongoDbModule,
    SecurityModule,
    GraphqlModule,
    ObservabilityModule,

    MailModule,

    AuthSubDomainsModule,
    OnboardingModule,
    NutritionSubDomainsModule,
    ProfessionalSubDomainsModule,
    PatientsSubDomainsModule,
    BackofficeSubDomainsModule,
    // ProgramGeneratorDomainsModule,
  ],
  controllers: [HealthCheckController],
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
