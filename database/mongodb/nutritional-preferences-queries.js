db.NutritionalPreferences.deleteMany({});

db.NutritionalPreferences.insertMany([
  { name: 'vegan', createdAt: new Date(), updatedAt: new Date() },
  { name: 'lacto-ovovegetarian', createdAt: new Date(), updatedAt: new Date() },
  { name: 'ketogenic', createdAt: new Date(), updatedAt: new Date() },
  { name: 'low in FODMAPs', createdAt: new Date(), updatedAt: new Date() },
  { name: 'gluten free', createdAt: new Date(), updatedAt: new Date() },
  { name: 'dairy free', createdAt: new Date(), updatedAt: new Date() },
  { name: 'hipocaloric', createdAt: new Date(), updatedAt: new Date() },
  { name: 'hipoglycemic', createdAt: new Date(), updatedAt: new Date() },
  { name: 'hypolipidic', createdAt: new Date(), updatedAt: new Date() },
  { name: 'low in fiber', createdAt: new Date(), updatedAt: new Date() },
  { name: 'hypoproteic', createdAt: new Date(), updatedAt: new Date() },
  { name: 'hyposodic', createdAt: new Date(), updatedAt: new Date() },
  { name: 'rich in fibers', createdAt: new Date(), updatedAt: new Date() },
  { name: 'hyperproteic', createdAt: new Date(), updatedAt: new Date() },
]);
