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
import { ClientGroupsModule } from './modules/professionals/client-groups/client-groups.module';
import { ClientsModule } from './modules/clients/clients/clients.module';
import { CaloriesModule } from './modules/clients/calories/calories.module';
import { ClientPlansModule } from './modules/clients/client-plans/plans.module';
import { ChatsModule } from './modules/clients/chats/chats.module';
import { SecurityModule } from './modules/security/security/security.module';
// import { EnumEnvironments } from './shared/enums/project';
import configuration from './configuration';
import { UsersModule } from 'src/modules/security/users/users.module';
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
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          sortSchema: true,
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
    ClientGroupsModule,
    CustomRecipesModule,
    ClientsModule,
    CaloriesModule,
    ClientPlansModule,
    ChatsModule,
    SecurityModule,
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
    - update basic information of client (professional and client views)
    - update some information of client (from professional view)

    - fix creaateAt and updatedAt, it is not creating in sub documents of programs
    - implement equivalent ingredients

    - ValidateIf is not working (EquivalentInputs InputType)

    - check application layer if foods module, check right implementation for hexagonal architecture

    - endpoint to relationate clients with programs (plans) 
    - creating endpoint to add meals to client plan <----------------- working
*/

/*
  ---------measure labels [
  'Tablespoon', 'Cup',
  'Stick',      'Gram',
  'Ounce',      'Pound',
  'Pat',        'Serving',
  undefined,    undefined,
  undefined,    'Slice',
  'Wedge',      'Piece',
  'Round',      'Cubic inch',
  'Package',    'Block',
  'Chip',       'Slab',
  'Cube'
]

*/
