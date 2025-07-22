//foods
MERGE (quinoa:Food {englishName: "Quinoa"})
ON CREATE SET quinoa.uuid = randomUUID(), quinoa.spanishName = "Quinoa", quinoa.internalFood = "3200f349-08b6-4117-ae0e-a71ffc056fc1", quinoa.isActive = true, quinoa.createdAt = datetime(), quinoa.updatedAt = datetime()

// compounds
MERGE (saponins:Compound {englishName: "Saponins"})
ON CREATE SET saponins.uuid = randomUUID(), saponins.spanishName = "Saponinas", saponins.isActive = true, saponins.createdAt = datetime(), saponins.updatedAt = datetime()
MERGE (phytosterols:Compound {englishName: "Phytosterols"})
ON CREATE SET phytosterols.uuid = randomUUID(), phytosterols.spanishName = "Fitoesteroles", phytosterols.isActive = true, phytosterols.createdAt = datetime(), phytosterols.updatedAt = datetime()

// mechanisms
MERGE (cytolisis:Mechanisms {englishName: "Cytolisis"})
ON CREATE SET cytolisis.uuid = randomUUID(), 
cytolisis.spanishName = "Citolisis", 
cytolisis.englishDescription = "Destroy cancer cell membranes",  
cytolisis.spanishDescription = "Destruye las membranas de las células cancerígenas", 
cytolisis.spanishRelatedDisease = "cancer", 
cytolisis.englishRelatedDisease = "cancer", 
cytolisis.isActive = true, cytolisis.createdAt = datetime(), cytolisis.updatedAt = datetime()
MERGE (apoptosis:Mechanisms {englishName: "Apoptosis"})
ON CREATE SET apoptosis.uuid = randomUUID(), 
apoptosis.spanishName = "Apoptosis", 
apoptosis.englishDescription = "Activates internal or external cell death pathways",  
apoptosis.spanishDescription = "Activa vías de muerte celular internas o externas", 
apoptosis.spanishRelatedDisease = "cancer", 
apoptosis.englishRelatedDisease = "cancer", 
apoptosis.isActive = true, apoptosis.createdAt = datetime(), apoptosis.updatedAt = datetime()
MERGE (antitumor:Mechanisms {englishName: "Antitumor"})
ON CREATE SET antitumor.uuid = randomUUID(), 
antitumor.spanishName = "Antitumoral", 
antitumor.englishDescription = "Inhibit tumor growth",  
antitumor.spanishDescription = "Inhibe el crecimiento tumoral", 
antitumor.spanishRelatedDisease = "cancer", 
antitumor.englishRelatedDisease = "cancer", 
antitumor.isActive = true, antitumor.createdAt = datetime(), antitumor.updatedAt = datetime()
MERGE (immunomodulatory:Mechanisms {englishName: "Immunomodulatory"})
ON CREATE SET immunomodulatory.uuid = randomUUID(), 
immunomodulatory.spanishName = "Immunomodulator", 
immunomodulatory.englishDescription = "Modify or regulate the immune system—either enhancing or suppressing its activity.",  
immunomodulatory.spanishDescription = "Modifica o regula el sistema inmunológico, ya sea mejorando o suprimiendo su actividad", 
immunomodulatory.spanishRelatedDisease = "cancer", 
immunomodulatory.englishRelatedDisease = "cancer", //todo: fix it, posibbly related to many diseases nor only one 
immunomodulatory.isActive = true, immunomodulatory.createdAt = datetime(), immunomodulatory.updatedAt = datetime()
MERGE (antiinflammatory:Mechanisms {englishName: "Anti-inflammatory"})
ON CREATE SET antiinflammatory.uuid = randomUUID(), 
antiinflammatory.spanishName = "Anti inflammatorio", 
antiinflammatory.englishDescription = "Neutralizes ROS (Reactive Oxygen Species)",  
antiinflammatory.spanishDescription = "Neutraliza las especies reactivas de oxígeno (ROS)", 
antiinflammatory.spanishRelatedDisease = "cancer", 
antiinflammatory.englishRelatedDisease = "cancer", //todo: fix it, posibbly related to many diseases nor only one 
antiinflammatory.isActive = true, antiinflammatory.createdAt = datetime(), antiinflammatory.updatedAt = datetime()

MERGE (quinoa)-[:HAS_COMPOUND]->(saponins)
MERGE (quinoa)-[:HAS_COMPOUND]->(phytosterols)
MERGE (saponins)-[:HAS_MECHANISMS]->(cytolisis)
MERGE (saponins)-[:HAS_MECHANISMS]->(apoptosis)
MERGE (saponins)-[:HAS_MECHANISMS]->(antitumor)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(immunomodulatory)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(antiinflammatory)