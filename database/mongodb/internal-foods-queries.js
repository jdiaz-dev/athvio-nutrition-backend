// brouped by foodDetails.label, checking for duplicates
db.InternalFoods.aggregate([
  {
    $group: {
      _id: '$foodDetails.label',
      count: { $sum: 1 },
      docs: { $push: '$$ROOT' },
    },
  },
  {
    $match: {
      count: { $gt: 1 },
    },
  },
]);

db.InternalFoods.updateMany(
  { 'measures.label': 'Gram' },
  {
    $set: {
      'measures.$[elem].label': 'Gramos',
    },
  },
  {
    arrayFilters: [{ 'elem.label': 'Gram' }],
  },
);
