import { Injectable } from '@nestjs/common';
import { FoodAnalyzer } from 'src/modules/program-generator/food-analyzer/adapters/out/food-analyzer.schema';
import { Neo4jService } from 'src/modules/program-generator/neo4j/neo4j.service';

@Injectable()
export class FoodAnalyzersPersistenceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getFoodAnalyzers(internalFoodIds: string[]): Promise<FoodAnalyzer[]> {
    const resultName = '_foodAnalyzers';
    const res = await this.neo4jService.read(
      `
        MATCH (f:Food)
        WHERE f.internalFood IN $internalFoodIds AND f.isActive = $isActive
        OPTIONAL MATCH (f)-[:HAS_COMPOUND]->(c:Compound)
        OPTIONAL MATCH (c)-[:HAS_MECHANISMS]->(m:Mechanisms)
        WITH f, c, m

        WITH f, c, collect(m {
          uuid: m.uuid,
          spanishName: m.spanishName,
          englishName: m.englishName,
          englishDescription: m.englishDescription,
          spanishDescription: m.spanishDescription,
          englishRelatedDisease: m.englishRelatedDisease,
          spanishRelatedDisease: m.spanishRelatedDisease,
          isActive: m.isActive
        }) AS mechanisms
        WITH f, collect(
          CASE 
            WHEN c IS NULL THEN null
            ELSE c {
              uuid: c.uuid, 
              spanishName: c.spanishName,
              englishName: c.englishName,
              isActive: c.isActive,
              mechanisms: mechanisms
            }
          END
        ) AS compounds

        RETURN
        COLLECT(DISTINCT {
          uuid:f.uuid,
          englishName: f.englishName,
          spanishName: f.spanishName,
          compounds: compounds
        }
      ) AS ${resultName};
      `,
      { internalFoodIds, isActive: true },
    );

    return res.records[0].get(resultName) as FoodAnalyzer[];
  }
}
