import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ConfigService } from '@nestjs/config';
import { GraphQLResponse } from '@apollo/server';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      uploads: {
        maxFileSize: 10 * 1024 * 1024,
        maxFiles: 1,
      },
      // @ts-ignore //todo: remove ts-ignore
      useFactory: (configService: ConfigService) => ({
        csrfPrevention: false,
        playground: false,
        autoSchemaFile: 'schema.gql',
        fieldResolverEnhancers: ['interceptors'],
        includeStacktraceInErrorResponses: false,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: any) => {
              const { extra } = context;
              extra.user = { user: {} };
            },
          },
        },
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        sortSchema: true,
        autoTransformHttpErrors: true,
        // @ts-ignore
        context: ({ req, res }) => ({ req, res }),
        formatResponse: (response: GraphQLResponse): GraphQLResponse => {
          return response;
        },
        formatError: (error: GraphQLError): GraphQLFormattedError => {
          return error;
        },
      }),
    }),
  ],
})
export class GraphqlModule {}
