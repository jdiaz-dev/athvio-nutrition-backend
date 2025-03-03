import { Injectable } from '@nestjs/common';
import { Disease } from 'src/modules/program-generator/diseases/adapters/out/disease.schema';
import { Neo4jService } from 'src/modules/program-generator/neo4j/neo4j.service';

@Injectable()
export class DiseasesPersistenceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getDisease(disease: string): Promise<Disease> {
    const resultName = '_disease';

    const res = await this.neo4jService.read(
      `
        MATCH (d:Disease)
        WHERE d.id = $disease AND d.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: d.id,
           name: d.name
        }) AS ${resultName}
      `,
      { disease, isActive: true },
    );
    return res.records[0].get(resultName)[0] as Disease;
  }
  async getDiseases(diseases: string[]): Promise<Disease[]> {
    const resultName = '_diseases';
    const res = await this.neo4jService.read(
      `
        MATCH (d:Disease)
        WHERE d.id IN $diseaseIds AND d.isActive = $isActive
        OPTIONAL MATCH (d)-[:HAS_RECOMMENDATION]->(r:Recommendation)
        OPTIONAL MATCH (r)-[:HAS_RESTRICTION]->(res:Restriction)

        WITH d, r, COLLECT(DISTINCT {
          id: r.id,
          name:r.name,
          details: r.details
        }) AS recommendation, 
        
        COLLECT(res) AS restrictions

        RETURN d.name AS disease, 
        COLLECT(DISTINCT {
            name:d.name,
            recommendations: recommendation 
            //restrictions: restrictions  
        }) AS ${resultName};
      `,
      { diseaseIds: diseases, isActive: true },
    );

    return res.records.map((item) => item.get(resultName)[0]) as Disease[];
  }
  async getAllDiseases(): Promise<Disease[]> {
    const resultName = '_diseases';
    const res = await this.neo4jService.read(
      `
        MATCH (d:Disease {isActive: $isActive}) 
        RETURN COLLECT(DISTINCT {
           id: d.id,
           name: d.name
        }) AS ${resultName}
      `,
      { isActive: true },
    );

    return res.records[0].get(resultName) as Disease[];
  }
}
