
// -------------------------- Disease Cause Nodes
MERGE (parasites:DiseaseCause {name: "Parasites"})
ON CREATE SET parasites.uuid = randomUUID(), parasites.isActive = true, parasites.createdAt = datetime(), parasites.updatedAt = datetime()
MERGE (fungi:DiseaseCause {name: "Fungi"})
ON CREATE SET fungi.uuid = randomUUID(), fungi.isActive = true, fungi.createdAt = datetime(), fungi.updatedAt = datetime()
MERGE (bacteria:DiseaseCause {name: "Bacteria"})
ON CREATE SET bacteria.uuid = randomUUID(), bacteria.isActive = true, bacteria.createdAt = datetime(), bacteria.updatedAt = datetime()
MERGE (heavyMetals:DiseaseCause {name: "Heavy Metals"})
ON CREATE SET heavyMetals.uuid = randomUUID(), heavyMetals.isActive = true, heavyMetals.createdAt = datetime(), heavyMetals.updatedAt = datetime()
MERGE (plastics:DiseaseCause {name: "Plastics"})
ON CREATE SET plastics.uuid = randomUUID(), plastics.isActive = true, plastics.createdAt = datetime(), plastics.updatedAt = datetime()
MERGE (viruses:DiseaseCause {name: "Viruses"})
ON CREATE SET viruses.uuid = randomUUID(), viruses.isActive = true, viruses.createdAt = datetime(), viruses.updatedAt = datetime()
MERGE (antiNutrients:DiseaseCause {name: "Antinutrients"})
ON CREATE SET antiNutrients.uuid = randomUUID(), antiNutrients.isActive = true, antiNutrients.createdAt = datetime(), antiNutrients.updatedAt = datetime()

WITH *

// -------------------------- Disease Nodes
MERGE (cancer:Disease {name: "Cancer"})
ON CREATE SET cancer.uuid = randomUUID(), cancer.isActive = true, cancer.createdAt = datetime(), cancer.updatedAt = datetime()
MERGE (constipation:Disease {name: "Constipation"})
ON CREATE SET constipation.uuid = randomUUID(), constipation.isActive = true, constipation.createdAt = datetime(), constipation.updatedAt = datetime()
MERGE (diabetes:Disease {name: "Diabetes"})
ON CREATE SET diabetes.uuid = randomUUID(), diabetes.isActive = true, diabetes.createdAt = datetime(), diabetes.updatedAt = datetime()
MERGE (ckd:Disease {name: "CKD"})
ON CREATE SET ckd.uuid = randomUUID(), ckd.isActive = true, ckd.createdAt = datetime(), ckd.updatedAt = datetime()
MERGE (depression:Disease {name: "Depression"})
ON CREATE SET depression.uuid = randomUUID(), depression.isActive = true, depression.createdAt = datetime(), depression.updatedAt = datetime()
MERGE (fibromyalgia:Disease {name: "Fibromyalgia"})
ON CREATE SET fibromyalgia.uuid = randomUUID(), fibromyalgia.isActive = true, fibromyalgia.createdAt = datetime(), fibromyalgia.updatedAt = datetime()
MERGE (hypothyroidism:Disease {name: "Hypothyroidism"})
ON CREATE SET hypothyroidism.uuid = randomUUID(), hypothyroidism.isActive = true, hypothyroidism.createdAt = datetime(), hypothyroidism.updatedAt = datetime()
MERGE (leakyGut:Disease {name: "Leaky Gut"})
ON CREATE SET leakyGut.uuid = randomUUID(), leakyGut.isActive = true, leakyGut.createdAt = datetime(), leakyGut.updatedAt = datetime()


//caused by abscence of magnesium
MERGE (infarction:Disease {name: "Infarction"})
ON CREATE SET infarction.uuid = randomUUID(), infarction.isActive = true, infarction.createdAt = datetime(), infarction.updatedAt = datetime()
MERGE (cerebroVascularAccident:Disease {name: "Cerebrovascular Accident"})
ON CREATE SET cerebroVascularAccident.uuid = randomUUID(), cerebroVascularAccident.isActive = true, cerebroVascularAccident.createdAt = datetime(), cerebroVascularAccident.updatedAt = datetime()
MERGE (osteoarthritis:Disease {name: "Osteoarthritis"})
ON CREATE SET osteoarthritis.uuid = randomUUID(), osteoarthritis.isActive = true, osteoarthritis.createdAt = datetime(), osteoarthritis.updatedAt = datetime()


// -------------------------- Recommendation Nodes (for causes)
MERGE (castorOilRec:Recommendation {name: "Castor Oil"})
ON CREATE SET castorOilRec.uuid = randomUUID(), castorOilRec.details = '"""Include the first day 20 ml of castor oil and repeat 3 days after (as suplement)"""', castorOilRec.isActive = true, castorOilRec.createdAt = datetime(), castorOilRec.updatedAt = datetime()
MERGE (carrotRec:Recommendation {name: "Carrot juice"})
ON CREATE SET carrotRec.uuid = randomUUID(), carrotRec.details = '"""Include 1 1/2L of carrot juice every day"""', carrotRec.isActive = true, carrotRec.createdAt = datetime(), carrotRec.updatedAt = datetime()
MERGE (cabbageRec:Recommendation {name: "Cabbage juice"})
ON CREATE SET cabbageRec.uuid = randomUUID(), cabbageRec.details = '"""Include 0.25L of cabbagge juice every day"""', cabbageRec.isActive = true, cabbageRec.createdAt = datetime(), cabbageRec.updatedAt = datetime()
MERGE (propolisRec:Recommendation {name: "Propolis"})
ON CREATE SET propolisRec.uuid = randomUUID(), propolisRec.details = '"""Include raw propolis twice by week starting the second day (as suplement)"""',  propolisRec.isActive = true, propolisRec.createdAt = datetime(), propolisRec.updatedAt = datetime() 
MERGE (chukrutRec:Recommendation {name: "Chukrut"})
ON CREATE SET chukrutRec.uuid = randomUUID(), chukrutRec.details = '"""Include Chukrut/sauerkraut twice by week"""', chukrutRec.isActive = true, chukrutRec.createdAt = datetime(), chukrutRec.updatedAt = datetime() 
MERGE (ketoRec:Recommendation {name: "Keto Diet"})
ON CREATE SET ketoRec.uuid = randomUUID(), ketoRec.details = "Follow a ketogenic diet", ketoRec.isActive = true, ketoRec.createdAt = datetime(), ketoRec.updatedAt = datetime() 
MERGE (oreganOilRec:Recommendation {name: "Oregano Oil"})
ON CREATE SET oreganOilRec.uuid = randomUUID(), oreganOilRec.details = "Consume oregano oil", oreganOilRec.isActive = true, oreganOilRec.createdAt = datetime(), oreganOilRec.updatedAt = datetime() 
MERGE (charcoalRec:Recommendation {name: "Heavy Metal Detox"})
ON CREATE SET charcoalRec.uuid = randomUUID(), charcoalRec.details = "Take activated charcoal", charcoalRec.isActive = true, charcoalRec.createdAt = datetime(), charcoalRec.updatedAt = datetime() 
MERGE (magnesium:Recommendation {name: "Magnesium"})
ON CREATE SET magnesium.uuid = randomUUID(), magnesium.details = "Consume 500 mg of magnesium", magnesium.isActive = true, magnesium.createdAt = datetime(), magnesium.updatedAt = datetime() 
MERGE (lysine:Recommendation {name: "Lysine"})
ON CREATE SET lysine.uuid = randomUUID(), lysine.details = "Consume foods with lysine", lysine.isActive = true, lysine.createdAt = datetime(), lysine.updatedAt = datetime() 
//black seeds
//garlic

WITH * 
// Connect Diseases to DiseaseCauses
MATCH (d:Disease), (dc:DiseaseCause)
//cancer
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(viruses)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(heavyMetals)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(plastics)

//constipation
MERGE (constipation)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (constipation)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (constipation)-[:HAS_DISEASE_CAUSE]->(bacteria)

//diabetes
MERGE (diabetes)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (diabetes)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (diabetes)-[:HAS_DISEASE_CAUSE]->(bacteria)

//CKD

//depression
MERGE (depression)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (depression)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (depression)-[:HAS_DISEASE_CAUSE]->(bacteria)

//fibromialgia
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(viruses)

//hypothyroidism
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(viruses)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(heavyMetals)

//leakyGut
MERGE (leakyGut)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (leakyGut)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (leakyGut)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (leakyGut)-[:HAS_DISEASE_CAUSE]->(viruses)
MERGE (leakyGut)-[:HAS_DISEASE_CAUSE]->(heavyMetals)

//infarction
MERGE (infarction)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (infarction)-[:HAS_DISEASE_CAUSE]->(magnesium)
MERGE (infarction)-[:HAS_DISEASE_CAUSE]->(lysine)

//cerebroVascularAccident
MERGE (cerebroVascularAccident)-[:HAS_DISEASE_CAUSE]->(magnesium)

//osteoarthritis
MERGE (osteoarthritis)-[:HAS_DISEASE_CAUSE]->(magnesium)

WITH *

// Connect DiseaseCauses to Recommendations (cause to recommendation)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(castorOilRec)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(carrotRec)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(propolisRec)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(chukrutRec)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(cabbageRec)
MERGE (parasites)-[:HAS_RECOMMENDATION]->(oreganOilRec)
MERGE (fungi)-[:HAS_RECOMMENDATION]->(ketoRec)
MERGE (fungi)-[:HAS_RECOMMENDATION]->(carrotRec)
MERGE (fungi)-[:HAS_RECOMMENDATION]->(cabbageRec)
MERGE (fungi)-[:HAS_RECOMMENDATION]->(oreganOilRec)
MERGE (bacteria)-[:HAS_RECOMMENDATION]->(oreganOilRec)
MERGE (bacteria)-[:HAS_RECOMMENDATION]->(cabbageRec)
MERGE (heavyMetals)-[:HAS_RECOMMENDATION]->(charcoalRec)
MERGE (heavyMetals)-[:HAS_RECOMMENDATION]->(cabbageRec)
MERGE (infarction)-[:HAS_RECOMMENDATION]->(magnesium)
MERGE (cerebroVascularAccident)-[:HAS_RECOMMENDATION]->(magnesium)
MERGE (osteoarthritis)-[:HAS_RECOMMENDATION]->(magnesium)


WITH * 
// Create Recommendation Nodes (for specific disease)
MERGE (gcbombs:Recommendation {name: "gcbombs"})
ON CREATE SET gcbombs.uuid = randomUUID(), gcbombs.details = '"""Include greens, cruciferous, beans, onions, mushrooms, berries and seeds"""', gcbombs.isActive = true, gcbombs.createdAt = datetime(), gcbombs.updatedAt = datetime() 

WITH * 
// Connect DiseaseCauses to Recommendations (disease to recommendation)
MERGE (cancer)-[:HAS_RECOMMENDATION]->(gcbombs)

// Ensure previous results are carried forward
WITH *

// Connect Recommendations to Restrictions
MERGE (carrotRec)-[:HAS_RESTRICTION]->(diabetes)
MERGE (carrotRec)-[:HAS_RESTRICTION]->(ckd)
// MERGE (carrotRec)-[:HAS_RESTRICTION]->(liquidRetention)


WITH *

// Nutritional Preferences
MERGE (vegan:NutritionalPreference {name: "Vegan"})
ON CREATE SET vegan.uuid = randomUUID(), vegan.isActive = true, vegan.createdAt = datetime(), vegan.updatedAt = datetime()
MERGE (lactoOvo:NutritionalPreference {name: "Lacto-ovovegetarian"})
ON CREATE SET lactoOvo.uuid = randomUUID(), lactoOvo.isActive = true, lactoOvo.createdAt = datetime(), lactoOvo.updatedAt = datetime()
MERGE (ketogenic:NutritionalPreference {name: "Ketogenic"})
ON CREATE SET ketogenic.uuid = randomUUID(), ketogenic.isActive = true, ketogenic.createdAt = datetime(), ketogenic.updatedAt = datetime()
MERGE (lowFODMAPs:NutritionalPreference {name: "Low in FODMAPs"})
ON CREATE SET lowFODMAPs.uuid = randomUUID(), lowFODMAPs.isActive = true, lowFODMAPs.createdAt = datetime(), lowFODMAPs.updatedAt = datetime()
MERGE (glutenFree:NutritionalPreference {name: "Gluten Free"})
ON CREATE SET glutenFree.uuid = randomUUID(), glutenFree.isActive = true, glutenFree.createdAt = datetime(), glutenFree.updatedAt = datetime()
MERGE (dairyFree:NutritionalPreference {name: "Dairy Free"})
ON CREATE SET dairyFree.uuid = randomUUID(), dairyFree.isActive = true, dairyFree.createdAt = datetime(), dairyFree.updatedAt = datetime()
MERGE (hypocaloric:NutritionalPreference {name: "Hypocaloric"})
ON CREATE SET hypocaloric.uuid = randomUUID(), hypocaloric.isActive = true, hypocaloric.createdAt = datetime(), hypocaloric.updatedAt = datetime()
MERGE (hypoglycemic:NutritionalPreference {name: "Hypoglycemic"})
ON CREATE SET hypoglycemic.uuid = randomUUID(), hypoglycemic.isActive = true, hypoglycemic.createdAt = datetime(), hypoglycemic.updatedAt = datetime()
MERGE (lowFiber:NutritionalPreference {name: "Low in Fiber"})
ON CREATE SET lowFiber.uuid = randomUUID(), lowFiber.isActive = true, lowFiber.createdAt = datetime(), lowFiber.updatedAt = datetime()
MERGE (richInFibers:NutritionalPreference {name: "Rich in Fibers"})
ON CREATE SET richInFibers.uuid = randomUUID(), richInFibers.isActive = true, richInFibers.createdAt = datetime(), richInFibers.updatedAt = datetime()

//homocistein - test to discard stroke