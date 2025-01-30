import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { GraphQLResponse } from 'apollo-server-types';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
// import { EnumEnvironments } from './shared/enums/project';
import configuration from './configuration';
import { UsersModule } from 'src/modules/authentication/users/users.module';
import { FoodsModule } from 'src/modules/foods/foods.module';
import { CustomRecipesModule } from 'src/modules/professionals/custom-recipes/custom-recipes.module';
import { QuestionaryConfigurationModule } from 'src/modules/professionals/questionary-configuration/questionary-configuration.module';
import { SharedModule } from 'src/shared/shared.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from 'src/shared/guards/gql-throttler.guard';
import { QuestionaryModule } from 'src/modules/professionals/questionary/adapters/questionary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongodb'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: parseInt(configService.get<string>('security.rateLimit.ttl')),
            limit: parseInt(configService.get<string>('security.rateLimit.limit')),
          },
        ],
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      // @ts-ignore //todo: remove ts-ignore
      useFactory: (configService: ConfigService) => ({
        playground: false,
        autoSchemaFile: 'schema.gql',
        fieldResolverEnhancers: ['interceptors'],
        includeStacktraceInErrorResponses: false,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: any) => {
              const { connectionParams, extra } = context;
              connectionParams;
              // user validation will remain the same as in the example above
              // when using with graphql-ws, additional context value should be stored in the extra field
              extra.user = { user: {} };
            },
          },
        },
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        sortSchema: true,
        autoTransformHttpErrors: true,
        cors: {
          origin: true, // Allow all origins
          credentials: true,
        },
        // @ts-ignore
        context: ({ req, res }) => ({ req, res }),
        formatResponse: (response: GraphQLResponse): GraphQLResponse => {
          if (response.errors && response.errors.length > 1) {
            while (response.errors.length != 1) {
              // response.errors.pop();
            }
          }
          return response;
        },
        formatError: (error: GraphQLError): GraphQLFormattedError => {
          //removing stacktrace of code
          /* if (error.extensions) delete error.extensions.exception;
            if (process.env.NODE_ENV === EnumEnvironments.LOCAL) return error as GraphQLFormattedError; */

          return error;
        },
      }),
    }),
    SharedModule,
    UsersModule,
    ProfessionalsModule,
    ProgramsModule,
    ProgramTagsModule,
    PatientGroupsModule,
    CustomRecipesModule,
    PatientsModule,
    CaloriesModule,
    PatientPlansModule,
    ChatsModule,
    AuthenticationModule,
    FoodsModule,
    QuestionaryConfigurationModule,
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
