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

export interface IEnvironment {
  database: IDatabase;
  tokenKey: string;
  whiteListOrigins: string[];
  //logger: IWinstonLogger;
}
