MERGE (quinoa:Food {name: "Quinoa"})
ON CREATE SET quinoa.id = randomUUID(), quinoa.internalFood = "3200f349-08b6-4117-ae0e-a71ffc056fc1", quinoa.isActive = true, quinoa.createdAt = datetime(), quinoa.updatedAt = datetime()

MERGE (saponins:Copound {name: "Saponins"})
ON CREATE SET saponins.id = randomUUID(), saponins.isActive = true, saponins.createdAt = datetime(), saponins.updatedAt = datetime()

MERGE (quinoa)-[:HAS_COMPOUND]->(saponins)