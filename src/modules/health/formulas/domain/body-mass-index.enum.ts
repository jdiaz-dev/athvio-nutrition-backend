export enum BodyMassIndexPopulationGroup {
  ADULT = 'ADULT',
  OLDER_ADULT = 'OLDER_ADULT',
  PREGNANT = 'PREGNANT',
  CHILD_ADOLESCENT = 'CHILD_ADOLESCENT',
}

export enum BodyMassIndexIndicator {
  BMI = 'BMI',
  BMI_FOR_AGE_Z = 'BMI_FOR_AGE_Z',
}

// WHO 2007 BMI-for-age reference covers 61 to 228 months (5 to 19 years)
export const BMI_FOR_AGE_MIN_MONTHS = 61;
export const BMI_FOR_AGE_MAX_MONTHS = 228;

export enum BodyMassIndexErrorEnum {
  CLASSIFICATION_NOT_FOUND = 'No existe una tabla de clasificación de IMC para los datos ingresados',
  UNDER_FIVE_YEARS = 'En menores de 5 años se usa peso para la talla, no IMC',
  PREGNANCY_ONLY_FEMALE = 'La clasificación para gestantes solo aplica al género femenino',
  BMI_FOR_AGE_REFERENCE_NOT_FOUND = 'No se encontró la referencia OMS de IMC para la edad',
}
