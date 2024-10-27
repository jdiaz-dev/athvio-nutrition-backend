//get program

//grouping by week and after group by first level properties to deliver original structure and only modify plans grouped by week
db.Programs.aggregate([
    {
      $match: {
        _id: ObjectId('64261b407cb7c26f7d01769d'),
        professional: ObjectId('6422c35d6231936802545552'),
        isDeleted: false,
      },
    },
    {
      $unwind: '$plans',
    },
    {
      $group: {
        _id: {
          programId: '$_id',
          week: '$plans.week',
          name: '$name',
          description: '$description',
        },
        plans: {
          $push: {
            title: '$plans.title',
            day: '$plans.day',
            meals: '$plans.meals',
          },
        },
      },
    },
    {
      $group: {
        _id: {
          programId: '$_id.programId',
          name: '$_id.name',
          description: '$_id.description',
        },
        plans: {
          $push: {
            week: '$_id.week',
            mealPlans: '$plans',
          },
        },
      },
    },
    {
      $project: {
        _id: '$_id.programId',
        name: '$_id.name',
        description: '$_id.description',
        plans: 1,
      },
    },
  ]);
