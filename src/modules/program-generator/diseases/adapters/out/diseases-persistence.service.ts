import { Injectable } from '@nestjs/common';
import { Disease } from 'src/modules/program-generator/diseases/adapters/out/disease.schema';
import { Neo4jService } from 'src/modules/program-generator/neo4j/neo4j.service';
import { NEO4J_NODES } from 'src/modules/program-generator/shared/constants';

@Injectable()
export class DiseasesPersistenceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getDisease(disease: string): Promise<Disease> {
    const res = await this.neo4jService.read(
      `
        MATCH (d:Disease)
        WHERE d.id = $disease AND d.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: d.id,
           name: d.name
        }) AS ${NEO4J_NODES.DISEASES}
      `,
      { disease, isActive: true },
    );
    return res.records[0].get(NEO4J_NODES.DISEASES)[0] as Disease;
  }
  async getDiseases(diseases: string[]): Promise<Disease[]> {
    const res = await this.neo4jService.read(
      `
        MATCH (d:Disease)
        WHERE d.id IN $diseaseIds AND d.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: d.id,
           name: d.name
        }) AS ${NEO4J_NODES.DISEASES}
      `,
      { diseaseIds: diseases, isActive: true },
    );

    return res.records[0].get(NEO4J_NODES.DISEASES) as Disease[];
  }
  async getAllDiseases(): Promise<Disease[]> {
    const res = await this.neo4jService.read(
      `
        MATCH (d:Disease {isActive: $isActive}) 
        RETURN COLLECT(DISTINCT {
           id: d.id,
           name: d.name
        }) AS ${NEO4J_NODES.DISEASES}
      `,
      { isActive: true },
    );

    return res.records[0].get(NEO4J_NODES.DISEASES) as Disease[];
  }
}
