db.Diseases.deleteMany({});

db.Diseases.insertMany([
  { name: 'alzheimer', createdAt: new Date(), updatedAt: new Date() },
  { name: 'autism', createdAt: new Date(), updatedAt: new Date() },
  { name: 'cancer', createdAt: new Date(), updatedAt: new Date() },
  { name: 'candidiasis', createdAt: new Date(), updatedAt: new Date() },
  { name: 'constipation', createdAt: new Date(), updatedAt: new Date() },
  {
    name: 'hypothyrodism',
    symptoms: [],
    prompts: ['Create a nutritional plan for hypothyroidism'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { name: 'leaky gut', createdAt: new Date(), updatedAt: new Date() },
  { name: 'parkinson', createdAt: new Date(), updatedAt: new Date() },
  { name: 'psoriasis', createdAt: new Date(), updatedAt: new Date() },
]);
//  diseases | preferences and restrictions

/* 
  - to have data:
    - goals 
    - diseases, or historial of diseases
    - lab test, blood test (results , documents)
    - nutritic approach (vegetarian, carnivore, keto, etc)
    - caloric intake
*/

/* 
* heal diseases
  parasites
    - coconut oil, castor oil, 
    - keto

  candida
    - keto 

  constipation
    - keto 

*/
