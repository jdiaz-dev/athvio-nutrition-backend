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

//deprecated query
db.QuestionaryConfig.aggregate([
  {
    $match: { professional: new Types.ObjectId(professional) },
  },
  { $unwind: '$groups' },
  {
    $lookup: {
      from: 'DefaultQuestionaryGroups',
      localField: 'groups.group',
      foreignField: '_id',
      as: 'defaultGroupDetails',
    },
  },
  {
    $lookup: {
      from: 'CustomQuestionaryGroups',
      localField: 'groups.group',
      foreignField: '_id',
      as: 'customGroupDetails',
    },
  },
  {
    $addFields: {
      groupDetails: {
        $concatArrays: ['$defaultGroupDetails', '$customGroupDetails'],
      },
    },
  },
  { $unwind: '$groupDetails' },
  {
    $lookup: {
      from: 'DefaultQuestions',
      localField: 'groupDetails.questions',
      foreignField: '_id',
      as: 'defaultQuestionsDetails',
    },
  },
  {
    $lookup: {
      from: 'CustomQuestions',
      localField: 'groupDetails.questions',
      foreignField: '_id',
      as: 'customQuestionsDetails',
    },
  },
  {
    $lookup: {
      from: 'Questions',
      localField: 'defaultQuestionsDetails.question',
      foreignField: '_id',
      as: 'questionDetails',
    },
  },
  {
    $addFields: {
      defaultQuestionsDetails: {
        $map: {
          input: '$defaultQuestionsDetails',
          as: 'defaultQuestion',
          in: {
            _id: '$$defaultQuestion._id',
            fieldName: {
              $arrayElemAt: [
                '$questionDetails.fieldName',
                { $indexOfArray: ['$questionDetails._id', '$$defaultQuestion.question'] },
              ],
            },
            associatedQuestion: {
              $arrayElemAt: [
                '$questionDetails.associatedQuestion',
                { $indexOfArray: ['$questionDetails._id', '$$defaultQuestion.question'] },
              ],
            },
            fieldType: {
              $arrayElemAt: [
                '$questionDetails.fieldType',
                { $indexOfArray: ['$questionDetails._id', '$$defaultQuestion.question'] },
              ],
            },
            isEnabled: '$$defaultQuestion.isEnabled',
            isDeleted: '$$defaultQuestion.isDeleted',
          },
        },
      },
    },
  },
  {
    $addFields: {
      'groupDetails.questions': {
        $concatArrays: ['$defaultQuestionsDetails', '$customQuestionsDetails'],
      },
    },
  },
  {
    $addFields: {
      groups: {
        _id: '$groupDetails._id',
        title: '$groupDetails.title',
        description: '$groupDetails.description',
        questions: '$groupDetails.questions',
        type: '$groups.type',
      },
    },
  },
  {
    $group: {
      _id: '$_id',
      professional: { $first: '$professional' },
      groups: { $push: '$groups' },
    },
  },
]);
