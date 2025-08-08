
// -------------------------- Disease Cause Nodes
MERGE (mucoidPlaque:DiseaseCause {name: "Placa mucoide"})
ON CREATE SET mucoidPlaque.uuid = randomUUID(), mucoidPlaque.isActive = true, mucoidPlaque.createdAt = datetime(), mucoidPlaque.updatedAt = datetime()
MERGE (parasites:DiseaseCause {name: "Parásitos"})
ON CREATE SET parasites.uuid = randomUUID(), parasites.isActive = true, parasites.createdAt = datetime(), parasites.updatedAt = datetime()
MERGE (fungi:DiseaseCause {name: "Hongos"})
ON CREATE SET fungi.uuid = randomUUID(), fungi.isActive = true, fungi.createdAt = datetime(), fungi.updatedAt = datetime()
MERGE (bacteria:DiseaseCause {name: "Bacterias"})
ON CREATE SET bacteria.uuid = randomUUID(), bacteria.isActive = true, bacteria.createdAt = datetime(), bacteria.updatedAt = datetime()
MERGE (heavyMetals:DiseaseCause {name: "Metales pesados"})
ON CREATE SET heavyMetals.uuid = randomUUID(), heavyMetals.isActive = true, heavyMetals.createdAt = datetime(), heavyMetals.updatedAt = datetime()
MERGE (plastics:DiseaseCause {name: "Plásticos"})
ON CREATE SET plastics.uuid = randomUUID(), plastics.isActive = true, plastics.createdAt = datetime(), plastics.updatedAt = datetime()
MERGE (químicos:DiseaseCause {name: "Químicos"})
ON CREATE SET químicos.uuid = randomUUID(), químicos.isActive = true, químicos.createdAt = datetime(), químicos.updatedAt = datetime()
MERGE (viruses:DiseaseCause {name: "Viruses"})
ON CREATE SET viruses.uuid = randomUUID(), viruses.isActive = true, viruses.createdAt = datetime(), viruses.updatedAt = datetime()
MERGE (endodontics:DiseaseCause {name: "Endodoncia"})
ON CREATE SET endodontics.uuid = randomUUID(), endodontics.isActive = true, endodontics.createdAt = datetime(), endodontics.updatedAt = datetime()
MERGE (antiNutrients:DiseaseCause {name: "Antinutrientes"})
ON CREATE SET antiNutrients.uuid = randomUUID(), antiNutrients.isActive = true, antiNutrients.createdAt = datetime(), antiNutrients.updatedAt = datetime()

WITH *

// -------------------------- Disease Nodes
MERGE (cancer:Disease {name: "Cancer"})
ON CREATE SET cancer.uuid = randomUUID(), cancer.isActive = true, cancer.createdAt = datetime(), cancer.updatedAt = datetime()
MERGE (constipation:Disease {name: "Estreñimiento"})
ON CREATE SET constipation.uuid = randomUUID(), constipation.isActive = true, constipation.createdAt = datetime(), constipation.updatedAt = datetime()
MERGE (diabetes:Disease {name: "Diabetes"})
ON CREATE SET diabetes.uuid = randomUUID(), diabetes.isActive = true, diabetes.createdAt = datetime(), diabetes.updatedAt = datetime()
MERGE (ckd:Disease {name: "CKD"})
ON CREATE SET ckd.uuid = randomUUID(), ckd.isActive = true, ckd.createdAt = datetime(), ckd.updatedAt = datetime()
MERGE (depression:Disease {name: "Depresión"})
ON CREATE SET depression.uuid = randomUUID(), depression.isActive = true, depression.createdAt = datetime(), depression.updatedAt = datetime()
MERGE (fibromyalgia:Disease {name: "Fibromialgia"})
ON CREATE SET fibromyalgia.uuid = randomUUID(), fibromyalgia.isActive = true, fibromyalgia.createdAt = datetime(), fibromyalgia.updatedAt = datetime()
MERGE (hypothyroidism:Disease {name: "Hipotiroidismo"})
ON CREATE SET hypothyroidism.uuid = randomUUID(), hypothyroidism.isActive = true, hypothyroidism.createdAt = datetime(), hypothyroidism.updatedAt = datetime()
MERGE (leakyGut:Disease {name: "Intestino permeable"})
ON CREATE SET leakyGut.uuid = randomUUID(), leakyGut.isActive = true, leakyGut.createdAt = datetime(), leakyGut.updatedAt = datetime()
MERGE (gastritis:Disease {name: "Gastritis"})
ON CREATE SET gastritis.uuid = randomUUID(), gastritis.isActive = true, gastritis.createdAt = datetime(), gastritis.updatedAt = datetime()


//caused by abscence of magnesium
MERGE (infarction:Disease {name: "Infarto"})
ON CREATE SET infarction.uuid = randomUUID(), infarction.isActive = true, infarction.createdAt = datetime(), infarction.updatedAt = datetime()
MERGE (cerebroVascularAccident:Disease {name: "Accidente Cerebrovascular"})
ON CREATE SET cerebroVascularAccident.uuid = randomUUID(), cerebroVascularAccident.isActive = true, cerebroVascularAccident.createdAt = datetime(), cerebroVascularAccident.updatedAt = datetime()
MERGE (osteoarthritis:Disease {name: "Artrosis"})
ON CREATE SET osteoarthritis.uuid = randomUUID(), osteoarthritis.isActive = true, osteoarthritis.createdAt = datetime(), osteoarthritis.updatedAt = datetime()


//Include Chukrut/sauerkraut twice by week
//Incluye Chucrut/encurtidos 2 veces por semana
// -------------------------- Recommendation Nodes (for causes)
MERGE (psylliumHusk:Recommendation {name: "Psyllium Husk"})
ON CREATE SET psylliumHusk.uuid = randomUUID(), psylliumHusk.details = 'Incluir 1 cuchara de psyllium husk todos los dias', psylliumHusk.isActive = true, psylliumHusk.createdAt = datetime(), psylliumHusk.updatedAt = datetime()
MERGE (castorOilRec:Recommendation {name: "Aceite de ricino"})
ON CREATE SET castorOilRec.uuid = randomUUID(), castorOilRec.details = 'Incluye el primer dia 20 ml  de aceite de ricino y repetir cada 3 dias', castorOilRec.isActive = true, castorOilRec.createdAt = datetime(), castorOilRec.updatedAt = datetime()
MERGE (carrotRec:Recommendation {name: "Jugo de zanahoria"})
ON CREATE SET carrotRec.uuid = randomUUID(), carrotRec.details = 'Incluye 1L de jugo de zanahoria cada dia (primera comida del dia despues de la infusión si esque la hubo)', carrotRec.isActive = true, carrotRec.createdAt = datetime(), carrotRec.updatedAt = datetime()
MERGE (celeryRec:Recommendation {name: "Jugo de apio y pepino"})
ON CREATE SET celeryRec.uuid = randomUUID(), celeryRec.details = 'Incluye 1 L de jugo de apio y pepino cada dia', celeryRec.isActive = true, celeryRec.createdAt = datetime(), celeryRec.updatedAt = datetime()
MERGE (cabbageRec:Recommendation {name: "Jugo de repollo"})
ON CREATE SET cabbageRec.uuid = randomUUID(), cabbageRec.details = 'Incluye 0,25L de jugo de repollo cada dia', cabbageRec.isActive = true, cabbageRec.createdAt = datetime(), cabbageRec.updatedAt = datetime()
MERGE (propolisRec:Recommendation {name: "Propóleo"})
ON CREATE SET propolisRec.uuid = randomUUID(), propolisRec.details = 'Incluye propóleo crudo 2 veces por semana empezando el segundo dia',  propolisRec.isActive = true, propolisRec.createdAt = datetime(), propolisRec.updatedAt = datetime() 
MERGE (chukrutRec:Recommendation {name: "Chucrut"})
ON CREATE SET chukrutRec.uuid = randomUUID(), chukrutRec.details = 'Incluye Chucrut/encurtidos 2 veces por semana', chukrutRec.isActive = true, chukrutRec.createdAt = datetime(), chukrutRec.updatedAt = datetime() 
MERGE (ketoRec:Recommendation {name: "Dieta cetogénica"})
ON CREATE SET ketoRec.uuid = randomUUID(), ketoRec.details = "Sigue una dieta cetogénica", ketoRec.isActive = true, ketoRec.createdAt = datetime(), ketoRec.updatedAt = datetime() 
MERGE (oreganOilRec:Recommendation {name: "Aceite de Orégano"})
ON CREATE SET oreganOilRec.uuid = randomUUID(), oreganOilRec.details = "Consume aceite de orégano", oreganOilRec.isActive = true, oreganOilRec.createdAt = datetime(), oreganOilRec.updatedAt = datetime() 
MERGE (brasilNutsRec:Recommendation {name: "Quelación mediante selenio"})
ON CREATE SET brasilNutsRec.uuid = randomUUID(), brasilNutsRec.details = 'Incluye 2 nueces de brasil remojado todos los dias', brasilNutsRec.isActive = true, brasilNutsRec.createdAt = datetime(), brasilNutsRec.updatedAt = datetime() 
MERGE (magnesium:Recommendation {name: "Magnesio"})
ON CREATE SET magnesium.uuid = randomUUID(), magnesium.details = "Consumir 500 mg de citráto de magnesio", magnesium.isActive = true, magnesium.createdAt = datetime(), magnesium.updatedAt = datetime() 
MERGE (lysine:Recommendation {name: "Lisina"})
ON CREATE SET lysine.uuid = randomUUID(), lysine.details = "Consumir alimentos con lisina", lysine.isActive = true, lysine.createdAt = datetime(), lysine.updatedAt = datetime() 
MERGE (boneBroth:Recommendation {name: "Caldo de huesos"})
ON CREATE SET boneBroth.uuid = randomUUID(), boneBroth.details = 'Consumir caldo de huesos todos los dias', boneBroth.isActive = true, boneBroth.createdAt = datetime(), boneBroth.updatedAt = datetime() 
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
MERGE (gcbombs:Recommendation {name: "gcbombs"})
ON CREATE SET gcbombs.uuid = randomUUID(), gcbombs.details = 'Incluir verduras, cruciferas, frijoles, cebolla, hongos, bayas y semillas', gcbombs.isActive = true, gcbombs.createdAt = datetime(), gcbombs.updatedAt = datetime() 

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
MERGE (vegan:NutritionalPreference {name: "Vegano"})
ON CREATE SET vegan.uuid = randomUUID(), vegan.isActive = true, 
vegan.spanishDetails = "La dieta debe ser vegano", 
vegan.createdAt = datetime(), vegan.updatedAt = datetime()
MERGE (lactoOvo:NutritionalPreference {name: "Lacto-ovovegetariano"})
ON CREATE SET lactoOvo.uuid = randomUUID(), lactoOvo.isActive = true, 
lactoOvo.spanishDetails = "La dieta debe ser lacto-ovovegetariano", 
lactoOvo.createdAt = datetime(), lactoOvo.updatedAt = datetime()
MERGE (carnivore:NutritionalPreference {name: "Carnívoro"})
ON CREATE SET carnivore.uuid = randomUUID(), carnivore.isActive = true, 
carnivore.spanishDetails = "La dieta debe ser carnívoro", 
carnivore.createdAt = datetime(), carnivore.updatedAt = datetime()
MERGE (homnivore:NutritionalPreference {name: "Homnívoro"})
ON CREATE SET homnivore.uuid = randomUUID(), homnivore.isActive = true, 
homnivore.spanishDetails = "La dieta debe ser homnívoro", 
homnivore.createdAt = datetime(), homnivore.updatedAt = datetime()
MERGE (ketogenic:NutritionalPreference {name: "Ketogénico"})
ON CREATE SET ketogenic.uuid = randomUUID(), ketogenic.isActive = true, 
ketogenic.spanishDetails = "La dieta debe ser cetogénico", 
ketogenic.createdAt = datetime(), ketogenic.updatedAt = datetime()
MERGE (lowFODMAPs:NutritionalPreference {name: "Bajo en FODMAPs"})
ON CREATE SET lowFODMAPs.uuid = randomUUID(), lowFODMAPs.isActive = true, 
lowFODMAPs.spanishDetails = "La dieta debe ser bajo en FODMAPs", 
lowFODMAPs.createdAt = datetime(), lowFODMAPs.updatedAt = datetime()
MERGE (hypocaloric:NutritionalPreference {name: "Hipocalórico"})
ON CREATE SET hypocaloric.uuid = randomUUID(), hypocaloric.isActive = true, 
hypocaloric.spanishDetails = "La dieta debe ser hipocalórico", 
hypocaloric.createdAt = datetime(), hypocaloric.updatedAt = datetime()
MERGE (hypoglycemic:NutritionalPreference {name: "Hipoglicémico"})
ON CREATE SET hypoglycemic.uuid = randomUUID(), hypoglycemic.isActive = true, 
hypoglycemic.spanishDetails = "La dieta debe ser hipoglicémico", 
hypoglycemic.createdAt = datetime(), hypoglycemic.updatedAt = datetime()
MERGE (lowFiber:NutritionalPreference {name: "Bajo en fibra"})
ON CREATE SET lowFiber.uuid = randomUUID(), lowFiber.isActive = true, 
lowFiber.spanishDetails = "La dieta debe ser bajo en fibra", 
lowFiber.createdAt = datetime(), lowFiber.updatedAt = datetime()
MERGE (richInFibers:NutritionalPreference {name: "Rico en fibra"})
ON CREATE SET richInFibers.uuid = randomUUID(), richInFibers.isActive = true, 
richInFibers.spanishDetails = "La dieta debe ser rico en fibra", 
richInFibers.createdAt = datetime(), richInFibers.updatedAt = datetime()
MERGE (glutenFree:NutritionalPreference {name: "Libre de gluten"})
ON CREATE SET glutenFree.uuid = randomUUID(), glutenFree.isActive = true, 
glutenFree.spanishDetails = "La dieta debe ser libre de gluten", 
glutenFree.createdAt = datetime(), glutenFree.updatedAt = datetime()
MERGE (grainFree:NutritionalPreference {name: "Libre de granos"})
ON CREATE SET grainFree.uuid = randomUUID(), grainFree.isActive = true, 
grainFree.spanishDetails = "La dieta debe ser libre de granos", 
grainFree.createdAt = datetime(), grainFree.updatedAt = datetime()
MERGE (dairyFree:NutritionalPreference {name: "Libre de lácteos"})
ON CREATE SET dairyFree.uuid = randomUUID(), dairyFree.isActive = true, 
dairyFree.spanishDetails = "La dieta debe ser libre de lácteos", 
dairyFree.createdAt = datetime(), dairyFree.updatedAt = datetime()
MERGE (infusions:NutritionalPreference {name: 'Infusiones de adaptógenos'})
ON CREATE SET infusions.uuid = randomUUID(), infusions.isActive = true, 
infusions.spanishDetails = "La dieta debe incluir infusiones con adaptógenos", 
infusions.createdAt = datetime(), infusions.updatedAt = datetime()
//homocistein - test to discard stroke