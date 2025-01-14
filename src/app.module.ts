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
      useFactory: (configService: ConfigService) => {
        return {
          playground: false,
          autoSchemaFile: 'schema.gql',
          fieldResolverEnhancers: ['interceptors'],
          includeStacktraceInErrorResponses: false,
          subscriptions: {
            'graphql-ws': {
              onConnect: (context: any) => {
                const { connectionParams, extra } = context;
                connectionParams;
                // console.log('---------context', context)
                // console.log('---------connectionParams', connectionParams)
                // user validation will remain the same as in the example above
                // when using with graphql-ws, additional context value should be stored in the extra field
                extra.user = { user: {} };
              },
            },
          },
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          sortSchema: true,
          // @ts-ignore
          context: ({ req, res }) => ({ req, res }),
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
        };
      },
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

    - photos and files of patients
    - customize error by rate limit

*/

/* 
  TODO: 
  - consider if I need account domain
  - questionary
    - questionary configuracion: enabled disabled
    - allow to create own fields
    - send questionary to patient

    - Information -> Patient
      - questionaryGroups: [
        {
          - title
          - description
          - questionaryDetails: [
              { (fieldNames)
                - id
                - associatedInformation
                - associatedQuestion
                - answwer:string || string[]
                - fieldType: string
                - fieldOptions?: string[]
                - professionalNotes
              }
          ]
        }
      ]

    apis: 
      - getInformtationPatient
      - updateInformationDetail

    internal
      - at moment to create a customer, createa a patient information (quesetionary)

    - questionaryConfiguration
      - id
      - questionaryGroups: [
        {
          - id
          - title 
          - description
          - questionaryDetails: [
              { (fieldNames)
                - id
                - fieldName
                - associatedQuestion
                - enabled: boolean
                - fieldType: string
                - fieldOptions?: string[]
              }
          ]
        }
      ]

    apis:
      - getQuestionaryGroup: questionaryGroup,
      - enableQuestion  
      - createQuestionaryGroup: questionaryGroup, (questions, enabled, associatedInformation)[]
      - updateQuestionaryGroup: questionaryGroup, (questions, enabled, associatedInformation)[]
      - add questionaryDetails (customs questions)

    internal
      - at moment to create a professional, create a questionary configuration
      - common table for questionary configuration
*/
