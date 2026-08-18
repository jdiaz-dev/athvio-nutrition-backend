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
  storage: Storage;
  foodProvider: FoodProvider;
  gptProvider: GptProvider;
  translationProvider: TranslationProvider;
  mailsSender: string;
  productionTesterProfessionalId: string;
  productionMasterProfessionalId: string;
};
