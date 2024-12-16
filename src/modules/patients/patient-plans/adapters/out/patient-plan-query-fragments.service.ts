export class PatientPlanQueryFragmentsService {
  static filterNestedMeals(): Record<string, any> {
    return {
      $filter: {
        input: '$meals',
        as: 'meal',
        cond: {
          $eq: ['$$meal.isDeleted', false],
        },
      },
    };
  }
}
