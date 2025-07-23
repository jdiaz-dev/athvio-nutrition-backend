//foods
MERGE (quinoa:Food {englishName: "Quinoa"})
ON CREATE SET quinoa.uuid = randomUUID(), quinoa.spanishName = "Quinoa", quinoa.internalFood = "3200f349-08b6-4117-ae0e-a71ffc056fc1", quinoa.isActive = true, quinoa.createdAt = datetime(), quinoa.updatedAt = datetime()

// compounds
MERGE (saponins:Compound {englishName: "Saponins"})
ON CREATE SET saponins.uuid = randomUUID(), saponins.spanishName = "Saponinas", saponins.isActive = true, saponins.createdAt = datetime(), saponins.updatedAt = datetime()
MERGE (phytosterols:Compound {englishName: "Phytosterols"})
ON CREATE SET phytosterols.uuid = randomUUID(), phytosterols.spanishName = "Fitoesteroles", phytosterols.isActive = true, phytosterols.createdAt = datetime(), phytosterols.updatedAt = datetime()
MERGE (quercetin:Compound {englishName: "Quercetin"})
ON CREATE SET quercetin.uuid = randomUUID(), quercetin.spanishName = "Quercetina", quercetin.isActive = true, quercetin.createdAt = datetime(), quercetin.updatedAt = datetime()

// mechanisms
MERGE (cytolisisyyy:Mechanisms {englishName: "Cytolisisyyy"})
ON CREATE SET cytolisisyyy.uuid = randomUUID(), 
cytolisisyyy.spanishName = "Citolisisyyy", 
cytolisisyyy.englishCategory = "Cytolisis", 
cytolisisyyy.spanishCategory = "Citolisis", 
cytolisisyyy.englishDescription = "Destroy cancer cell membranes",  
cytolisisyyy.spanishDescription = "Destruye las membranas de las células cancerígenas", 
cytolisisyyy.spanishRelatedDisease = "cancer", 
cytolisisyyy.englishRelatedDisease = "cancer", 
cytolisisyyy.isActive = true, cytolisisyyy.createdAt = datetime(), cytolisisyyy.updatedAt = datetime()
MERGE (apoptosisyyy:Mechanisms {englishName: "Apoptosisyyy"})
ON CREATE SET apoptosisyyy.uuid = randomUUID(), 
apoptosisyyy.spanishName = "Apoptosisyyy", 
apoptosisyyy.englishCategory = "Apoptosis", 
apoptosisyyy.spanishCategory = "Apoptosis", 
apoptosisyyy.englishDescription = "Activates internal or external cell death pathways",  
apoptosisyyy.spanishDescription = "Activa vías de muerte celular internas o externas", 
apoptosisyyy.spanishRelatedDisease = "cancer", 
apoptosisyyy.englishRelatedDisease = "cancer", 
apoptosisyyy.isActive = true, apoptosisyyy.createdAt = datetime(), apoptosisyyy.updatedAt = datetime()
MERGE (antitumoryyy:Mechanisms {englishName: "Antitumoryyy"})
ON CREATE SET antitumoryyy.uuid = randomUUID(), 
antitumoryyy.spanishName = "Antitumoralyyy", 
antitumoryyy.englishCategory = "Antitumor", 
antitumoryyy.spanishCategory = "Antitumoral", 
antitumoryyy.englishDescription = "Inhibit tumor growth",  
antitumoryyy.spanishDescription = "Inhibe el crecimiento tumoral", 
antitumoryyy.spanishRelatedDisease = "cancer", 
antitumoryyy.englishRelatedDisease = "cancer", 
antitumoryyy.isActive = true, antitumoryyy.createdAt = datetime(), antitumoryyy.updatedAt = datetime()
MERGE (immunomodulatoryyyy:Mechanisms {englishName: "Immunomodulatoryyyyy"})
ON CREATE SET immunomodulatoryyyy.uuid = randomUUID(), 
immunomodulatoryyyy.spanishName = "Immunomodulatoryyy", 
immunomodulatoryyyy.englishCategory = "Immunomodulatory", 
immunomodulatoryyyy.spanishCategory = "Immunomodulator", 
immunomodulatoryyyy.englishDescription = "Modify or regulate the immune system—either enhancing or suppressing its activity.",  
immunomodulatoryyyy.spanishDescription = "Modifica o regula el sistema inmunológico, ya sea mejorando o suprimiendo su actividad", 
immunomodulatoryyyy.spanishRelatedDisease = "cancer", 
immunomodulatoryyyy.englishRelatedDisease = "cancer", //todo: fix it, posibbly related to many diseases nor only one 
immunomodulatoryyyy.isActive = true, immunomodulatoryyyy.createdAt = datetime(), immunomodulatoryyyy.updatedAt = datetime()
MERGE (antiinflammatoryyyy:Mechanisms {englishName: "Anti-inflammatoryyyy"})
ON CREATE SET antiinflammatoryyyy.uuid = randomUUID(), 
antiinflammatoryyyy.spanishName = "Anti inflammatorioyyy", 
antiinflammatoryyyy.englishCategory = "Anti-inflammatory", 
antiinflammatoryyyy.spanishCategory = "Anti inflammatorio", 
antiinflammatoryyyy.englishDescription = "Neutralizes ROS (Reactive Oxygen Species)",  
antiinflammatoryyyy.spanishDescription = "Neutraliza las especies reactivas de oxígeno (ROS)", 
antiinflammatoryyyy.spanishRelatedDisease = "cancer", 
antiinflammatoryyyy.englishRelatedDisease = "cancer", //todo: fix it, posibbly related to many diseases nor only one 
antiinflammatoryyyy.isActive = true, antiinflammatoryyyy.createdAt = datetime(), antiinflammatoryyyy.updatedAt = datetime()
MERGE (inhibitionMetastasis_rmm:Mechanisms {englishName: "Reduces matrix metalloproteinases"})
ON CREATE SET inhibitionMetastasis_rmm.uuid = randomUUID(), 
inhibitionMetastasis_rmm.spanishName = "Reduce las metaloproteinasas de la matriz", 
inhibitionMetastasis_rmm.englishCategory = "Inhibition of metastasis", 
inhibitionMetastasis_rmm.spanishCategory = "Inhibición de la metástasis", 
inhibitionMetastasis_rmm.englishDescription = "Reduces matrix metalloproteinases (MMP-2, MMP-9) activity, which is crucial for invasion and metastasis.",  
inhibitionMetastasis_rmm.spanishDescription = "Reduce la actividad de las metaloproteinasas de la matriz (MMP-2, MMP-9), que es crucial para la invasión y metástasis.", 
inhibitionMetastasis_rmm.spanishRelatedDisease = "cancer", 
inhibitionMetastasis_rmm.englishRelatedDisease = "cancer", //todo: fix it, posibbly related to many diseases nor only one 
inhibitionMetastasis_rmm.isActive = true, inhibitionMetastasis_rmm.createdAt = datetime(), inhibitionMetastasis_rmm.updatedAt = datetime()

MERGE (quinoa)-[:HAS_COMPOUND]->(saponins)
MERGE (quinoa)-[:HAS_COMPOUND]->(phytosterols)
MERGE (quinoa)-[:HAS_COMPOUND]->(quercetin)
MERGE (saponins)-[:HAS_MECHANISMS]->(cytolisisyyy)
MERGE (saponins)-[:HAS_MECHANISMS]->(apoptosisyyy)
MERGE (saponins)-[:HAS_MECHANISMS]->(antitumoryyy)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(immunomodulatoryyyy)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(antiinflammatoryyyy)
MERGE (quercetin)-[:HAS_MECHANISMS]->(inhibitionMetastasis_rmm)