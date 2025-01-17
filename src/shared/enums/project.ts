export const weightIngrams = 100;
export const defaultSizePageFoodProvider = 20;
export const CustomFieldsGroupName = 'Customized'; //to allow the professional create his own custom questions

export enum EnumEnvironments {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

export enum EnumRoles {
  //ADMIN = 'admin',//todo: implement admin role?
  PROFESSIONAL = 'professional',
  PATIENT = 'patient',
}

export enum ManageProgramTags {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum ManagePatientGroup {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum AllowedGender {
  MALE = 'male',
  FEMALE = 'female',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum PatientState {
  ACTIVE = 'active',
  // INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  INVITATION_PENDING = 'invitation_pending',
}

export enum PlanState {
  COMPLETED = 'completed',
  MISSED = 'missed',
  UPCOMING = 'upcoming',
}

export enum CommenterType {
  PROFESSIONAL = 'professional',
  PATIENT = 'patient',
}

export enum UnitPreference {
  IMPERIAL = 'imperial',
  METRIC = 'metric',
}

export enum Pagination {
  DATA = 'data',
  TOTAL = 'total',
  META = 'meta',
}

export enum FoodDatabases {
  ALL = 'ALL',
  SYSTEM = 'SYSTEM',
  CUSTOM_RECIPES = 'CUSTOM_RECIPES',
}

export enum IngredientType {
  CUSTOM_INGREDIENT = 'CUSTOM_INGREDIENT',
  UNIQUE_INGREDIENT = 'UNIQUE_INGREDIENT',
}

export enum Commenter {
  PROFESSIONAL = 'professional',
  PATIENT = 'patient',
}

export enum LayersServer {
  INFRAESTRUCTURE = 'infrastructure',
  APPLICATION = 'application',
}
