
// -------------------------- Disease Cause Nodes
MERGE (mucoidPlaque:DiseaseCause {spanishName: "Placa mucoide"})
ON CREATE SET mucoidPlaque.uuid = randomUUID(), 
mucoidPlaque.englishName = "Mucoid Plaque",
mucoidPlaque.isActive = true, mucoidPlaque.createdAt = datetime(), mucoidPlaque.updatedAt = datetime()
MERGE (parasites:DiseaseCause {spanishName: "Parásitos"})
ON CREATE SET parasites.uuid = randomUUID(), 
parasites.englishName = "Parasites", 
parasites.isActive = true, parasites.createdAt = datetime(), parasites.updatedAt = datetime()
MERGE (fungi:DiseaseCause {spanishName: "Hongos"})
ON CREATE SET fungi.uuid = randomUUID(), 
fungi.englishName = "Fungi", 
fungi.isActive = true, fungi.createdAt = datetime(), fungi.updatedAt = datetime()
MERGE (bacteria:DiseaseCause {spanishName: "Bacterias"})
ON CREATE SET bacteria.uuid = randomUUID(), bacteria.englishName = "Bacteria", bacteria.isActive = true, bacteria.createdAt = datetime(), bacteria.updatedAt = datetime()
MERGE (heavyMetals:DiseaseCause {spanishName: "Metales pesados"})
ON CREATE SET heavyMetals.uuid = randomUUID(), 
heavyMetals.englishName = "Heavy Metals", 
heavyMetals.isActive = true, heavyMetals.createdAt = datetime(), heavyMetals.updatedAt = datetime()
MERGE (plastics:DiseaseCause {spanishName: "Plásticos"})
ON CREATE SET plastics.uuid = randomUUID(), 
plastics.englishName = "Plastics", 
plastics.isActive = true, plastics.createdAt = datetime(), plastics.updatedAt = datetime()
MERGE (químicos:DiseaseCause {spanishName: "Químicos"})
ON CREATE SET químicos.uuid = randomUUID(), 
químicos.englishName = "Chemicals", 
químicos.isActive = true, químicos.createdAt = datetime(), químicos.updatedAt = datetime()
MERGE (viruses:DiseaseCause {spanishName: "Viruses"})
ON CREATE SET viruses.uuid = randomUUID(), 
viruses.englishName = "Viruses", 
viruses.isActive = true, viruses.createdAt = datetime(), viruses.updatedAt = datetime()
MERGE (endodontics:DiseaseCause {spanishName: "Endodoncia"})
ON CREATE SET endodontics.uuid = randomUUID(), 
endodontics.englishName = "Endodontics", 
endodontics.isActive = true, endodontics.createdAt = datetime(), endodontics.updatedAt = datetime()
MERGE (antiNutrients:DiseaseCause {spanishName: "Antinutrientes"})
ON CREATE SET antiNutrients.uuid = randomUUID(), 
antiNutrients.englishName = "Antinutrients", 
antiNutrients.isActive = true, antiNutrients.createdAt = datetime(), antiNutrients.updatedAt = datetime()

WITH *

// -------------------------- Disease Nodes
MERGE (cancer:Disease {spanishName: "Cancer"})
ON CREATE SET cancer.uuid = randomUUID(), cancer.isActive = true, cancer.createdAt = datetime(), cancer.updatedAt = datetime()
MERGE (constipation:Disease {spanishName: "Estreñimiento"})
ON CREATE SET constipation.uuid = randomUUID(), 
constipation.englishName = "Constipation",
constipation.isActive = true, constipation.createdAt = datetime(), constipation.updatedAt = datetime()
MERGE (diabetes:Disease {spanishName: "Diabetes"})
ON CREATE SET diabetes.uuid = randomUUID(), 
diabetes.englishName = "Diabetes", 
diabetes.isActive = true, diabetes.createdAt = datetime(), diabetes.updatedAt = datetime()
MERGE (ckd:Disease {spanishName: "CKD"})
ON CREATE SET ckd.uuid = randomUUID(), 
ckd.englishName = "CKD", 
ckd.isActive = true, ckd.createdAt = datetime(), ckd.updatedAt = datetime()
MERGE (depression:Disease {spanishName: "Depresión"})
ON CREATE SET depression.uuid = randomUUID(), 
depression.englishName = "Depression", 
depression.isActive = true, depression.createdAt = datetime(), depression.updatedAt = datetime()
MERGE (fibromyalgia:Disease {spanishName: "Fibromialgia"})
ON CREATE SET fibromyalgia.uuid = randomUUID(), 
fibromyalgia.englishName = "Fibromyalgia", 
fibromyalgia.isActive = true, fibromyalgia.createdAt = datetime(), fibromyalgia.updatedAt = datetime()
MERGE (hypothyroidism:Disease {spanishName: "Hipotiroidismo"})
ON CREATE SET hypothyroidism.uuid = randomUUID(), 
hypothyroidism.englishName = "Hypothyroidism", 
hypothyroidism.isActive = true, hypothyroidism.createdAt = datetime(), hypothyroidism.updatedAt = datetime()
MERGE (leakyGut:Disease {spanishName: "Intestino permeable"})
ON CREATE SET leakyGut.uuid = randomUUID(), 
leakyGut.englishName = "Leaky Gut", 
leakyGut.isActive = true, leakyGut.createdAt = datetime(), leakyGut.updatedAt = datetime()
MERGE (gastritis:Disease {spanishName: "Gastritis"})
ON CREATE SET gastritis.uuid = randomUUID(), 
gastritis.englishName = "Gastritis", 
gastritis.isActive = true, gastritis.createdAt = datetime(), gastritis.updatedAt = datetime()


//caused by abscence of magnesium
MERGE (infarction:Disease {spanishName: "Infarto"})
ON CREATE SET infarction.uuid = randomUUID(), infarction.englishName = "Infarction", infarction.isActive = true, infarction.createdAt = datetime(), infarction.updatedAt = datetime()
MERGE (cerebroVascularAccident:Disease {spanishName: "Accidente Cerebrovascular"})
ON CREATE SET cerebroVascularAccident.uuid = randomUUID(), cerebroVascularAccident.englishName = "Cerebrovascular Accident", cerebroVascularAccident.isActive = true, cerebroVascularAccident.createdAt = datetime(), cerebroVascularAccident.updatedAt = datetime()
MERGE (osteoarthritis:Disease {spanishName: "Artrosis"})
ON CREATE SET osteoarthritis.uuid = randomUUID(), osteoarthritis.englishName = "Osteoarthritis", osteoarthritis.isActive = true, osteoarthritis.createdAt = datetime(), osteoarthritis.updatedAt = datetime()


//Include Chukrut/sauerkraut twice by week
//Incluye Chucrut/encurtidos 2 veces por semana
// -------------------------- Recommendation Nodes (for causes)
MERGE (psylliumHusk:Recommendation {spanishName: "Psyllium Husk"})
ON CREATE SET psylliumHusk.uuid = randomUUID(), 
psylliumHusk.englishName = "Psyllium Husk",
psylliumHusk.spanishDetails = 'Incluir 1 cuchara de psyllium husk todos los dias', 
psylliumHusk.englishDetails = 'Include 1 spoon of psyllium husk every day',
psylliumHusk.isActive = true, psylliumHusk.createdAt = datetime(), psylliumHusk.updatedAt = datetime()
MERGE (castorOilRec:Recommendation {spanishName: "Aceite de ricino"})
ON CREATE SET castorOilRec.uuid = randomUUID(), castorOilRec.englishName = "Castor Oil", 
castorOilRec.spanishDetails = 'Incluye el primer dia 20 ml  de aceite de ricino y repetir cada 3 dias', 
castorOilRec.englishDetails = 'Include 20 ml of castor oil on the first day and repeat every 3 days',
castorOilRec.isActive = true, castorOilRec.createdAt = datetime(), castorOilRec.updatedAt = datetime()
MERGE (carrotRec:Recommendation {spanishName: "Jugo de zanahoria"})
ON CREATE SET carrotRec.uuid = randomUUID(), carrotRec.englishName = "Carrot Juice", 
carrotRec.spanishDetails = 'Incluye 1L de jugo de zanahoria cada dia (primera comida del dia despues de la infusión si esque la hubo)', 
carrotRec.englishDetails = 'Include 1L of carrot juice every day (first meal of the day after the infusion if there was one)',
carrotRec.isActive = true, carrotRec.createdAt = datetime(), carrotRec.updatedAt = datetime()
MERGE (celeryRec:Recommendation {spanishName: "Jugo de apio y pepino"})
ON CREATE SET celeryRec.uuid = randomUUID(), celeryRec.englishName = "Celery and Cucumber Juice", 
celeryRec.spanishDetails = 'Incluye 1 L de jugo de apio y pepino cada dia', 
celeryRec.englishDetails = 'Include 1L of celery and cucumber juice every day',
celeryRec.isActive = true, celeryRec.createdAt = datetime(), celeryRec.updatedAt = datetime()
MERGE (cabbageRec:Recommendation {spanishName: "Jugo de repollo"})
ON CREATE SET cabbageRec.uuid = randomUUID(), cabbageRec.englishName = "Cabbage Juice", 
cabbageRec.spanishDetails = 'Incluye 0,25L de jugo de repollo cada dia', 
cabbageRec.englishDetails = 'Include 0.25L of cabbage juice every day',
cabbageRec.isActive = true, cabbageRec.createdAt = datetime(), cabbageRec.updatedAt = datetime()
MERGE (propolisRec:Recommendation {spanishName: "Propóleo"})
ON CREATE SET propolisRec.uuid = randomUUID(), propolisRec.englishName = "Propolis", 
propolisRec.spanishDetails = 'Incluye propóleo crudo 2 veces por semana empezando el segundo dia',  
propolisRec.englishDetails = 'Include raw propolis 2 times a week starting on the second day',
propolisRec.isActive = true, propolisRec.createdAt = datetime(), propolisRec.updatedAt = datetime() 
MERGE (chukrutRec:Recommendation {spanishName: "Chucrut"})
ON CREATE SET chukrutRec.uuid = randomUUID(), chukrutRec.englishName = "Sauerkraut", 
chukrutRec.spanishDetails = 'Incluye Chucrut/encurtidos 2 veces por semana', 
chukrutRec.englishDetails = 'Include sauerkraut/pickles 2 times a week',
chukrutRec.isActive = true, chukrutRec.createdAt = datetime(), chukrutRec.updatedAt = datetime() 
MERGE (ketoRec:Recommendation {spanishName: "Dieta cetogénica"})
ON CREATE SET ketoRec.uuid = randomUUID(), ketoRec.englishName = "Ketogenic Diet", 
ketoRec.spanishDetails = "Sigue una dieta cetogénica", ketoRec.isActive = true, 
ketoRec.englishDetails = "Follow a ketogenic diet",
ketoRec.createdAt = datetime(), ketoRec.updatedAt = datetime() 
MERGE (oreganOilRec:Recommendation {spanishName: "Aceite de Orégano"})
ON CREATE SET oreganOilRec.uuid = randomUUID(), oreganOilRec.englishName = "Oregano Oil", 
oreganOilRec.spanishDetails = "Consume aceite de orégano", 
oreganOilRec.englishDetails = "Consume oregano oil",
oreganOilRec.isActive = true, oreganOilRec.createdAt = datetime(), oreganOilRec.updatedAt = datetime() 
MERGE (brasilNutsRec:Recommendation {spanishName: "Quelación mediante selenio"})
ON CREATE SET brasilNutsRec.uuid = randomUUID(), brasilNutsRec.englishName = "Selenium Chelation", 
brasilNutsRec.spanishDetails = 'Incluye 2 nueces de brasil remojado todos los dias', 
brasilNutsRec.englishDetails = 'Include 2 soaked Brazil nuts every day',
brasilNutsRec.isActive = true, brasilNutsRec.createdAt = datetime(), brasilNutsRec.updatedAt = datetime() 
MERGE (magnesium:Recommendation {spanishName: "Magnesio"})
ON CREATE SET magnesium.uuid = randomUUID(), magnesium.englishName = "Magnesium", 
magnesium.spanishDetails = "Consumir 500 mg de citráto de magnesio", 
magnesium.englishDetails = "Consume 500 mg of magnesium citrate",
magnesium.isActive = true, magnesium.createdAt = datetime(), magnesium.updatedAt = datetime() 
MERGE (lysine:Recommendation {spanishName: "Lisina"})
ON CREATE SET lysine.uuid = randomUUID(), lysine.englishName = "Lysine", 
lysine.spanishDetails = "Consumir alimentos con lisina", 
lysine.englishDetails = "Consume foods rich in lysine",
lysine.isActive = true, lysine.createdAt = datetime(), lysine.updatedAt = datetime() 
MERGE (boneBroth:Recommendation {spanishName: "Caldo de huesos"})
ON CREATE SET boneBroth.uuid = randomUUID(), boneBroth.englishName = "Bone Broth", 
boneBroth.spanishDetails = 'Consumir caldo de huesos todos los dias', 
boneBroth.englishDetails = 'Consume bone broth every day',
boneBroth.isActive = true, boneBroth.createdAt = datetime(), boneBroth.updatedAt = datetime() 
//black seeds
//garlic

WITH * 
// Connect Diseases to DiseaseCauses
MATCH (d:Disease), (dc:DiseaseCause)
//cancer
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(viruses)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(heavyMetals)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(plastics)
MERGE (cancer)-[:HAS_DISEASE_CAUSE]->(endodontics)

//constipation
MERGE (constipation)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
MERGE (constipation)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (constipation)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (constipation)-[:HAS_DISEASE_CAUSE]->(bacteria)

//diabetes
MERGE (diabetes)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
MERGE (diabetes)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (diabetes)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (diabetes)-[:HAS_DISEASE_CAUSE]->(bacteria)

//CKD

//depression
MERGE (depression)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
MERGE (depression)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (depression)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (depression)-[:HAS_DISEASE_CAUSE]->(bacteria)

//fibromialgia
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(viruses)
MERGE (fibromyalgia)-[:HAS_DISEASE_CAUSE]->(endodontics)

//hypothyroidism
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(bacteria)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(viruses)
MERGE (hypothyroidism)-[:HAS_DISEASE_CAUSE]->(heavyMetals)

//leakyGut
MERGE (leakyGut)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
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

//gastritis
MERGE (gastritis)-[:HAS_DISEASE_CAUSE]->(mucoidPlaque)
MERGE (gastritis)-[:HAS_DISEASE_CAUSE]->(parasites)
MERGE (gastritis)-[:HAS_DISEASE_CAUSE]->(fungi)
MERGE (gastritis)-[:HAS_DISEASE_CAUSE]->(bacteria)

WITH *

// Connect DiseaseCauses to Recommendations (cause to recommendation)
MERGE (mucoidPlaque)-[:HAS_RECOMMENDATION]->(celeryRec)
MERGE (mucoidPlaque)-[:HAS_RECOMMENDATION]->(carrotRec)
MERGE (mucoidPlaque)-[:HAS_RECOMMENDATION]->(psylliumHusk)
MERGE (mucoidPlaque)-[:HAS_RECOMMENDATION]->(castorOilRec)
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
MERGE (heavyMetals)-[:HAS_RECOMMENDATION]->(brasilNutsRec)
MERGE (heavyMetals)-[:HAS_RECOMMENDATION]->(cabbageRec)
MERGE (infarction)-[:HAS_RECOMMENDATION]->(magnesium)
MERGE (cerebroVascularAccident)-[:HAS_RECOMMENDATION]->(magnesium)
MERGE (osteoarthritis)-[:HAS_RECOMMENDATION]->(magnesium)


WITH * 
// Create Recommendation Nodes (for specific disease)
MERGE (gcbombs:Recommendation {spanishName: "gcbombs"})
ON CREATE SET gcbombs.uuid = randomUUID(), 
gcbombs.englishName = "gcbombs",
gcbombs.spanishDetails = 'Incluir verduras, cruciferas, frijoles, cebolla, hongos, bayas y semillas', 
gcbombs.englishDetails = 'Include vegetables, cruciferous, beans, onion, mushrooms, berries and seeds',
gcbombs.isActive = true, gcbombs.createdAt = datetime(), gcbombs.updatedAt = datetime() 

WITH * 
// Connect DiseaseCauses to Recommendations (disease to recommendation)
MERGE (cancer)-[:HAS_RECOMMENDATION]->(gcbombs)
MERGE (leakyGut)-[:HAS_RECOMMENDATION]->(boneBroth)

// Ensure previous results are carried forward
WITH *

// Connect Recommendations to Restrictions
MERGE (carrotRec)-[:HAS_RESTRICTION]->(diabetes)
MERGE (carrotRec)-[:HAS_RESTRICTION]->(ckd)
// MERGE (carrotRec)-[:HAS_RESTRICTION]->(liquidRetention)


WITH *

// Nutritional Preferences
MERGE (vegan:NutritionalPreference {spanishName: "Vegano"})
ON CREATE SET vegan.uuid = randomUUID(), 
vegan.englishName = "Vegan",
vegan.isActive = true, 
vegan.spanishDetails = "La dieta debe ser vegano", 
vegan.createdAt = datetime(), vegan.updatedAt = datetime()
MERGE (lactoOvo:NutritionalPreference {spanishName: "Lacto-ovovegetariano"})
ON CREATE SET lactoOvo.uuid = randomUUID(), lactoOvo.englishName = "Lacto-ovo vegetarian",
lactoOvo.isActive = true, 
lactoOvo.spanishDetails = "La dieta debe ser lacto-ovovegetariano", 
lactoOvo.englishDetails = "The diet should be lacto-ovo vegetarian",
lactoOvo.createdAt = datetime(), lactoOvo.updatedAt = datetime()
MERGE (carnivore:NutritionalPreference {spanishName: "Carnívoro"})
ON CREATE SET carnivore.uuid = randomUUID(), carnivore.englishName = "Carnivore",
carnivore.isActive = true, 
carnivore.spanishDetails = "La dieta debe ser carnívoro", 
carnivore.englishDetails = "The diet should be carnivore",
carnivore.createdAt = datetime(), carnivore.updatedAt = datetime()
MERGE (homnivore:NutritionalPreference {spanishName: "Homnívoro"})
ON CREATE SET homnivore.uuid = randomUUID(), homnivore.englishName = "Omnivore",
homnivore.isActive = true, 
homnivore.spanishDetails = "La dieta debe ser homnívoro", 
homnivore.englishDetails = "The diet should be omnivore",
homnivore.createdAt = datetime(), homnivore.updatedAt = datetime()
MERGE (ketogenic:NutritionalPreference {spanishName: "Ketogénico"})
ON CREATE SET ketogenic.uuid = randomUUID(), ketogenic.englishName = "Ketogenic",
ketogenic.isActive = true, 
ketogenic.spanishDetails = "La dieta debe ser cetogénico", 
ketogenic.englishDetails = "The diet should be ketogenic",
ketogenic.createdAt = datetime(), ketogenic.updatedAt = datetime()
MERGE (lowFODMAPs:NutritionalPreference {spanishName: "Bajo en FODMAPs"})
ON CREATE SET lowFODMAPs.uuid = randomUUID(), lowFODMAPs.englishName = "Low FODMAP",
lowFODMAPs.isActive = true, 
lowFODMAPs.spanishDetails = "La dieta debe ser bajo en FODMAPs", 
lowFODMAPs.englishDetails = "The diet should be low FODMAP",
lowFODMAPs.createdAt = datetime(), lowFODMAPs.updatedAt = datetime()
MERGE (hypocaloric:NutritionalPreference {spanishName: "Hipocalórico"})
ON CREATE SET hypocaloric.uuid = randomUUID(), hypocaloric.englishName = "Hypocaloric",
hypocaloric.isActive = true, 
hypocaloric.spanishDetails = "La dieta debe ser hipocalórico", 
hypocaloric.englishDetails = "The diet should be hypocaloric",
hypocaloric.createdAt = datetime(), hypocaloric.updatedAt = datetime()
MERGE (hypoglycemic:NutritionalPreference {spanishName: "Hipoglicémico"})
ON CREATE SET hypoglycemic.uuid = randomUUID(), hypoglycemic.englishName = "Hypoglycemic",
hypoglycemic.isActive = true, 
hypoglycemic.spanishDetails = "La dieta debe ser hipoglicémico", 
hypoglycemic.englishDetails = "The diet should be hypoglycemic",
hypoglycemic.createdAt = datetime(), hypoglycemic.updatedAt = datetime()
MERGE (lowFiber:NutritionalPreference {spanishName: "Bajo en fibra"})
ON CREATE SET lowFiber.uuid = randomUUID(), lowFiber.englishName = "Low Fiber",
lowFiber.isActive = true, 
lowFiber.spanishDetails = "La dieta debe ser bajo en fibra", 
lowFiber.englishDetails = "The diet should be low in fiber",
lowFiber.createdAt = datetime(), lowFiber.updatedAt = datetime()
MERGE (richInFibers:NutritionalPreference {spanishName: "Rico en fibra"})
ON CREATE SET richInFibers.uuid = randomUUID(), richInFibers.englishName = "Rich in Fiber",
richInFibers.isActive = true, 
richInFibers.spanishDetails = "La dieta debe ser rico en fibra",
richInFibers.englishDetails = "The diet should be rich in fiber", 
richInFibers.createdAt = datetime(), richInFibers.updatedAt = datetime()
MERGE (glutenFree:NutritionalPreference {spanishName: "Libre de gluten"})
ON CREATE SET glutenFree.uuid = randomUUID(), glutenFree.englishName = "Gluten Free",
glutenFree.isActive = true, 
glutenFree.spanishDetails = "La dieta debe ser libre de gluten", 
glutenFree.englishDetails = "The diet should be gluten free",
glutenFree.createdAt = datetime(), glutenFree.updatedAt = datetime()
MERGE (grainFree:NutritionalPreference {spanishName: "Libre de granos"})
ON CREATE SET grainFree.uuid = randomUUID(), grainFree.englishName = "Grain Free",
grainFree.isActive = true, 
grainFree.spanishDetails = "La dieta debe ser libre de granos", 
grainFree.englishDetails = "The diet should be grain free",
grainFree.createdAt = datetime(), grainFree.updatedAt = datetime()
MERGE (dairyFree:NutritionalPreference {spanishName: "Libre de lácteos"})
ON CREATE SET dairyFree.uuid = randomUUID(), dairyFree.englishName = "Dairy Free",
dairyFree.isActive = true, 
dairyFree.spanishDetails = "La dieta debe ser libre de lácteos", 
dairyFree.englishDetails = "The diet should be dairy free",
dairyFree.createdAt = datetime(), dairyFree.updatedAt = datetime()
MERGE (infusions:NutritionalPreference {spanishName: 'Infusiones de adaptógenos'})
ON CREATE SET infusions.uuid = randomUUID(), infusions.englishName = "Adaptogen Infusions",
infusions.isActive = true, 
infusions.spanishDetails = "La dieta debe incluir infusiones con adaptógenos", 
infusions.englishDetails = "The diet should include infusions with adaptogens",
infusions.createdAt = datetime(), infusions.updatedAt = datetime()
//homocistein - test to discard stroke