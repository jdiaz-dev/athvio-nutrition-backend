import { Injectable } from '@nestjs/common';
import { DiseaseCause } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause.schema';
import { Neo4jService } from 'src/modules/program-generator/neo4j/neo4j.service';

@Injectable()
export class DiseaseCausesPersistenceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getDiseaseCause(diseaseCause: string): Promise<DiseaseCause> {
    const ressultName = '_diseaseCause';

    const res = await this.neo4jService.read(
      `
        MATCH (dc:DiseaseCause) 
        WHERE dc.id = $diseaseCause AND dc.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: dc.id,
           name: dc.name
        }) AS ${ressultName}
      `,
      { diseaseCause, isActive: true },
    );
    return res.records[0].get(ressultName)[0] as DiseaseCause;
  }
  async getDiseaseCauses(diseaseCauses: string[], diseases: string[]): Promise<DiseaseCause[]> {
    const ressultName = '_diseaseCause';
    const res = await this.neo4jService.read(
      `
        MATCH (dc:DiseaseCause)-[:HAS_RECOMMENDATION]->(r:Recommendation)
        WHERE dc.id IN $diseaseCauseIds AND dc.isActive = $isActive

        OPTIONAL MATCH (r)-[:HAS_RESTRICTION]->(di:Disease)
        WITH dc, r, COLLECT(DISTINCT {
          name: di.name
        }) AS restrictions, COLLECT(DISTINCT di.id) AS restrictionIds

        WHERE NONE(id IN restrictionIds WHERE id IN $excludedDiseasesIds)

        WITH dc, COLLECT(DISTINCT {
          recommendation: r.name, 
          restrictions: restrictions 
        }) AS recommendations

        WITH dc, COLLECT(DISTINCT {
          id:dc.id,
          name: dc.name, 
          recommendations: recommendations 
        }) AS _diseaseCause

        RETURN ${ressultName};
      `,
      { diseaseCauseIds: diseaseCauses, isActive: true, excludedDiseasesIds: diseases },
    );

    return res.records.map((item) => item.get(ressultName)[0]) as unknown as DiseaseCause[];
  }
  async getAllDiseaseCauses(): Promise<DiseaseCause[]> {
    const ressultName = '_allDiseaseCauses';
    const res = await this.neo4jService.read(
      `
        MATCH (dc:DiseaseCause {isActive: $isActive}) 
        RETURN COLLECT(DISTINCT {
           id: dc.id,
           name: dc.name
        }) AS ${ressultName}
      `,
      { isActive: true },
    );

    return res.records[0].get(ressultName) as DiseaseCause[];
  }
}
