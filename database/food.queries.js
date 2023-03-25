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

//get foods

db.Foods.aggregate([
  {
    $match: {
      $or: [{ name: /ang/ }],
    },
  },
  {
    $facet: {
      data: [
        {
          $match: {
            $or: [{ name: /ang/ }],
          },
        },
        {
          $limit: 10,
        },
        {
          $skip: 0,
        },
      ],
      meta: [
        {
          $match: {
            $or: [{ name: /ang/ }],
          },
        },
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
