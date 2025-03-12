db.NutritionalMeals.insertOne()

db.NutritionalMeals.insertMany()

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


/* 
  (modifications in recipes - chris wark)
    - naccho cheese deps (cooking instructrions) 


*/