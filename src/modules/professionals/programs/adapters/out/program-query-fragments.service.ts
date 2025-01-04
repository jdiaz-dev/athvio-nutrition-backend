export class ProgramQueryFragmentsService {
  static filterPlansAndNestedMeals(): Record<string, any> {
    return {
      $map: {
        input: {
          $sortArray: {
            input: {
              $filter: {
                input: '$plans',
                as: 'plan',
                cond: { $eq: ['$$plan.isDeleted', false] },
              },
            },
            sortBy: { day: 1 },
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
  static sortPlansByDay(): Record<string, any> {
    return { $sortArray: { input: '$plans', sortBy: { day: 1 } } };
  }
}
