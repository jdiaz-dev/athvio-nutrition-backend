//insert food

db.Foods.insertMany([
  {
    name: 'chicken',
  },
  {
    name: 'tomatoe',
  },
  {
    name: 'chard',
  },
  {
    name: 'cabagge',
  },
  {
    name: 'meat',
  },
  {
    name: 'carrot',
  },
  {
    name: 'orange',
  },
  {
    name: 'lettuce',
  },
  {
    name: 'cucumber',
  },
  {
    name: 'fish',
  },
]);


db.Foods.insertMany([
  {
    name: 'bean',
  },
  {
    name: 'parsley',
  },
  {
    name: 'celery',
  },
  {
    name: 'apple',
  },
  {
    name: 'banana',
  },
  {
    name: 'eggs',
  },
  {
    name: 'liver',
  },
  {
    name: 'pink meat',
  },
  {
    name: 'watermelon',
  },
  {
    name: 'avocado',
  },
]);

db.Foods.find()
    .skip( 15)
    .limit( 5 )


//get foods

{
  $match: {
    $or: [{ name: /[a-zA-Z0-9]*/ }],
  },
},


db.Foods.aggregate([
  {
    $match: {
      $or: [{ name: /[a-zA-Z0-9]*/ }],
    },
  },
  {
    $facet: {
      data: [
        {
          $skip: 10,
        },
        {
          $limit: 5,
        }
      ],
      meta: [
        { $count: 'total' },
      ],
    },
  },

  {
    $project: {
      data: 1,
      total: { $arrayElemAt: ['$meta.total', 0] },
    },
  },
]);


db.Foods.aggregate([
  { $count: 'total' },

  {
    $project: {
      total: 1,
    },
  },
]);
