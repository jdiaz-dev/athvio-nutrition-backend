import { IEnvironment } from './environment';

export const production: IEnvironment = {
  storage: {
    // foodImagesStorage: process.env.FOOD_IMAGES_STORAGE,
    foodImagesStorageUrl: process.env.FOOD_IMAGES_STORAGE_URL,
    internalFoodImagesStorage: process.env.INTERNAL_FOOD_IMAGES_STORAGE,
    internalFoodImagesDirectory: process.env.INTERNAL_FOOD_IMAGES_DIRECTORY,
    internalFoodStorageUrl: process.env.INTERNAL_FOOD_STORAGE_URL,
  },
  foodProvider: {
    foodApi: {
      edamamFoodParserUrl: process.env.EDAMAM_FOOD_PARSER_URL,
      edamamFoodAppId: process.env.EDAMAM_FOOD_APP_ID,
      edamamFoodKey: process.env.EDAMAM_FOOD_KEY,
    },
  },
  gptProvider: {
    gptSecretKey: process.env.GPT_SECRET_KEY,
  },
  translationProvider: {
    deeplAuthKey: process.env.DEEPL_AUTH_KEY,
  },
  mailsSender: process.env.MAILS_SENDER,
  productionTesterProfessionalId: process.env.PRODUCTION_TESTER_PROFESSIONAL_ID,
  productionMasterProfessionalId: process.env.PRODUCTION_MASTER_PROFESSIONAL_ID,
};
