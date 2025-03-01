// Create Disease Nodes
MERGE (cancer:Disease {id: randomUUID(), name: "Cancer", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (constipation:Disease {id: randomUUID(), name: "Constipation", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (diabetes:Disease {id: randomUUID(), name: "Diabetes", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (depression:Disease {id: randomUUID(), name: "Depression", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (fibromyalgia:Disease {id: randomUUID(), name: "Fibromyalgia", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (hypothyroidism:Disease {id: randomUUID(), name: "Hypothyroidism", isActive: true, createdAt: datetime(), updatedAt: datetime()}) 
MERGE (leakyGut:Disease {id: randomUUID(), name: "Leaky , isActive: true, createdAt: datetime(), updatedAt: datetime()Gut"}) 


// Create Cause Nodes
MERGE (parasites:Cause {id: randomUUID(), name: "Parasites", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (fungi:Cause {id: randomUUID(), name: "Fungi", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (bacteria:Cause {id: randomUUID(), name: "Bacteria", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (heavyMetals:Cause {id: randomUUID(), name: "Heavy Metals", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (chemicals:Cause {id: randomUUID(), name: "Chemical Toxicity", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (plastics:Cause {id: randomUUID(), name: "Plastics", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (virures:Cause {id: randomUUID(), name: "Virues", isActive: true, createdAt: datetime(), updatedAt: datetime()})
MERGE (antiNutrients:Cause {id: randomUUID(), name: "Antinutrients", isActive: true, createdAt: datetime(), updatedAt: datetime()})


// Ensure all previous results are carried forward
WITH * 

// Connect Diseases to Causes
MATCH (d:Disease), (c:Cause)
MERGE (d)-[:HAS_CAUSE]->(c)

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

// Connect Causes to Recommendations
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
