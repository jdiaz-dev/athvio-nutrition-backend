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

export interface IEnvironment {
  database: IDatabase;
  tokenKey: string;
  whiteListOrigins: string[];
  foodProvider: FoodProvider;
  port: string;
}
