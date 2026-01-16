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
  { 'measures.label': 'Grams' },
  {
    $set: {
      'measures.$[elem].label': 'Gram',
    },
  },
  {
    arrayFilters: [{ 'elem.label': 'Grams' }],
  },
);
db.InternalFoods.find({ isSuccessfullUpdated: true });
db.InternalFoods.find({ isSuccessfullUpdated: { $exists: false } });
db.InternalFoods.find({ 'measures.spanishLabel': { $exists: false } });
db.InternalFoods.find({ 'nutrientDetails.SUGAR.added': { $exists: true } });
db.InternalFoods.countDocuments({ isSuccessfullUpdated: true });
db.InternalFoods.updateMany({}, { $unset: { stayedOffset: '' } });
db.InternalFoods.updateMany(
  { 'nutrientDetails.SUGAR.added': { $exists: true } },
  {
    $rename: {
      'nutrientDetails.SUGAR.added': 'nutrientDetails.SUGAR_ADDED',
    },
  },
);

db.InternalFoods.updateMany(
  {},
  {
    $set: {
      'measures.$[tb].spanishLabel': 'Gramo',
    },
  },
  {
    arrayFilters: [{ 'tb.label': 'Gram' }],
  },
);

//to find duplicated foods
db.InternalFoods.aggregate([
  {
    $group: {
      _id: {
        // foodId: '$foodDetails.foodId',
        label: '$foodDetails.label',
      },
      count: { $sum: 1 },
    },
  },
  {
    $match: {
      count: { $gt: 1 },
    },
  },
]).toArray().length;

// ------------------------------------------------- to delete repeated foods (delete excess less the first)
const coll = db.collection; // <- change this to your collection name

const cursor = coll.aggregate([
  {
    $group: {
      _id: {
        // foodId: "$foodDetails.foodId",
        label: '$foodDetails.label',
      },
      ids: { $push: '$_id' }, // all docs with this pair
      count: { $sum: 1 },
    },
  },
  {
    $match: {
      count: { $gt: 1 }, // only groups with duplicates
    },
  },
]);

cursor.forEach((group) => {
  // Sort ids so "first" is stable (oldest ObjectId)
  group.ids.sort();

  // Remove the first one (we keep it)
  const [keepId, ...idsToDelete] = group.ids;

  if (idsToDelete.length > 0) {
    print(`Keeping ${keepId} for foodId=${group._id.foodId}, label=${group._id.label}, deleting:`, idsToDelete);

    coll.deleteMany({ _id: { $in: idsToDelete } });
  }
});
