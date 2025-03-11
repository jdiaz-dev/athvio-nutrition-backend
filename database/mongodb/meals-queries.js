const val = '';
db.Meals.aggregate([
  {
    $match: {
      professional: ObjectId('6422c35d6231936802545552'),
      isDeleted: false,
    },
  },
  {
    $match: {
      $or: [{ name: /String()/ }],
    },
  },
]);
