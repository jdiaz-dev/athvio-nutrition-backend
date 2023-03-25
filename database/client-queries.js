// db.Clients.find({ })

db.Clients.createIndex({ user: 'text' });
db.Clients.dropIndex('user_text');

db.Users.createIndex({ firstName: 'text' });
db.Users.dropIndex('firstName_text');

//get clients

db.Clients.aggregate([
  {
    $match: {
      professional: ObjectId('6419a238517095f39a0a571c'),
    },
  },
  {
    $facet: {
      data: [
        {
          $lookup: {
            from: 'Users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'ClientGroups',
            let: {
              letGroups: '$groups',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      {
                        $toString: '$_id',
                      },
                      '$$letGroups',
                    ],
                  },
                },
              },
            ],
            as: 'groups',
          },
        },
        {
          $project: {
            user: { $arrayElemAt: ['$user', 0] },
            location: 1,
            groups: 1,
          },
        },
        {
          $match: {
            $or: [
              { 'user.firstName': /z/gi },
              { 'user.lastName': /z/gi },
              {
                $expr: {
                  $regexMatch: {
                    input: {
                      $concat: ['$user.firstName', ' ', '$user.lastName'],
                    },
                    regex: /maria maria/,
                    // options: 'i',
                  },
                },
              },
            ],
          },
        },
        {
          $limit: 10,
        },
        {
          $skip: 0,
        },
        {
          $project: {
            '_id': 1,
            'user._id': 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'groups': 1,
          },
        },
      ],
      totalDocuments: [
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
          $project: {
            user: { $arrayElemAt: ['$user', 0] },
            location: 1,
            groups: 1,
          },
        },
        {
          $match: {
            $or: [
              { 'user.firstName': /z/gi },
              { 'user.lastName': /z/gi },
              {
                $expr: {
                  $regexMatch: {
                    input: {
                      $concat: ['$user.firstName', ' ', '$user.lastName'],
                    },
                    regex: /maria maria/,
                    // options: 'i',
                  },
                },
              },
            ],
          },
        },
        { $count: 'total' },
      ],
    },
  },
  {
    $project: {
      data: 1,
      total: { $arrayElemAt: ['$totalDocuments.total', 0] },
    },
  },
]);

