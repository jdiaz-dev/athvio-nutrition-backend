import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/modules/program-generator/neo4j/neo4j.service';
import { NutritionalPreference } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preference.schema';
import { NEO4J_NODES } from 'src/modules/program-generator/shared/constants';

@Injectable()
export class NutritionalPreferencesPersistenceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getNutritionalPreference(nutritionalPreference: string): Promise<NutritionalPreference> {
    const res = await this.neo4jService.read(
      `
        MATCH (np:NutritionalPreference) 
        WHERE np.id = $nutritionalPreference AND np.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: np.id,
           name: np.name
        }) AS ${NEO4J_NODES.NUTRITIONAL_PREFERENCES}
      `,
      { nutritionalPreference, isActive: true },
    );

    return res.records[0].get(NEO4J_NODES.NUTRITIONAL_PREFERENCES)[0] as NutritionalPreference;
  }
  async getNutritionalPreferences(nutritionalPreferences: string[]): Promise<NutritionalPreference[]> {
    const res = await this.neo4jService.read(
      `
        MATCH (np:NutritionalPreference) 
        WHERE np.id IN $nutritionalPreferencesIds AND np.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           id: np.id,
           name: np.name
        }) AS ${NEO4J_NODES.NUTRITIONAL_PREFERENCES}
      `,
      { nutritionalPreferencesIds: nutritionalPreferences, isActive: true },
    );

    return res.records[0].get(NEO4J_NODES.NUTRITIONAL_PREFERENCES) as NutritionalPreference[];
  }
  async getAllNutritionalPreferences(): Promise<NutritionalPreference[]> {
    const res = await this.neo4jService.read(
      `
        MATCH (np:NutritionalPreference {isActive: $isActive}) 
        RETURN COLLECT(DISTINCT {
           id: np.id,
           name: np.name
        }) AS ${NEO4J_NODES.NUTRITIONAL_PREFERENCES}
      `,
      { isActive: true },
    );

    return res.records[0].get(NEO4J_NODES.NUTRITIONAL_PREFERENCES) as NutritionalPreference[];
  }
}
