interface INeo4j {
  database: string;
  scheme: string;
  host: string;
  port: string;
  username: string;
  password: string;
}
interface IDatabase {
  mongodb: string;
  neo4j: INeo4j;
}

interface Storage {
  storageUrl: string;
}

interface FoodApi {
  edamamFoodParserUrl: string;
  edamamFoodAppId: string;
  edamamFoodKey: string;
}
interface FoodProvider {
  foodApi: FoodApi;
}

interface GptProvider {
  gptSecretKey: string;
}

interface TranslationProvider {
  deeplAuthKey: string;
}
interface Security {
  rateLimit: { ttl: string; limit: string };
}
export interface IEnvironment {
  database: IDatabase;
  storage: Storage;
  security: Security;
  tokenKey: string;
  whiteListOrigins: string[];
  foodProvider: FoodProvider;
  gptProvider: GptProvider;
  translationProvider: TranslationProvider;
  port: string;
  mailsSender: string;
}
