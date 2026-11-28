import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BodyMassIndexPersistenceService } from 'src/modules/health/formulas/adapters/out/body-mass-index-persistence.service';
import { BodyMassIndexRecord } from 'src/modules/health/formulas/adapters/out/body-mass-index.table';
import { CalculateBodyMassIndexDto } from 'src/modules/health/formulas/adapters/in/dtos/calculate-body-mass-index.dto';
import { BodyMassIndexResult } from 'src/modules/health/formulas/adapters/in/dtos/body-mass-index-result.dto';
import {
  BMI_FOR_AGE_MAX_MONTHS,
  BMI_FOR_AGE_MIN_MONTHS,
  BodyMassIndexErrorEnum,
  BodyMassIndexIndicator,
} from 'src/modules/health/formulas/domain/body-mass-index.enum';
import { AllowedGender } from 'src/shared/enums/project';

const round = (value: number, decimals = 2) => Math.round(value * 10 ** decimals) / 10 ** decimals;

@Injectable()
export class BodyMassIndexManagerService {
  constructor(private readonly bmips: BodyMassIndexPersistenceService) {}

  async calculateBodyMassIndex({ age, height, weight, gender, isPregnant }: CalculateBodyMassIndexDto): Promise<BodyMassIndexResult> {
    const pregnant = isPregnant === true;
    if (pregnant && gender !== AllowedGender.FEMALE) throw new BadRequestException(BodyMassIndexErrorEnum.PREGNANCY_ONLY_FEMALE);
    if (!pregnant && age < 5) throw new BadRequestException(BodyMassIndexErrorEnum.UNDER_FIVE_YEARS);

    // rounded so the value shown to the user and the value classified are the same
    const bmi = round(this.calculateBmi(weight, height), 2);

    const records = await this.bmips.getClassificationRecords({ age: Math.floor(age), gender, isPregnant: pregnant });
    if (records.length === 0) throw new BadRequestException(BodyMassIndexErrorEnum.CLASSIFICATION_NOT_FOUND);

    // Records come ordered by max age (narrowest first), so on overlaps (ages 18–19) children and adolescents win
    const populationGroup = records[0].populationGroup;
    const groupRecords = records.filter((record) => record.populationGroup === populationGroup);
    const indicator = groupRecords[0].indicator as BodyMassIndexIndicator;

    // Children and adolescents (5–19) are classified by the WHO BMI-for-age z-score instead of the IMC
    let valueToClassify = bmi;
    let zScore: number | undefined;
    if (indicator === BodyMassIndexIndicator.BMI_FOR_AGE_Z) {
      zScore = round(await this.calculateBmiForAgeZScore(bmi, age, gender), 2);
      valueToClassify = zScore;
    }

    const match = groupRecords.find((record) => this.isInRange(valueToClassify, record));
    if (!match) throw new InternalServerErrorException(BodyMassIndexErrorEnum.CLASSIFICATION_NOT_FOUND);

    return {
      bodyMassIndex: bmi,
      classification: match.classification,
      source: match.source,
      rangeLabel: match.rangeLabel,
      zScore,
      weightGainMinKg: match.weightGainMinKg ?? undefined,
      weightGainMaxKg: match.weightGainMaxKg ?? undefined,
    };
  }

  /** IMC = peso (kg) ÷ talla (m)². Height is received in cm. */
  private calculateBmi(weightInKg: number, heightInCm: number): number {
    const heightInMeters = heightInCm / 100;
    return weightInKg / (heightInMeters * heightInMeters);
  }

  /** WHO LMS method: z = ((IMC / M)^L - 1) / (L × S) */
  private async calculateBmiForAgeZScore(bmi: number, age: number, gender: string): Promise<number> {
    const ageInMonths = Math.min(Math.max(Math.round(age * 12), BMI_FOR_AGE_MIN_MONTHS), BMI_FOR_AGE_MAX_MONTHS);
    const reference = await this.bmips.getBmiForAgeReference(gender, ageInMonths);
    if (!reference) throw new InternalServerErrorException(BodyMassIndexErrorEnum.BMI_FOR_AGE_REFERENCE_NOT_FOUND);

    const { l, m, s } = reference;
    return l === 0 ? Math.log(bmi / m) / s : (Math.pow(bmi / m, l) - 1) / (l * s);
  }

  private isInRange(value: number, record: BodyMassIndexRecord): boolean {
    const { lowerBound, lowerInclusive, upperBound, upperInclusive } = record;
    const aboveLower = lowerBound === null || (lowerInclusive ? value >= lowerBound : value > lowerBound);
    const belowUpper = upperBound === null || (upperInclusive ? value <= upperBound : value < upperBound);
    return aboveLower && belowUpper;
  }
}
