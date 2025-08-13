import { IEnvironment } from './environment.interface';

export const production: IEnvironment = {
  port: process.env.PORT,
  database: {
    mongodb: process.env.MONGO_DB_CONNECTION,
    neo4j: {
      database: process.env.NEO4J_DATABASE,
      scheme: process.env.NEO4J_SCHEME,
      host: process.env.NEO4J_HOST,
      port: process.env.NEO4J_PORT,
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
    },
  },
  storage: { storageUrl: process.env.STORAGE_URL },
  security: { rateLimit: { ttl: process.env.RATE_LIMIT_TLL, limit: process.env.RATE_LIMIT_VALUE } },
  tokenKey: process.env.SIGN_TOKEN,
  whiteListOrigins: [
    process.env.ORIGIN_PRODUCTION_WEB_DOMAIN,
    process.env.ORIGIN_PRODUCTION_S3_WEB,
    process.env.ORIGIN_PRODUCTION_S3_MOBILE,
    process.env.ORIGIN_PRODUCTION_MOBILE_DOMAIN,
  ],
  foodProvider: {
    foodApi: {
      edamamFoodParserUrl: process.env.EDAMAM_FOOD_PARSER_URL,
      edamamFoodAppId: process.env.EDAMAM_FOOD_APP_ID,
      edamamFoodKey: process.env.EDAMAM_FOOD_KEY,
    },
  },
  gptProvider: {
    gptSecretKey: process.env.GPT_SECRET_KEY,
  },
  translationProvider: {
    deeplAuthKey: process.env.DEEPL_AUTH_KEY,
  },
  mailsSender: process.env.MAILS_SENDER,
};
