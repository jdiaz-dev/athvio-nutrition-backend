import { IEnvironment } from './environment.interface';

export const local: IEnvironment = {
  port: process.env.PORT,
  database: {
    mongodb: process.env.MONGO_DB_CONNECTION,
  },
  security: { rateLimit: { ttl: process.env.RATE_LIMIT_TLL, limit: process.env.RATE_LIMIT_VALUE } },
  tokenKey: process.env.SIGN_TOKEN,
  whiteListOrigins: [process.env.ORIGIN_WEB_LOCAL, process.env.ORIGIN_MOBILE_LOCAL, process.env.ORIGIN_APOLLO_GRAPHQL_STUDIO],
  foodProvider: {
    foodApi: {
      edamamFoodParserUrl: process.env.EDAMAM_FOOD_PARSER_URL,
      edamamFoodAppId: process.env.EDAMAM_FOOD_APP_ID,
      edamamFoodKey: process.env.EDAMAM_FOOD_KEY,
    },
  },
};
