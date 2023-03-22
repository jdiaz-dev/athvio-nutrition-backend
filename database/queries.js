// db.Clients.find({ })

db.Clients.createIndex({ user: 'text' });
db.Clients.dropIndex('user_text');

db.Users.createIndex({ firstName: 'text' });
db.Users.dropIndex('firstName_text');

db.Clients.aggregate([
  {
    $match: {
      professional: ObjectId('6419a238517095f39a0a571c'),
    },
  },
  {
    $lookup: {
      from: 'Users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },

  {
    $match: {
      $or: [{ 'user.firstName': /lola/ }, { 'user.lastName': /per/ }],
    },
  },
  {
    $project: {
      '_id': 1,
      'user._id': 1,
      'user.firstName': 1,
      'user.lastName': 1,
      'location': 1,
    },
  },
  {
    $project: {
      user: { $arrayElemAt: ['$user', 0] },
      location: 1,
    },
  },
]);

db.Clients.aggregate([
  {
    $match: {
      professional: ObjectId('6419a238517095f39a0a571c'),
    },
  },
  {
    $lookup: {
      from: 'Users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },

  /* {
    $match: {
      $or: [{ 'user.firstName': /lola/ }, { 'user.lastName': /per/ }],
    },
  }, */
  {
    $project: {
      '_id': 1,
      'user._id': 1,
      'user.firstName': 1,
      'user.lastName': 1,
      'location': 1,
    },
  },
  {
    $project: {
      user: { $arrayElemAt: ['$user', 0] },
    },
  },
]);
