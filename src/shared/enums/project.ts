export const defaultSizePageFoodProvider = 20;

export enum EnumEnvironments {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

export enum ManageProgramTags {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum ManageClientGroup {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum AlloweGender {
  MALE = 'male',
  FEMALE = 'female',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum ClientState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export enum PlanState {
  COMPLETED = 'completed',
  MISSED = 'missed',
  UPCOMING = 'upcoming',
}

export enum CommenterType {
  PROFESSIONAL = 'professional',
  CLIENT = 'client',
}

export enum UnitPreference {
  IMPERIAL = 'imperial',
  METRIC = 'metric',
}

export enum UserType {
  PROFESSIONAL = 'professional',
  CLIENT = 'client',
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
