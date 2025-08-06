// ===============================
// FOODS
// ===============================
MERGE (quinoa:Food {englishName: "Quinoa"})
ON CREATE SET quinoa.uuid = randomUUID(), quinoa.spanishName = "Quinoa", quinoa.internalFood = "3200f349-08b6-4117-ae0e-a71ffc056fc1", quinoa.isActive = true, quinoa.createdAt = datetime(), quinoa.updatedAt = datetime()

MERGE (oatMilk:Food {englishName: "Oat milk"})
ON CREATE SET oatMilk.uuid = randomUUID(), oatMilk.spanishName = "Leche de avena", oatMilk.internalFood = "d77564a8-31db-4589-a3c2-98b86704283b", oatMilk.isActive = true, oatMilk.createdAt = datetime(), oatMilk.updatedAt = datetime()

MERGE (banana:Food {englishName: "Banana"})
ON CREATE SET banana.uuid = randomUUID(), banana.spanishName = "Plátano", banana.internalFood = "a2c8f574-3e98-4c1f-bc9d-e43b1be524fe", banana.isActive = true, banana.createdAt = datetime(), banana.updatedAt = datetime()

MERGE (allspice:Food {englishName: "Allspice"})
ON CREATE SET allspice.uuid = randomUUID(), allspice.spanishName = "Pimienta dulce", allspice.internalFood = "2e43f344-babb-4012-a911-ed65947c9c5e", allspice.isActive = true, allspice.createdAt = datetime(), allspice.updatedAt = datetime()

MERGE (carrotJuice:Food {englishName: "Carrot juice"})
ON CREATE SET carrotJuice.uuid = randomUUID(), carrotJuice.spanishName = "Jugo de zanahoria", carrotJuice.internalFood = "a9815eda-7d94-4d90-bca9-723065e566d8", carrotJuice.isActive = true, carrotJuice.createdAt = datetime(), carrotJuice.updatedAt = datetime()

// ===============================
// COMPOUNDS: Quinoa
// ===============================
MERGE (saponins:Compound {englishName: "Saponins"})
ON CREATE SET saponins.uuid = randomUUID(), saponins.spanishName = "Saponinas", saponins.isActive = true, saponins.createdAt = datetime(), saponins.updatedAt = datetime()

MERGE (phytosterols:Compound {englishName: "Phytosterols"})
ON CREATE SET phytosterols.uuid = randomUUID(), phytosterols.spanishName = "Fitoesteroles", phytosterols.isActive = true, phytosterols.createdAt = datetime(), phytosterols.updatedAt = datetime()

MERGE (quercetin:Compound {englishName: "Quercetin"})
ON CREATE SET quercetin.uuid = randomUUID(), quercetin.spanishName = "Quercetina", quercetin.isActive = true, quercetin.createdAt = datetime(), quercetin.updatedAt = datetime()

// ===============================
// COMPOUNDS: Oat Milk
// ===============================
MERGE (avenanthramides:Compound {englishName: "Avenanthramides"})
ON CREATE SET avenanthramides.uuid = randomUUID(), avenanthramides.spanishName = "Avenantramidas", avenanthramides.isActive = true, avenanthramides.createdAt = datetime(), avenanthramides.updatedAt = datetime()

MERGE (betaGlucans:Compound {englishName: "Beta-glucans"})
ON CREATE SET betaGlucans.uuid = randomUUID(), betaGlucans.spanishName = "Beta-glucanos", betaGlucans.isActive = true, betaGlucans.createdAt = datetime(), betaGlucans.updatedAt = datetime()

MERGE (ferulicAcid:Compound {englishName: "Ferulic acid"})
ON CREATE SET ferulicAcid.uuid = randomUUID(), ferulicAcid.spanishName = "Ácido ferúlico", ferulicAcid.isActive = true, ferulicAcid.createdAt = datetime(), ferulicAcid.updatedAt = datetime()

// ===============================
// COMPOUNDS: Banana
// ===============================
MERGE (dopamine:Compound {englishName: "Dopamine"})
ON CREATE SET dopamine.uuid = randomUUID(), dopamine.spanishName = "Dopamina", dopamine.isActive = true, dopamine.createdAt = datetime(), dopamine.updatedAt = datetime()

MERGE (catecholamines:Compound {englishName: "Catecholamines"})
ON CREATE SET catecholamines.uuid = randomUUID(), catecholamines.spanishName = "Catecolaminas", catecholamines.isActive = true, catecholamines.createdAt = datetime(), catecholamines.updatedAt = datetime()

MERGE (resistantStarch:Compound {englishName: "Resistant starch"})
ON CREATE SET resistantStarch.uuid = randomUUID(), resistantStarch.spanishName = "Almidón resistente", resistantStarch.isActive = true, resistantStarch.createdAt = datetime(), resistantStarch.updatedAt = datetime()

MERGE (pectin:Compound {englishName: "Pectin"})
ON CREATE SET pectin.uuid = randomUUID(), pectin.spanishName = "Pectina", pectin.isActive = true, pectin.createdAt = datetime(), pectin.updatedAt = datetime()

// ===============================
// COMPOUNDS: Allspice
// ===============================
MERGE (eugenol:Compound {englishName: "Eugenol"})
ON CREATE SET eugenol.uuid = randomUUID(), eugenol.spanishName = "Eugenol", eugenol.isActive = true, eugenol.createdAt = datetime(), eugenol.updatedAt = datetime()

MERGE (gallicAcid:Compound {englishName: "Gallic acid"})
ON CREATE SET gallicAcid.uuid = randomUUID(), gallicAcid.spanishName = "Ácido gálico", gallicAcid.isActive = true, gallicAcid.createdAt = datetime(), gallicAcid.updatedAt = datetime()

// ===============================
// COMPOUNDS: Carrot juice
// ===============================
MERGE (β_carotene:Compound {englishName: "β-Carotene"})
ON CREATE SET β_carotene.uuid = randomUUID(), β_carotene.spanishName = "β-Caroteno", 
β_carotene.englishFamily = "Carotenoids", 
β_carotene.spanishFamily = "Carotenoides", 
β_carotene.isActive = true, β_carotene.createdAt = datetime(), β_carotene.updatedAt = datetime()

MERGE (falcarinol:Compound {englishName: "Falcarinol"})
ON CREATE SET falcarinol.uuid = randomUUID(),
falcarinol.spanishName = "Falcarinol",
falcarinol.englishCategory = "Polyacetylenes",
falcarinol.spanishCategory = "Poliacetilenos",
falcarinol.isActive = true,
falcarinol.createdAt = datetime(),
falcarinol.updatedAt = datetime()

MERGE (falcarindiol:Compound {englishName: "Falcarindiol"})
ON CREATE SET falcarindiol.uuid = randomUUID(),
falcarindiol.spanishName = "Falcarindiol",
falcarindiol.englishCategory = "Polyacetylenes",
falcarindiol.spanishCategory = "Poliacetilenos",
falcarindiol.isActive = true,
falcarindiol.createdAt = datetime(),
falcarindiol.updatedAt = datetime()

MERGE (alphaCarotene:Compound {englishName: "α-Carotene"})
ON CREATE SET alphaCarotene.uuid = randomUUID(),
alphaCarotene.spanishName = "α-Caroteno",
alphaCarotene.englishCategory = "Carotenoids",
alphaCarotene.spanishCategory = "Carotenoides",
alphaCarotene.isActive = true,
alphaCarotene.createdAt = datetime(),
alphaCarotene.updatedAt = datetime()

MERGE (lutein:Compound {englishName: "Lutein"})
ON CREATE SET lutein.uuid = randomUUID(),
lutein.spanishName = "Luteína",
lutein.englishCategory = "Carotenoids",
lutein.spanishCategory = "Carotenoides",
lutein.isActive = true,
lutein.createdAt = datetime(),
lutein.updatedAt = datetime()

MERGE (terpenes:Compound {englishName: "Terpenes"})
ON CREATE SET terpenes.uuid = randomUUID(),
terpenes.spanishName = "Terpenos",
terpenes.englishCategory = "Terpenoids",
terpenes.spanishCategory = "Terpenoides",
terpenes.isActive = true,
terpenes.createdAt = datetime(),
terpenes.updatedAt = datetime()

// ===============================
// ANTI-INFLAMMATORY MECHANISMS
// ===============================
MERGE (antiInflammatoryNFkB:Mechanisms {englishName: "Inhibition of NF-κB signaling"})
ON CREATE SET antiInflammatoryNFkB.uuid = randomUUID(),
antiInflammatoryNFkB.spanishName = "Inhibición de la señalización NF-κB",
antiInflammatoryNFkB.englishCategory = "Anti-inflammatory",
antiInflammatoryNFkB.spanishCategory = "Antiinflamatorio",
antiInflammatoryNFkB.englishDescription = "Blocks NF-κB (protein) pathway to reduce inflammation-related tumor progression",
antiInflammatoryNFkB.spanishDescription = "Bloquea la vía NF-κB (proteina) para reducir la progresión tumoral relacionada con la inflamación",
antiInflammatoryNFkB.isActive = true,
antiInflammatoryNFkB.createdAt = datetime(),
antiInflammatoryNFkB.updatedAt = datetime()

MERGE (antiInflammatoryCOX2:Mechanisms {englishName: "Inhibition of COX-2 enzyme"})
ON CREATE SET antiInflammatoryCOX2.uuid = randomUUID(),
antiInflammatoryCOX2.spanishName = "Inhibición de la enzima COX-2",
antiInflammatoryCOX2.englishCategory = "Anti-inflammatory",
antiInflammatoryCOX2.spanishCategory = "Antiinflamatorio",
antiInflammatoryCOX2.englishDescription = "Reduces prostaglandin ( lipid compounds derived from arachidonic acid) production and inflammation in tumor microenvironment",
antiInflammatoryCOX2.spanishDescription = "Reduce la producción de prostaglandinas (compuestos lipídicos derivados del ácido araquidónico ) y la inflamación en el microambiente tumoral",
antiInflammatoryCOX2.isActive = true,
antiInflammatoryCOX2.createdAt = datetime(),
antiInflammatoryCOX2.updatedAt = datetime()

// ===============================
// ANTIOXIDANT MECHANISMS
// ===============================
MERGE (rosScavenging:Mechanisms {englishName: "Reactive oxygen species (ROS) scavenging"})
ON CREATE SET rosScavenging.uuid = randomUUID(),
rosScavenging.spanishName = "Captación de especies reactivas de oxígeno (ROS)",
rosScavenging.englishCategory = "Antioxidant",
rosScavenging.spanishCategory = "Antioxidante",
rosScavenging.englishDescription = "Neutralizes reactive oxygen species, preventing oxidative DNA damage",
rosScavenging.spanishDescription = "Neutraliza especies reactivas de oxígeno, previniendo daño oxidativo del ADN",
rosScavenging.isActive = true,
rosScavenging.createdAt = datetime(),
rosScavenging.updatedAt = datetime()

MERGE (nrf2Activation:Mechanisms {englishName: "Activation of Nrf2 antioxidant pathway"})
ON CREATE SET nrf2Activation.uuid = randomUUID(),
nrf2Activation.spanishName = "Activación de la vía antioxidante Nrf2",
nrf2Activation.englishCategory = "Antioxidant",
nrf2Activation.spanishCategory = "Antioxidante",
nrf2Activation.englishDescription = "Activates Nrf2 (transcription factor protein) pathway to increase antioxidant enzymes",
nrf2Activation.spanishDescription = "Activa la vía Nrf2 (proteina factor de transcripcion) para aumentar enzimas antioxidantes",
nrf2Activation.isActive = true,
nrf2Activation.createdAt = datetime(),
nrf2Activation.updatedAt = datetime()

// ===============================
// APOPTOSIS MECHANISMS
// ===============================

MERGE (caspase3:Mechanisms {englishName: "Activation of caspase-3"})
ON CREATE SET caspase3.uuid = randomUUID(), caspase3.spanishName = "Activación de caspasa-3",
caspase3.englishCategory = "Apoptosis", caspase3.spanishCategory = "Apoptosis",
caspase3.englishDescription = "Activates caspase-3 (enzyme) leading to apoptosis",
caspase3.spanishDescription = "Activa la caspasa-3 (enzyma) que conduce a apoptosis",
caspase3.isActive = true, caspase3.createdAt = datetime(), caspase3.updatedAt = datetime()

MERGE (caspase8:Mechanisms {englishName: "Activation of caspase-8"})
ON CREATE SET caspase8.uuid = randomUUID(), caspase8.spanishName = "Activación de caspasa-8",
caspase8.englishCategory = "Apoptosis", caspase8.spanishCategory = "Apoptosis",
caspase8.englishDescription = "Activates caspase-8 leading to apoptosis",
caspase8.spanishDescription = "Activa la caspasa-8 que conduce a apoptosis",
caspase8.isActive = true, caspase8.createdAt = datetime(), caspase8.updatedAt = datetime()

MERGE (p53:Mechanisms {englishName: "Activation of p53"})
ON CREATE SET p53.uuid = randomUUID(), p53.spanishName = "Activación de p53",
p53.englishCategory = "Apoptosis", p53.spanishCategory = "Apoptosis",
p53.englishDescription = "Activates p53-mediated apoptotic pathways",
p53.spanishDescription = "Activa vías apoptóticas mediadas por p53",
p53.isActive = true, p53.createdAt = datetime(), p53.updatedAt = datetime()

MERGE (baxbcl2:Mechanisms {englishName: "Modulation of Bax/Bcl-2 ratio"})
ON CREATE SET baxbcl2.uuid = randomUUID(), baxbcl2.spanishName = "Modulación de la relación Bax/Bcl-2",
baxbcl2.englishCategory = "Apoptosis", baxbcl2.spanishCategory = "Apoptosis",
baxbcl2.englishDescription = "Shifts balance towards pro-apoptotic signaling",
baxbcl2.spanishDescription = "Cambia el equilibrio hacia señales proapoptóticas",
baxbcl2.isActive = true, baxbcl2.createdAt = datetime(), baxbcl2.updatedAt = datetime()

MERGE (deathReceptor:Mechanisms {englishName: "Death receptor-mediated apoptosis"})
ON CREATE SET deathReceptor.uuid = randomUUID(), deathReceptor.spanishName = "Apoptosis mediada por receptor de muerte",
deathReceptor.englishCategory = "Apoptosis", deathReceptor.spanishCategory = "Apoptosis",
deathReceptor.englishDescription = "Triggers apoptosis via death receptors (Fas, TRAIL)",
deathReceptor.spanishDescription = "Inicia apoptosis a través de receptores de muerte (Fas, TRAIL)",
deathReceptor.isActive = true, deathReceptor.createdAt = datetime(), deathReceptor.updatedAt = datetime()

MERGE (mitochondrial:Mechanisms {englishName: "Mitochondrial membrane permeabilization"})
ON CREATE SET mitochondrial.uuid = randomUUID(), mitochondrial.spanishName = "Permeabilización de la membrana mitocondrial",
mitochondrial.englishCategory = "Apoptosis", mitochondrial.spanishCategory = "Apoptosis",
mitochondrial.englishDescription = "Increases mitochondrial permeability leading to apoptosis",
mitochondrial.spanishDescription = "Incrementa la permeabilidad mitocondrial que conduce a apoptosis",
mitochondrial.isActive = true, mitochondrial.createdAt = datetime(), mitochondrial.updatedAt = datetime()

// ===============================
// CELL CYCLE REGULATION
// ===============================
MERGE (inhibitProliferation:Mechanisms {englishName: "Inhibition of tumor cell proliferation"})
ON CREATE SET inhibitProliferation.uuid = randomUUID(), inhibitProliferation.spanishName = "Inhibición de la proliferación celular tumoral",
inhibitProliferation.englishCategory = "Cell cycle regulation", inhibitProliferation.spanishCategory = "Regulación del ciclo celular",
inhibitProliferation.englishDescription = "Suppresses tumor cell proliferation",
inhibitProliferation.spanishDescription = "Suprime la proliferación de células tumorales",
inhibitProliferation.isActive = true, inhibitProliferation.createdAt = datetime(), inhibitProliferation.updatedAt = datetime()

MERGE (arrestG1:Mechanisms {englishName: "Cell cycle arrest at G0/G1"})
ON CREATE SET arrestG1.uuid = randomUUID(), arrestG1.spanishName = "Arresto del ciclo celular en G0/G1",
arrestG1.englishCategory = "Cell cycle regulation", arrestG1.spanishCategory = "Regulación del ciclo celular",
arrestG1.englishDescription = "Blocks cell cycle at G0/G1 phase",
arrestG1.spanishDescription = "Bloquea el ciclo celular en la fase G0/G1",
arrestG1.isActive = true, arrestG1.createdAt = datetime(), arrestG1.updatedAt = datetime()

MERGE (arrestG2M:Mechanisms {englishName: "Cell cycle arrest at G2/M"})
ON CREATE SET arrestG2M.uuid = randomUUID(), arrestG2M.spanishName = "Arresto del ciclo celular en G2/M",
arrestG2M.englishCategory = "Cell cycle regulation", arrestG2M.spanishCategory = "Regulación del ciclo celular",
arrestG2M.englishDescription = "Blocks cell cycle at G2/M phase",
arrestG2M.spanishDescription = "Bloquea el ciclo celular en la fase G2/M",
arrestG2M.isActive = true, arrestG2M.createdAt = datetime(), arrestG2M.updatedAt = datetime()

// ===============================
// ANTI-ANGIOGENESIS
// ===============================
MERGE (inhibitVEGF:Mechanisms {englishName: "Inhibition of VEGF"})
ON CREATE SET inhibitVEGF.uuid = randomUUID(), inhibitVEGF.spanishName = "Inhibición de VEGF",
inhibitVEGF.englishCategory = "Anti-angiogenesis", inhibitVEGF.spanishCategory = "Antiangiogénesis",
inhibitVEGF.englishDescription = "Blocks VEGF (Vascular Endothelial Growth Factor - signal protein) signaling reducing angiogenesis",
inhibitVEGF.spanishDescription = "Bloquea la señalización VEGF (Vascular Endothelial Growth Factor - proteína de señalización) reduciendo la angiogénesis",
inhibitVEGF.isActive = true, inhibitVEGF.createdAt = datetime(), inhibitVEGF.updatedAt = datetime()

MERGE (inhibitVEGFR:Mechanisms {englishName: "Inhibition of VEGFR signaling"})
ON CREATE SET inhibitVEGFR.uuid = randomUUID(), inhibitVEGFR.spanishName = "Inhibición de la señalización de VEGFR",
inhibitVEGFR.englishCategory = "Anti-angiogenesis", inhibitVEGFR.spanishCategory = "Antiangiogénesis",
inhibitVEGFR.englishDescription = "Blocks VEGFR (Vascular Endothelial Growth Factor Receptor - receptor protein) signaling pathway",
inhibitVEGFR.spanishDescription = "Bloquea la vía de señalización VEGFR (Vascular Endothelial Growth Factor Receptor - proteína receptora)",
inhibitVEGFR.isActive = true, inhibitVEGFR.createdAt = datetime(), inhibitVEGFR.updatedAt = datetime()

MERGE (inhibitAngiopoietin:Mechanisms {englishName: "Inhibition of angiopoietin"})
ON CREATE SET inhibitAngiopoietin.uuid = randomUUID(), inhibitAngiopoietin.spanishName = "Inhibición de angiopoyetina",
inhibitAngiopoietin.englishCategory = "Anti-angiogenesis", inhibitAngiopoietin.spanishCategory = "Antiangiogénesis",
inhibitAngiopoietin.englishDescription = "Blocks angiopoietin activity in angiogenesis",
inhibitAngiopoietin.spanishDescription = "Bloquea la actividad de la angiopoyetina en la angiogénesis",
inhibitAngiopoietin.isActive = true, inhibitAngiopoietin.createdAt = datetime(), inhibitAngiopoietin.updatedAt = datetime()

MERGE (inhibitTie2:Mechanisms {englishName: "Inhibition of Tie2 signaling"})
ON CREATE SET inhibitTie2.uuid = randomUUID(), inhibitTie2.spanishName = "Inhibición de la señalización Tie2",
inhibitTie2.englishCategory = "Anti-angiogenesis", inhibitTie2.spanishCategory = "Antiangiogénesis",
inhibitTie2.englishDescription = "Blocks Tie2 receptor-mediated angiogenesis",
inhibitTie2.spanishDescription = "Bloquea la angiogénesis mediada por el receptor Tie2",
inhibitTie2.isActive = true, inhibitTie2.createdAt = datetime(), inhibitTie2.updatedAt = datetime()

// ===============================
// ANTI-METASTASIS
// ===============================
MERGE (inhibitMMP:Mechanisms {englishName: "Inhibition of matrix metalloproteinases"})
ON CREATE SET inhibitMMP.uuid = randomUUID(), inhibitMMP.spanishName = "Inhibición de metaloproteinasas de matriz",
inhibitMMP.englishCategory = "Anti-metastasis", inhibitMMP.spanishCategory = "Antimetástasis",
inhibitMMP.englishDescription = "Reduces MMP-2 and MMP-9 activity crucial for metastasis",
inhibitMMP.spanishDescription = "Reduce la actividad de MMP-2 y MMP-9 cruciales para la metástasis",
inhibitMMP.isActive = true, inhibitMMP.createdAt = datetime(), inhibitMMP.updatedAt = datetime()

MERGE (inhibitMigration:Mechanisms {englishName: "Inhibition of tumor cell migration"})
ON CREATE SET inhibitMigration.uuid = randomUUID(), inhibitMigration.spanishName = "Inhibición de la migración celular tumoral",
inhibitMigration.englishCategory = "Anti-metastasis", inhibitMigration.spanishCategory = "Antimetástasis",
inhibitMigration.englishDescription = "Prevents cancer cell migration",
inhibitMigration.spanishDescription = "Previene la migración de células cancerígenas",
inhibitMigration.isActive = true, inhibitMigration.createdAt = datetime(), inhibitMigration.updatedAt = datetime()

MERGE (inhibitEMT:Mechanisms {englishName: "Inhibition of epithelial-to-mesenchymal transition"})
ON CREATE SET inhibitEMT.uuid = randomUUID(), inhibitEMT.spanishName = "Inhibición de la transición epitelio-mesénquima",
inhibitEMT.englishCategory = "Anti-metastasis", inhibitEMT.spanishCategory = "Antimetástasis",
inhibitEMT.englishDescription = "Suppresses EMT involved in invasion and metastasis",
inhibitEMT.spanishDescription = "Suprime la EMT involucrada en la invasión y metástasis",
inhibitEMT.isActive = true, inhibitEMT.createdAt = datetime(), inhibitEMT.updatedAt = datetime()

// ===============================
// IMMUNE MODULATION
// ===============================
MERGE (nkActivation:Mechanisms {englishName: "Activation of natural killer cells"})
ON CREATE SET nkActivation.uuid = randomUUID(), nkActivation.spanishName = "Activación de células NK",
nkActivation.englishCategory = "Immune modulation", nkActivation.spanishCategory = "Modulación inmunológica",
nkActivation.englishDescription = "Stimulates NK cell anti-tumor activity",
nkActivation.spanishDescription = "Estimula la actividad antitumoral de las células NK",
nkActivation.isActive = true, nkActivation.createdAt = datetime(), nkActivation.updatedAt = datetime()

MERGE (ctlActivation:Mechanisms {englishName: "Activation of cytotoxic T lymphocytes"})
ON CREATE SET ctlActivation.uuid = randomUUID(), ctlActivation.spanishName = "Activación de linfocitos T citotóxicos",
ctlActivation.englishCategory = "Immune modulation", ctlActivation.spanishCategory = "Modulación inmunológica",
ctlActivation.englishDescription = "Activates cytotoxic T lymphocytes",
ctlActivation.spanishDescription = "Activa linfocitos T citotóxicos",
ctlActivation.isActive = true, ctlActivation.createdAt = datetime(), ctlActivation.updatedAt = datetime()

MERGE (pd1Inhibition:Mechanisms {englishName: "Inhibition of PD-1 checkpoint"})
ON CREATE SET pd1Inhibition.uuid = randomUUID(), pd1Inhibition.spanishName = "Inhibición del punto de control PD-1",
pd1Inhibition.englishCategory = "Immune modulation", pd1Inhibition.spanishCategory = "Modulación inmunológica",
pd1Inhibition.englishDescription = "Blocks PD-1 checkpoint to enhance immune response",
pd1Inhibition.spanishDescription = "Bloquea el punto de control PD-1 para mejorar la respuesta inmune",
pd1Inhibition.isActive = true, pd1Inhibition.createdAt = datetime(), pd1Inhibition.updatedAt = datetime()

// ===============================
// HORMONAL MECHANISMS
// ===============================
MERGE (inhibitERSignaling:Mechanisms {englishName: "Inhibition of estrogen receptor signaling"})
ON CREATE SET inhibitERSignaling.uuid = randomUUID(),
inhibitERSignaling.spanishName = "Inhibición de la señalización del receptor de estrógeno",
inhibitERSignaling.englishCategory = "Hormonal regulation",
inhibitERSignaling.spanishCategory = "Regulación hormonal",
inhibitERSignaling.englishDescription = "Blocks signaling mediated by estrogen receptors, reducing growth of hormone-dependent tumors",
inhibitERSignaling.spanishDescription = "Bloquea la señalización mediada por receptores de estrógeno, reduciendo el crecimiento de tumores dependientes de hormonas",
inhibitERSignaling.isActive = true,
inhibitERSignaling.createdAt = datetime(),
inhibitERSignaling.updatedAt = datetime()

MERGE (inhibitARSignaling:Mechanisms {englishName: "Inhibition of androgen receptor signaling"})
ON CREATE SET inhibitARSignaling.uuid = randomUUID(),
inhibitARSignaling.spanishName = "Inhibición de la señalización del receptor de andrógeno",
inhibitARSignaling.englishCategory = "Hormonal regulation",
inhibitARSignaling.spanishCategory = "Regulación hormonal",
inhibitARSignaling.englishDescription = "Blocks androgen receptor signaling, reducing growth of androgen-dependent tumors",
inhibitARSignaling.spanishDescription = "Bloquea la señalización del receptor de andrógeno, reduciendo el crecimiento de tumores dependientes de andrógenos",
inhibitARSignaling.isActive = true,
inhibitARSignaling.createdAt = datetime(),
inhibitARSignaling.updatedAt = datetime()

MERGE (inhibitPRSignaling:Mechanisms {englishName: "Inhibition of progesterone receptor signaling"})
ON CREATE SET inhibitPRSignaling.uuid = randomUUID(),
inhibitPRSignaling.spanishName = "Inhibición de la señalización del receptor de progesterona",
inhibitPRSignaling.englishCategory = "Hormonal regulation",
inhibitPRSignaling.spanishCategory = "Regulación hormonal",
inhibitPRSignaling.englishDescription = "Blocks progesterone receptor signaling, impacting hormone-related cancer growth",
inhibitPRSignaling.spanishDescription = "Bloquea la señalización del receptor de progesterona, impactando el crecimiento del cáncer dependiente de hormonas",
inhibitPRSignaling.isActive = true,
inhibitPRSignaling.createdAt = datetime(),
inhibitPRSignaling.updatedAt = datetime()

MERGE (aromataseInhibition:Mechanisms {englishName: "Aromatase inhibition"})
ON CREATE SET aromataseInhibition.uuid = randomUUID(),
aromataseInhibition.spanishName = "Inhibición de la aromatasa",
aromataseInhibition.englishCategory = "Hormonal regulation",
aromataseInhibition.spanishCategory = "Regulación hormonal",
aromataseInhibition.englishDescription = "Inhibits aromatase enzyme, lowering estrogen synthesis",
aromataseInhibition.spanishDescription = "Inhibe la enzima aromatasa, reduciendo la síntesis de estrógenos",
aromataseInhibition.isActive = true,
aromataseInhibition.createdAt = datetime(),
aromataseInhibition.updatedAt = datetime()

// ===============================
// OTHER CELL DEATH
// ===============================
MERGE (necroptosis:Mechanisms {englishName: "Induction of necroptosis"})
ON CREATE SET necroptosis.uuid = randomUUID(), necroptosis.spanishName = "Inducción de necroptosis",
necroptosis.englishCategory = "Cell death", necroptosis.spanishCategory = "Muerte celular",
necroptosis.englishDescription = "Triggers necroptotic cell death",
necroptosis.spanishDescription = "Activa la muerte celular por necroptosis",
necroptosis.isActive = true, necroptosis.createdAt = datetime(), necroptosis.updatedAt = datetime()

MERGE (ferroptosis:Mechanisms {englishName: "Induction of ferroptosis"})
ON CREATE SET ferroptosis.uuid = randomUUID(), ferroptosis.spanishName = "Inducción de ferroptosis",
ferroptosis.englishCategory = "Cell death", ferroptosis.spanishCategory = "Muerte celular",
ferroptosis.englishDescription = "Triggers ferroptotic cell death",
ferroptosis.spanishDescription = "Activa la muerte celular por ferroptosis",
ferroptosis.isActive = true, ferroptosis.createdAt = datetime(), ferroptosis.updatedAt = datetime()

// =========================================
// RELATIONSHIPS: FOODS → COMPOUNDS
// =========================================
MERGE (quinoa)-[:HAS_COMPOUND]->(saponins)
MERGE (quinoa)-[:HAS_COMPOUND]->(phytosterols)
MERGE (quinoa)-[:HAS_COMPOUND]->(quercetin)

MERGE (oatMilk)-[:HAS_COMPOUND]->(avenanthramides)
MERGE (oatMilk)-[:HAS_COMPOUND]->(betaGlucans)
MERGE (oatMilk)-[:HAS_COMPOUND]->(ferulicAcid)

MERGE (banana)-[:HAS_COMPOUND]->(dopamine)
MERGE (banana)-[:HAS_COMPOUND]->(catecholamines)
MERGE (banana)-[:HAS_COMPOUND]->(resistantStarch)
MERGE (banana)-[:HAS_COMPOUND]->(pectin)

MERGE (allspice)-[:HAS_COMPOUND]->(eugenol)
MERGE (allspice)-[:HAS_COMPOUND]->(gallicAcid)

MERGE (carrotJuice)-[:HAS_COMPOUND]->(β_carotene)
MERGE (carrotJuice)-[:HAS_COMPOUND]->(falcarinol)
MERGE (carrotJuice)-[:HAS_COMPOUND]->(falcarindiol)
MERGE (carrotJuice)-[:HAS_COMPOUND]->(alphaCarotene)
MERGE (carrotJuice)-[:HAS_COMPOUND]->(lutein)
MERGE (carrotJuice)-[:HAS_COMPOUND]->(terpenes)

// =========================================
// RELATIONSHIPS: COMPOUNDS → MECHANISMS
// =========================================

// --- Quinoa compounds ---
MERGE (saponins)-[:HAS_MECHANISMS]->(caspase3)
MERGE (saponins)-[:HAS_MECHANISMS]->(caspase8)
MERGE (saponins)-[:HAS_MECHANISMS]->(inhibitMigration)
MERGE (saponins)-[:HAS_MECHANISMS]->(inhibitMMP)

MERGE (phytosterols)-[:HAS_MECHANISMS]->(inhibitProliferation)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(arrestG1)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(nkActivation)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(pd1Inhibition)
MERGE (phytosterols)-[:HAS_MECHANISMS]->(inhibitARSignaling) //validate mechanism
MERGE (phytosterols)-[:HAS_MECHANISMS]->(inhibitERSignaling) //validate mechanism

MERGE (quercetin)-[:HAS_MECHANISMS]->(caspase3)
MERGE (quercetin)-[:HAS_MECHANISMS]->(inhibitVEGF)
MERGE (quercetin)-[:HAS_MECHANISMS]->(inhibitVEGFR)
MERGE (quercetin)-[:HAS_MECHANISMS]->(inhibitMigration)
MERGE (quercetin)-[:HAS_MECHANISMS]->(inhibitEMT)
MERGE (quercetin)-[:HAS_MECHANISMS]->(inhibitERSignaling) //validate mechanism
MERGE (quercetin)-[:HAS_MECHANISMS]->(aromataseInhibition) //validate mechanism
MERGE (quercetin)-[:HAS_MECHANISMS]->(antiInflammatoryNFkB) //validate mechanism
MERGE (quercetin)-[:HAS_MECHANISMS]->(rosScavenging) //validate mechanism
MERGE (quercetin)-[:HAS_MECHANISMS]->(nrf2Activation) //validate mechanism

// --- Oat milk compounds ---
MERGE (avenanthramides)-[:HAS_MECHANISMS]->(caspase8)
MERGE (avenanthramides)-[:HAS_MECHANISMS]->(nkActivation)
MERGE (avenanthramides)-[:HAS_MECHANISMS]->(pd1Inhibition)
MERGE (avenanthramides)-[:HAS_MECHANISMS]->(antiInflammatoryNFkB) //validate mechanism
MERGE (avenanthramides)-[:HAS_MECHANISMS]->(rosScavenging) //validate mechanism

MERGE (betaGlucans)-[:HAS_MECHANISMS]->(nkActivation)
MERGE (betaGlucans)-[:HAS_MECHANISMS]->(ctlActivation)
MERGE (betaGlucans)-[:HAS_MECHANISMS]->(pd1Inhibition)

MERGE (ferulicAcid)-[:HAS_MECHANISMS]->(caspase3)
MERGE (ferulicAcid)-[:HAS_MECHANISMS]->(arrestG2M)
MERGE (ferulicAcid)-[:HAS_MECHANISMS]->(inhibitVEGF)

// --- Banana compounds ---
MERGE (dopamine)-[:HAS_MECHANISMS]->(nkActivation)
MERGE (dopamine)-[:HAS_MECHANISMS]->(ctlActivation)

MERGE (catecholamines)-[:HAS_MECHANISMS]->(nkActivation)
MERGE (catecholamines)-[:HAS_MECHANISMS]->(pd1Inhibition)

MERGE (resistantStarch)-[:HAS_MECHANISMS]->(nkActivation)
MERGE (resistantStarch)-[:HAS_MECHANISMS]->(ctlActivation)

MERGE (pectin)-[:HAS_MECHANISMS]->(inhibitMigration)
MERGE (pectin)-[:HAS_MECHANISMS]->(inhibitMMP)

// --- Allspice compounds ---
MERGE (eugenol)-[:HAS_MECHANISMS]->(caspase3)
MERGE (eugenol)-[:HAS_MECHANISMS]->(inhibitVEGF)
MERGE (eugenol)-[:HAS_MECHANISMS]->(inhibitTie2)
MERGE (eugenol)-[:HAS_MECHANISMS]->(necroptosis)
MERGE (eugenol)-[:HAS_MECHANISMS]->(ferroptosis)
MERGE (eugenol)-[:HAS_MECHANISMS]->(antiInflammatoryCOX2) //validate mechanism
MERGE (eugenol)-[:HAS_MECHANISMS]->(rosScavenging) //validate mechanism
MERGE (eugenol)-[:HAS_MECHANISMS]->(nrf2Activation) //validate mechanism

MERGE (gallicAcid)-[:HAS_MECHANISMS]->(p53)
MERGE (gallicAcid)-[:HAS_MECHANISMS]->(baxbcl2)
MERGE (gallicAcid)-[:HAS_MECHANISMS]->(inhibitVEGF)
MERGE (gallicAcid)-[:HAS_MECHANISMS]->(inhibitMMP)
MERGE (gallicAcid)-[:HAS_MECHANISMS]->(inhibitMigration)
MERGE (gallicAcid)-[:HAS_MECHANISMS]->(rosScavenging) //validate mechanism
MERGE (gallicAcid)-[:HAS_MECHANISMS]->(nrf2Activation) //validate mechanism

MERGE (β_carotene)-[:HAS_MECHANISMS]->(rosScavenging)
MERGE (β_carotene)-[:HAS_MECHANISMS]->(nrf2Activation)
MERGE (β_carotene)-[:HAS_MECHANISMS]->(arrestG1)
MERGE (β_carotene)-[:HAS_MECHANISMS]->(nkActivation)

MERGE (falcarinol)-[:HAS_MECHANISMS]->(caspase3)
MERGE (falcarinol)-[:HAS_MECHANISMS]->(arrestG1)
MERGE (falcarinol)-[:HAS_MECHANISMS]->(antiInflammatoryNFkB)

MERGE (falcarindiol)-[:HAS_MECHANISMS]->(caspase3)
MERGE (falcarindiol)-[:HAS_MECHANISMS]->(antiInflammatoryNFkB)
MERGE (falcarindiol)-[:HAS_MECHANISMS]->(antiInflammatoryCOX2)

MERGE (alphaCarotene)-[:HAS_MECHANISMS]->(rosScavenging)
MERGE (alphaCarotene)-[:HAS_MECHANISMS]->(nrf2Activation)
MERGE (alphaCarotene)-[:HAS_MECHANISMS]->(arrestG1)

MERGE (lutein)-[:HAS_MECHANISMS]->(rosScavenging)
MERGE (lutein)-[:HAS_MECHANISMS]->(nrf2Activation)
MERGE (lutein)-[:HAS_MECHANISMS]->(inhibitVEGF)

MERGE (terpenes)-[:HAS_MECHANISMS]->(caspase3)
MERGE (terpenes)-[:HAS_MECHANISMS]->(inhibitVEGFR)