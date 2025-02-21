import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthenticationModule } from './modules/authentication/authentication/authentication.module';
import configuration from './configuration';
import { UsersModule } from 'src/modules/authentication/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from 'src/shared/guards/gql-throttler.guard';
import { QuestionaryModule } from 'src/modules/professionals/questionary/adapters/questionary.module';
import { GraphqlModule } from 'src/infraestructure/graphql.module';
import { DatabaseModule } from 'src/infraestructure/database.module';
import { SecurityModule } from 'src/infraestructure/security.module';
import { PatientsDomainsModule } from 'src/modules/patients/patient-domains.module';
import { NutritionBuilderDomainsModule } from 'src/modules/nutrition-builder/nutrition-builder-domains.module';
import { ProfessionalDomainsModule } from 'src/modules/professionals/professional-domains.module';

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
    AuthenticationModule,

    ProfessionalDomainsModule,
    PatientsDomainsModule,
    NutritionBuilderDomainsModule,

    QuestionaryModule,
    MailModule,
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
