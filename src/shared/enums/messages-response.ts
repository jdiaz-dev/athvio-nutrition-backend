export enum InternalErrors {
  DATABASE = 'An error has happened with database',
}

export enum ErrorUsersEnum {
  USER_NOT_FOUND = 'This user does not exist.',
  EMAIL_EXISTS = 'This email already exists.',
  BAD_CREDENTIALS = 'Invalid email or password, please try again.',
}

export enum ProfessionalMessages {
  PROFESSIONAL_NOT_FOUND = 'This professional does not exist.',
}

export enum ErrorQuestionaryConfig {
  QUESTIONARY_NOT_FOUND = 'This questionary config does not exist.',
}

export enum ErrorPatientsEnum {
  PATIENT_NOT_FOUND = 'This patient does not exist.',
  CLIENTS_TO_SEARCH_ERROR = 'An error has ocurred searching patients',
  USER_IS_NOT_PATIENT = 'This user is not patient',
  USER_ALREADY_ACTIVE = 'This user is already active',
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
  GET_FOOD = 'An error has happened at moment to get food parser',
  FOOD_INTERNAL_PARSER = 'An error has happened trying to parse foods from provider',
  FOOD_AUTOCOMPLETE = 'An error has happened at moment to get food autocomplete',
}
