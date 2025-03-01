export interface IWinstonLogger {
  nameAzureStorage: string;
  keyAzureStorage: string;
  containerName: string;
  errorBlob: string;
  exceptionBlob: string;
}

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

interface Security {
  rateLimit: { ttl: string; limit: string };
}
export interface IEnvironment {
  database: IDatabase;
  security: Security;
  tokenKey: string;
  whiteListOrigins: string[];
  foodProvider: FoodProvider;
  gptProvider: GptProvider;
  port: string;
}
