import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { GraphQLResponse } from 'apollo-server-types';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      // imports: [WorkStreamAuditModule],
      driver: ApolloDriver,
      inject: [ConfigService /* TrackingActivityService */],
      // @ts-ignore //todo: remove ts-ignore
      useFactory: (
        configService: ConfigService,
        // trackingActivityService: TrackingActivityService,
      ) => {
        configService;
        return {
          playground: false,
          autoSchemaFile: 'schema.gql',
          fieldResolverEnhancers: ['interceptors'],
          includeStacktraceInErrorResponses: false,
          subscriptions: {
            'graphql-ws': true,
          },
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          sortSchema: true,
          // @ts-ignore
          context: ({ req, res }) => {
            return { req, res };
          },

          autoTransformHttpErrors: true,
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
          /* cors: {
            origin: configService.get<string[]>('whiteListOrigins'),
            credentials: true,
          }, */
        };
      },
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/*
  todo:
    - add rules to create week plans, verify the amount of days in week
    - create roles and permissions

    - endpoint to update isTrialPeriod
    - update basic information of patient (professional and patient views)
    - update some information of patient (from professional view)

    - fix creaateAt and updatedAt, it is not creating in sub documents of programs
    - implement equivalent ingredients

    - ValidateIf is not working (EquivalentInputs InputType)

    - check application layer if foods module, check right implementation for hexagonal architecture

    - endpoint to relationate patients with programs (plans) 
    - creating endpoint to add meals to patient plan <----------------- working

*/

/* 
  TODO: urgent - consider if I need account domain 
*/

/* 
  Deployment over fargate process
    create and understand vpc
    check sonqo cluster
    check code of LM

*/
