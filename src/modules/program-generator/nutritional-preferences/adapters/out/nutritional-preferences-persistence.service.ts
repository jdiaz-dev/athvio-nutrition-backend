import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/modules/program-generator/neo4j/neo4j.service';
import { NutritionalPreference } from 'src/modules/program-generator/nutritional-preferences/adapters/out/nutritional-preference.schema';

@Injectable()
export class NutritionalPreferencesPersistenceService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getNutritionalPreference(nutritionalPreference: string): Promise<NutritionalPreference> {
    const resultName = '_nutritionalPreference';
    const res = await this.neo4jService.read(
      `
        MATCH (np:NutritionalPreference) 
        WHERE np.uuid = $nutritionalPreference AND np.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           uuid: np.uuid,
           spanishName: np.spanishName
        }) AS ${resultName}
      `,
      { nutritionalPreference, isActive: true },
    );

    return res.records[0].get(resultName)[0] as NutritionalPreference;
  }
  async getNutritionalPreferences(nutritionalPreferences: string[]): Promise<NutritionalPreference[]> {
    const resultName = '_nutritionalPreferences';
    const res = await this.neo4jService.read(
      `
        MATCH (np:NutritionalPreference) 
        WHERE np.uuid IN $nutritionalPreferencesIds AND np.isActive = $isActive
        RETURN COLLECT(DISTINCT {
           uuid: np.uuid,
           spanishName: np.spanishName,
           spanishDetails: np.spanishDetails
        }) AS ${resultName}
      `,
      { nutritionalPreferencesIds: nutritionalPreferences, isActive: true },
    );

    return res.records[0].get(resultName) as NutritionalPreference[];
  }
  async getAllNutritionalPreferences(): Promise<NutritionalPreference[]> {
    const resultName = '_nutritionalPreferences';

    const res = await this.neo4jService.read(
      `
        MATCH (np:NutritionalPreference {isActive: $isActive}) 
        RETURN COLLECT(DISTINCT {
           uuid: np.uuid,
           spanishName: np.spanishName
        }) AS ${resultName}
      `,
      { isActive: true },
    );

    return res.records[0].get(resultName) as NutritionalPreference[];
  }
}
