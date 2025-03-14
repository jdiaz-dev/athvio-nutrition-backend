db.NutritionalMeals.insertOne()

db.NutritionalMeals.insertMany()

db.NutritionalMeals.updateMany(
  {}, // filter
  { $set: { category: "Dressings, dips and sauces" } }
);


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


//available nutritional meal cateories
const catories = [
  "Dressings, dips and sauces"
]

/* 
  (modifications in recipes - chris wark)
    - naccho cheese deps (cooking instructrions) 

  * omitted
      - bean and rice flatbread (need to think how to relate other mentioned meals)
      - easy backed tofu

  * ommited notes property (updated prompt)
      - juicer hot sauce
*/