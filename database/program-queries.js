//get program

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
          meals: '$plans.mealPlans',
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

// order plans by day
db.Programs.aggregate([
  {
    $match: {
      _id: ObjectId('64261b407cb7c26f7d01769d'),
      professional: ObjectId('6422c35d6231936802545552'),
      isDeleted: false,
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      programTags: 1,
      clients: 1,
      result: { $sortArray: { input: '$plans', sortBy: { day: 1 } } },
    },
  },
]);

/* db.engineers.aggregate( [
    {
        $match: {
            _id: ObjectId('642efeef3c68498cd8ae62b3'),
          }
    },
    { $project:
       {
           _id: 0,
           result:
             {
                $sortArray: { input: "$team", sortBy: { age: 1 } }
             }
       }
    }
 ] ) */
