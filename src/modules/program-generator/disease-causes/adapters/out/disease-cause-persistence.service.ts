import { Injectable } from '@nestjs/common';
import { DiseaseCause } from 'src/modules/program-generator/disease-causes/adapters/out/disease-cause.schema';
import { Neo4jService } from 'src/modules/program-generator/neo4j/neo4j.service';
import { NEO4J_NODES } from 'src/modules/program-generator/shared/constants';

@Injectable()
export class DiseaseCausesPersistenceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getDiseaseCause(diseaseCause: string): Promise<DiseaseCause> {
    const res = await this.neo4jService.read(
      `
        MATCH (dc:DiseaseCause) 
        WHERE dc.id = $diseaseCause AND dc.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: dc.id,
           name: dc.name
        }) AS ${NEO4J_NODES.DISEASE_CAUSES}
      `,
      { diseaseCause, isActive: true },
    );
    return res.records[0].get(NEO4J_NODES.DISEASE_CAUSES)[0] as DiseaseCause;
  }
  async getDiseaseCauses(diseaseCauses: string[]): Promise<DiseaseCause[]> {
    const res = await this.neo4jService.read(
      `
        MATCH (dc:DiseaseCause) 
        WHERE dc.id IN $diseaseCauseIds AND dc.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: dc.id,
           name: dc.name
        }) AS ${NEO4J_NODES.DISEASE_CAUSES}
      `,
      { diseaseCauseIds: diseaseCauses, isActive: true },
    );
    return res.records[0].get(NEO4J_NODES.DISEASE_CAUSES) as DiseaseCause[];
  }
  async getAllDiseaseCauses(): Promise<DiseaseCause[]> {
    const res = await this.neo4jService.read(
      `
        MATCH (dc:DiseaseCause {isActive: $isActive}) 
        RETURN COLLECT(DISTINCT {
           id: dc.id,
           name: dc.name
        }) AS ${NEO4J_NODES.DISEASE_CAUSES}
      `,
      { isActive: true },
    );

    return res.records[0].get(NEO4J_NODES.DISEASE_CAUSES) as DiseaseCause[];
  }
}
