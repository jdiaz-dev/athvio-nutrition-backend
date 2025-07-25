db.Programs.insertOne();

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
      patients: 1,
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
db.Programs.aggregate([
  {
    $match: {
      _id: ObjectId('6473d0f163aef9ff8297a864'),
      professional: ObjectId('6473cf8763aef9ff8297a80a'),
      isDeleted: false,
    },
  },
  {
    $project: {
      // ...restFields,
      plans: {
        $filter: {
          input: '$plans',
          as: 'plan',
          cond: {
            $and: [{ $eq: ['$$plan.isDeleted', false] }, { $eq: ['$$plan._id', ObjectId('659405195550939679c10652')] }],
          },
        },
      },
    },
  },
  {
    $project: {
      // ...restFields,
      plans: { $sortArray: { input: '$plans', sortBy: { day: 1 } } },
    },
  },
]);

db.Programs.findOneAndUpdate(
  {
    _id: ObjectId('6473d0f163aef9ff8297a864'),
    professional: ObjectId('6473cf8763aef9ff8297a80a'),
    isDeleted: false,
  },
  {
    $push: {
      plans: {
        title: 'title pro',
        week: 234,
        meals: [
          {
            _id: ObjectId(),
            position: 25,
            mealTag: 'the first meal',
          },
          {
            _id: ObjectId(),
            position: 26,
            mealTag: 'the second meal',
          },
          {
            _id: ObjectId(),
            position: 27,
            mealTag: 'the third meal',
          },
        ],
      },
    },
  },
);

db.Programs.findOneAndUpdate(
  { _id: program, professional, isDeleted: false },
  { $push: { plans: rest } },
  {
    new: true,
    projection: {
      ...restFields,
      plans: {
        $filter: {
          input: '$plans',
          as: 'plan',
          cond: {
            $and: [{ $eq: ['$$plan.isDeleted', false] }],
          },
        },
      },
    },
  },
);

//add meal - program plan
this.programModel.findOneAndUpdate(
  { _id: program, professional },
  { $push: { 'plans.$[plan].meals': { ...mealBody } } },
  {
    arrayFilters: [{ 'plan._id': new Types.ObjectId(plan), 'plan.isDeleted': false }],
    new: true,
    projection: selectors,
  },
);

//update meal - program plan
this.programModel.findOneAndUpdate(
  { _id: program, professional },
  {
    $set: {
      'plans.$[plan].meals.$[meal].position': mealBody.position,
      'plans.$[plan].meals.$[meal].mealTag': mealBody.mealTag,
      'plans.$[plan].meals.$[meal].name': mealBody.name,
      'plans.$[plan].meals.$[meal].ingredientDetails': mealBody.ingredientDetails,
      'plans.$[plan].meals.$[meal].cookingInstructions': mealBody.cookingInstructions,
      'plans.$[plan].meals.$[meal].macros': mealBody.macros,
    },
  },
  {
    arrayFilters: [
      {
        'plan._id': new Types.ObjectId(plan),
        'plan.isDeleted': false,
      },
      {
        'meal._id': new Types.ObjectId(meal),
      },
    ],
    new: true,
    projection: {
      ...restFields,
      plans: {
        $filter: {
          input: '$plans',
          as: 'plan',
          cond: {
            $and: [{ $eq: ['$$plan.isDeleted', false] }],
          },
        },
      },
    },
  },
);

db.Programs.find().forEach((doc) => {
  db.Programs.updateOne({ _id: doc._id }, { $set: { uuid: uuidv4() } });
});
