import { boolean, index, numeric, pgTable, serial, smallint, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

export const bodyMassIndex = pgTable(
  'bodyMassIndex',
  {
    id: serial('id').primaryKey(),
    populationGroup: varchar('population_group', { length: 30 }).notNull(),
    source: varchar('source', { length: 120 }).notNull(),
    minAge: smallint('min_age'),
    maxAge: smallint('max_age'),
    gender: varchar('gender', { length: 10 }),
    isPregnant: boolean('is_pregnant').notNull().default(false),
    indicator: varchar('indicator', { length: 20 }).notNull(),
    lowerBound: numeric('lower_bound', { precision: 5, scale: 2, mode: 'number' }),
    lowerInclusive: boolean('lower_inclusive').notNull().default(true),
    upperBound: numeric('upper_bound', { precision: 5, scale: 2, mode: 'number' }),
    upperInclusive: boolean('upper_inclusive').notNull().default(false),
    rangeLabel: varchar('range_label', { length: 40 }).notNull(),
    classification: varchar('classification', { length: 40 }).notNull(),
    weightGainMinKg: numeric('weight_gain_min_kg', { precision: 4, scale: 1, mode: 'number' }),
    weightGainMaxKg: numeric('weight_gain_max_kg', { precision: 4, scale: 1, mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('body_mass_index_lookup_idx').on(table.isPregnant, table.minAge, table.maxAge)],
);

export type BodyMassIndexRecord = typeof bodyMassIndex.$inferSelect;

/**
 * WHO 2007 BMI-for-age LMS reference (5–19 years), one row per sex and age in months (61–228).
 * z = ((IMC / M)^L - 1) / (L × S); when L = 0: z = ln(IMC / M) / S
 */
export const bmiForAgeReference = pgTable(
  'bmiForAgeReference',
  {
    id: serial('id').primaryKey(),
    gender: varchar('gender', { length: 10 }).notNull(),
    ageInMonths: smallint('age_in_months').notNull(),
    /** L (lambda): Box-Cox power that removes the skewness of the IMC distribution */
    l: numeric('l', { precision: 8, scale: 5, mode: 'number' }).notNull(),
    /** M (mu): median IMC (kg/m²) for that sex and age; IMC = M gives z-score 0 */
    m: numeric('m', { precision: 8, scale: 5, mode: 'number' }).notNull(),
    /** S (sigma): coefficient of variation, spread of IMC around the median as a fraction of M */
    s: numeric('s', { precision: 8, scale: 5, mode: 'number' }).notNull(),
  },
  (table) => [unique('bmi_for_age_reference_gender_month_uq').on(table.gender, table.ageInMonths)],
);

export type BmiForAgeReferenceRecord = typeof bmiForAgeReference.$inferSelect;
