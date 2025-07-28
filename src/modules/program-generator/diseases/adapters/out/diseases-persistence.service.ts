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
        WHERE d.uuid = $disease AND d.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           uuid: d.uuid,
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
        WHERE d.uuid IN $diseaseIds AND d.isActive = $isActive
        OPTIONAL MATCH (d)-[:HAS_RECOMMENDATION]->(r:Recommendation)
        OPTIONAL MATCH (r)-[:HAS_RESTRICTION]->(res:Restriction)

        WITH d, res,
          COLLECT(DISTINCT 
            CASE WHEN r IS NOT NULL THEN {
              uuid: r.uuid,
              name: r.name,
              details: r.details
            } ELSE NULL END
          ) AS recommendations,
          COLLECT(res) AS restrictions

        RETURN d.name AS disease, 
        COLLECT(DISTINCT {
            uuid:d.uuid,
            name:d.name,
            recommendations: recommendations 
          }
        ) AS ${resultName};
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
           uuid: d.uuid,
           name: d.name
        }) AS ${resultName}
      `,
      { isActive: true },
    );

    return res.records[0].get(resultName) as Disease[];
  }
}
