import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, gte, isNull, lte, or, sql } from 'drizzle-orm';
import { POSTGRES_DB } from 'src/shared/adapters/database/postgresql/postgresql.constants';
import { PostgresDb } from 'src/shared/adapters/postgresql.module';
import {
  bmiForAgeReference,
  BmiForAgeReferenceRecord,
  bodyMassIndex,
  BodyMassIndexRecord,
} from 'src/modules/health/formulas/adapters/out/body-mass-index.table';

@Injectable()
export class BodyMassIndexPersistenceService {
  constructor(@Inject(POSTGRES_DB) private readonly db: PostgresDb) {}

  async getClassificationRecords({
    age,
    gender,
    isPregnant,
  }: {
    age: number;
    gender: string;
    isPregnant: boolean;
  }): Promise<BodyMassIndexRecord[]> {
    const conditions = isPregnant
      ? and(eq(bodyMassIndex.isPregnant, true), or(isNull(bodyMassIndex.gender), eq(bodyMassIndex.gender, gender)))
      : and(
          eq(bodyMassIndex.isPregnant, false),
          or(isNull(bodyMassIndex.gender), eq(bodyMassIndex.gender, gender)),
          or(isNull(bodyMassIndex.minAge), lte(bodyMassIndex.minAge, age)),
          or(isNull(bodyMassIndex.maxAge), gte(bodyMassIndex.maxAge, age)),
        );

    // Narrowest upper age limit first: when ranges overlap (18–19 is in children 5–19 and adults 18–59), children win
    return this.db
      .select()
      .from(bodyMassIndex)
      .where(conditions)
      .orderBy(sql`${bodyMassIndex.maxAge} ASC NULLS LAST`, asc(bodyMassIndex.id));
  }

  async getBmiForAgeReference(gender: string, ageInMonths: number): Promise<BmiForAgeReferenceRecord | null> {
    const [record] = await this.db
      .select()
      .from(bmiForAgeReference)
      .where(and(eq(bmiForAgeReference.gender, gender), eq(bmiForAgeReference.ageInMonths, ageInMonths)))
      .limit(1);
    return record ?? null;
  }
}
