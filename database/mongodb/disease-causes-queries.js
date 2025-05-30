db.DiseaseCauses.deleteMany({});

db.DiseaseCauses.insertMany([
  { name: 'parasites', createdAt: new Date(), updatedAt: new Date() },
  { name: 'fungi', createdAt: new Date(), updatedAt: new Date() },
  { name: 'bacteries', createdAt: new Date(), updatedAt: new Date() },
  { name: 'viruses', createdAt: new Date(), updatedAt: new Date() },
  { name: 'heavy metals', createdAt: new Date(), updatedAt: new Date() },
  { name: 'chemical toxicity', createdAt: new Date(), updatedAt: new Date() },
  { name: 'antinutrients', createdAt: new Date(), updatedAt: new Date() },
  { name: 'nutritional deficiency', createdAt: new Date(), updatedAt: new Date() },
]);
