// db.Patients.find({ })

db.Patients.createIndex({ user: 'text' });
db.Patients.dropIndex('user_text');

db.Users.createIndex({ firstname: 'text' });
db.Users.dropIndex('firstname_text');

//get patients
db.Patients.aggregate([
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
    $lookup: {
      from: 'PatientGroups',
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
    $facet: {
      data: [
        {
          $project: {
            user: { $arrayElemAt: ['$user', 0] },
            location: 1,
            groups: 1,
          },
        },
       /*  {
          $project:
          user
        } */
        {
          $match: {
            $or: [
              { 'user.firstname': /z/gi },
              { 'user.lastname': /z/gi },
              {
                $expr: {
                  $regexMatch: {
                    input: {
                      $concat: ['$user.firstname', ' ', '$user.lastname'],
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
            'user.firstname': 1,
            'user.lastname': 1,
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
              { 'user.firstname': /z/gi },
              { 'user.lastname': /z/gi },
              {
                $expr: {
                  $regexMatch: {
                    input: {
                      $concat: ['$user.firstname', ' ', '$user.lastname'],
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
