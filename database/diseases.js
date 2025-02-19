db.Diseases.deleteMany({});

db.Diseases.insertMany([
  { name: 'candidiasis', createdAt: new Date(), updatedAt: new Date() },
  {
    name: 'hypothyrodism',
    symptoms: [],
    prompts: ['Create a nutritional plan for hypothyroidism'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { name: 'leaky gut', createdAt: new Date(), updatedAt: new Date() },
]);
