//insersions
db.NutritionalMeals.insertOne();

db.NutritionalMeals.insertMany();

db.NutritionalMeals.updateMany(
  {}, // filter
  { $set: { category: 'Dressings, dips and sauces' } },
);

db.NutritionalMeals.updateMany({}, { $set: { language: 'en' } });

db.NutritionalMeals.updateMany({}, { $rename: { owner: 'source' } });

db.NutritionalMeals.updateMany(
  {
    '_id': ObjectId('67dc55fb4c0d70b0aaabab53'),
    'ingredientDetails.ingredient.amount': { $type: 'string' }, // Find records where amount is a string
  },
  [
    {
      $set: {
        'ingredientDetails.$[elem].ingredient.amount': {
          $toDouble: '$ingredientDetails.$[elem].ingredient.amount',
        },
      },
    },
  ],
  {
    arrayFilters: [{ 'elem.ingredient.amount': { $type: 'string' } }], // Apply update only to array elements where amount is a string
  },
);

//get
db.NutritionalMeals.find({ category: 'Dressings, dips and sauces' });
db.NutritionalMeals.find({ category: 'Dressings, dips and sauces' }).count();

//aggregate
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

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Update each document with a random UUID string
db.NutritionalMeals.find().forEach((doc) => {
  db.NutritionalMeals.updateOne({ _id: doc._id }, { $set: { uuid: uuidv4() } });
});

//available nutritional meal cateories
const catories = ['Dressings, dips and sauces'];

/* 
  (modifications in recipes - chris wark)
    - naccho cheese deps (cooking instructrions) 

  * omitted
      - bean and rice flatbread (need to think how to relate other mentioned meals)
      - easy backed tofu

  * ommited notes property (updated prompt)
      - juicer hot sauce
*/
