export interface IWinstonLogger {
  nameAzureStorage: string;
  keyAzureStorage: string;
  containerName: string;
  errorBlob: string;
  exceptionBlob: string;
}

interface IDatabase {
  mongodb: string;
}

interface FoodApi {
  edamamFoodParserUrl: string;
  edamamFoodAppId: string;
  edamamFoodKey: string;
}
interface FoodProvider {
  foodApi: FoodApi;
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
  port: string;
}
