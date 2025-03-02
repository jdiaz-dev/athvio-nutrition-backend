// Create Disease Nodes
MERGE (cancer:Disease {id: randomUUID(), name: "Cancer", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (constipation:Disease {id: randomUUID(), name: "Constipation", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (diabetes:Disease {id: randomUUID(), name: "Diabetes", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (depression:Disease {id: randomUUID(), name: "Depression", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (fibromyalgia:Disease {id: randomUUID(), name: "Fibromyalgia", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hypothyroidism:Disease {id: randomUUID(), name: "Hypothyroidism", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (leakyGut:Disease {id: randomUUID(), name: "Leaky Gut", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 


// Create Disease Cause Nodes
MERGE (parasites:DiseaseCause {id: randomUUID(), name: "Parasites", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (fungi:DiseaseCause {id: randomUUID(), name: "Fungi", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (bacteria:DiseaseCause {id: randomUUID(), name: "Bacteria", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (heavyMetals:DiseaseCause {id: randomUUID(), name: "Heavy Metals", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (chemicals:DiseaseCause {id: randomUUID(), name: "Chemical Toxicity", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (plastics:DiseaseCause {id: randomUUID(), name: "Plastics", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (virures:DiseaseCause {id: randomUUID(), name: "Virues", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (antiNutrients:DiseaseCause {id: randomUUID(), name: "Antinutrients", isActive: true, createdAt: datetime(), updatedAt: datetime()})


// Ensure all previous results are carried forward
WITH * 

// Connect Diseases to DiseaseCauses
MATCH (d:Disease), (c:DiseaseCause)
MERGE (d)-[:HAS_DiseaseCause]->(c)

// Create Recommendation Nodes
MERGE (castorOilRec:Recommendation {name: "Castor Oil", details: "Consume castor oil."})
MERGE (carrotRecomendation:Recommendation {name: "Carrot juice", details: "Drink 40 ounce of carrot juice."})
MERGE (propolisRec:Recommendation {name: "Propolis", details: "Consume propolis."})
MERGE (chukrutRec:Recommendation {name: "Chukrut", details: "Consume Chukrut."})
MERGE (ketoDietRec:Recommendation {name: "Keto Diet", details: "Realize ketogenic diet."})
MERGE (oreganOilRec:Recommendation {name: "Oregan oil", details: "Consume oregan oil"})
MERGE (activatedCharcoalRec:Recommendation {name: "Heavy Metal Detox", details: "Take Activated charcoal."})
// MERGE (rec5:Recommendation {name: "Avoid Toxins", details: "Reduce exposure to pesticides, plastics, and processed foods."})

WITH * 

// Connect DiseaseCauses to Recommendations
MERGE (parasites)-[:HAS_RECOMMENDATION]->(castorOilRec)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(carrotRecomendation)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(propolisRec)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(chukrutRec)
MERGE (fungi)-[:HAS_RECOMMENDATION]->(ketoDietRec)
MERGE (bacteria)-[:HAS_RECOMMENDATION]->(oreganOilRec)
MERGE (heavyMetals)-[:HAS_RECOMMENDATION]->(activatedCharcoalRec)
// MERGE (chemicals)-[:HAS_RECOMMENDATION]->(rec5)


// Create Restriction Nodes
MERGE (restrictCarrot1:Restriction { name:"Diabetes"})
MERGE (restrictCarrot2:Restriction { name:"Cronic kidney disease"})

// Ensure previous results are carried forward
WITH * 

// Connect Recommendations to Restrictions
MERGE (carrotRecomendation)-[:HAS_RESTRICTION]->(restrictCarrot1)
MERGE (carrotRecomendation)-[:HAS_RESTRICTION]->(restrictCarrot2)


WITH * 
// Nutritional Preferences
MERGE (vegan:NutritionalPreference {id: randomUUID(), name: "vegan", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (lactoOvo:NutritionalPreference {id: randomUUID(), name: "lacto-ovovegetarian", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (ketogenic:NutritionalPreference {id: randomUUID(), name: "ketogenic", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (lowFODMAPs:NutritionalPreference {id: randomUUID(), name: "low in FODMAPs", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (glutenFree:NutritionalPreference {id: randomUUID(), name: "gluten free", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (dairyFree:NutritionalPreference {id: randomUUID(), name: "dairy free", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hipocaloric:NutritionalPreference {id: randomUUID(), name: "hipocaloric", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hipoglycemic:NutritionalPreference {id: randomUUID(), name: "hipoglycemic", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hypolipidic:NutritionalPreference {id: randomUUID(), name: "hypolipidic", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (lowInFiber:NutritionalPreference {id: randomUUID(), name: "low in fiber", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hypoproteic:NutritionalPreference {id: randomUUID(), name: "hypoproteic", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hyposodic:NutritionalPreference {id: randomUUID(), name: "hyposodic", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (richInFibers:NutritionalPreference {id: randomUUID(), name: "rich in fibers", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hyperproteic:NutritionalPreference {id: randomUUID(), name: "hyperproteic", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 

