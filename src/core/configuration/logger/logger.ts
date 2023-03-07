import { IWinstonLogger } from "../environment.interface";

export const WINSTON_LOGGER: IWinstonLogger = {
  nameAzureStorage: process.env.ACCOUNT_AZURE_STORAGE,
  keyAzureStorage: process.env.ACCOUNT_KEY_AZURE_STORAGE,
  containerName: process.env.CONTAINER_LOGS,
  errorBlob: process.env.ERROR_BLOB,
  exceptionBlob: process.env.EXCEPTION_BLOB,
};
