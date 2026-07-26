type INeo4j = {
  database: string;
  scheme: string;
  host: string;
  port: string;
  username: string;
  password: string;
};

type IDatabase = {
  mongodb: string;
  mongodb2: string;
  neo4j: INeo4j;
};

type Storage = {
  // foodImagesStorage: string;
  foodImagesStorageUrl: string;
  internalFoodImagesStorage: string;
  internalFoodImagesDirectory: string;
  internalFoodStorageUrl: string;
};

type FoodApi = {
  edamamFoodParserUrl: string;
  edamamFoodAppId: string;
  edamamFoodKey: string;
};
type FoodProvider = {
  foodApi: FoodApi;
};

type GptProvider = {
  gptSecretKey: string;
};

type TranslationProvider = {
  deeplAuthKey: string;
};

export type IEnvironment = {
  database: IDatabase;
  storage: Storage;
  whiteListOrigins: string[];
  foodProvider: FoodProvider;
  gptProvider: GptProvider;
  translationProvider: TranslationProvider;
  port: string;
  mailsSender: string;
  productionTesterProfessionalId: string;
  productionMasterProfessionalId: string;
};
