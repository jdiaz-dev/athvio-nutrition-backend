export class ProgramQueryFragmentsService {
  static filterPlansAndNestedMeals(): Record<string, any> {
    return {
      $map: {
        input: {
          $filter: {
            input: '$plans',
            as: 'plan',
            cond: { $eq: ['$$plan.isDeleted', false] },
          },
        },
        as: 'plan',
        in: {
          _id: '$$plan._id',
          title: '$$plan.title',
          week: '$$plan.week',
          day: '$$plan.day',
          meals: {
            $filter: {
              input: '$$plan.meals',
              as: 'meal',
              cond: { $eq: ['$$meal.isDeleted', false] },
            },
          },
        },
      },
    };
  }
}
