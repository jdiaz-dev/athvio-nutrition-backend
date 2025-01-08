import { IEnvironment } from './environment.interface';

export const production: IEnvironment = {
  database: {
    mongodb: process.env.MONGO_DB_CONNECTION,
  },
  tokenKey: process.env.SIGN_TOKEN,
  whiteListOrigins: [process.env.ORIGIN_PRODUCTION, process.env.ORIGIN_BUCKET_S3],
  foodProvider: {
    foodApi: {
      edamamFoodParserUrl: process.env.EDAMAM_FOOD_PARSER_URL,
      edamamFoodAppId: process.env.EDAMAM_FOOD_APP_ID,
      edamamFoodKey: process.env.EDAMAM_FOOD_KEY,
    },
  },
};
