import { IEnvironment } from "./environment.interface";

export const local: IEnvironment = {
  database: {
    mongodb: process.env.MONGO_DB_CONNECTION,
  },
  tokenKey: process.env.SIGN_TOKEN,
  whiteListOrigins: [
    process.env.ORIGIN_LOCAL,
    process.env.ORIGIN_PRODUCTION,
    process.env.ORIGIN_BUCKET_S3,
  ],
};
