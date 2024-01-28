export enum ErrorUsersEnum {
  USER_NOT_FOUND = 'This user does not exist.',
  EMAIL_EXISTS = 'This email already exists.',
  // INVALID_PASSWORD = 'La contraseña es incorrecta',
}

export enum ProfessionalMessages {
  PROFESSIONAL_NOT_FOUND = 'This professional does not exist.',
}

export enum ErrorPatientsEnum {
  CLIENT_NOT_FOUND = 'This patient does not exist.',
  CLIENTS_TO_SEARCH_ERROR = 'An error has ocurred searching patients'
}

export enum ErrorProgramTagEnum {
  PROGRAM_TAG_NOT_FOUND = 'This program tag does not exist.',
}

export enum ErrorProgramEnum {
  PROGRAM_NOT_FOUND = 'This program does not exist.',
}

export enum ErrorPatientGroupEnum {
  CLIENT_GROUP_NOT_FOUND = 'This patient group does not exist.',
}

export enum ErrorPatientPlanEnum {
  CLIENT_PLAN_NOT_FOUND = 'This patient plan does not exist.',
}

export enum ErrorCustomRecipeEnum {
  CUSTOM_RECIPE_NOT_FOUND = 'This custom recipe does not exist.',
}

export enum ErrorCaloryEnum {
  CALORY_NOT_FOUND = 'This calory does not exist.',
}

export enum AuthorizationMessages {
  NOT_AUTHORIZED = 'You are not authorized',
}

export enum ErrorFoodsProvider {
  FOOD_PARSER = 'An error has happened at moment to get food parser',
  FOOD_AUTOCOMPLETE = 'An error has happened at moment to get food autocomplete',
}
