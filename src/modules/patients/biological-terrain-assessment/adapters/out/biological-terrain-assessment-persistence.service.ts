import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncLocalStorage } from 'node:async_hooks';
import { UpdateBiologicalTerrainAssessmentDto } from 'src/modules/patients/biological-terrain-assessment/adapters/in/dtos/update-biological-terrain-assessment.dto';
import {
  BiologicalTerrainAssessment,
  BiologicalTerrainAssessmentDocument,
} from 'src/modules/patients/biological-terrain-assessment/adapters/out/biological-terrain-assesment.schema';

import { MongodbQueryBuilder } from 'src/shared/adapters/database/mongodb-query-builder';
import { AthvioLoggerService } from 'src/shared/adapters/observability/athvio-logger.service';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { Trazability } from 'src/shared/types';

@Injectable()
export class BiologicalTerrainAssessmentPersistence extends MongodbQueryBuilder<BiologicalTerrainAssessmentDocument> {
  constructor(
    @InjectModel(BiologicalTerrainAssessment.name)
    protected readonly model: Model<BiologicalTerrainAssessmentDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(model, logger, BiologicalTerrainAssessment.name, als);
  }
  async createBiologicalTerrain(assessment: Omit<BiologicalTerrainAssessment, '_id'>): Promise<BiologicalTerrainAssessment> {
    const questionaryRes = await this.initializeQuery(this.createBiologicalTerrain.name).create(assessment);
    return questionaryRes;
  }
  async getBiologicalTerrain(patient: string, selectors: Record<string, number>): Promise<BiologicalTerrainAssessment | null> {
    return await this.initializeQuery(this.getBiologicalTerrain.name).findOne({ patient }, selectors);
  }
  async updateBiologicalTerrain(
    {
      biologicalTerrainAssessment,
      patient,
      generalObservations,
      functionalScreeningScores,
    }: UpdateBiologicalTerrainAssessmentDto,
    selectors: Record<string, number>,
  ): Promise<BiologicalTerrainAssessment | null> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    const arrayFilters: Record<string, any>[] = [];
    const setDoc: Record<string, any> = {};

    generalObservations.forEach(({ generalObservation, value }, x) => {
      const id = `go${x}`;
      arrayFilters.push({ [`${id}.uuid`]: generalObservation });
      setDoc[`generalObservations.$[${id}].value`] = value;
    });

    functionalScreeningScores.forEach(({ functionalScreening, score, note }, x) => {
      const id = `fs${x}`;
      arrayFilters.push({ [`${id}.uuid`]: functionalScreening });
      setDoc[`functionalScreeningQuestions.$[${id}].score`] = score;
      if (note) {
        setDoc[`functionalScreeningQuestions.$[${id}].note`] = note;
      }
    });

    const questionaryRes = await this.initializeQuery(this.updateBiologicalTerrain.name).findOneAndUpdate(
      { uuid: biologicalTerrainAssessment, patient },
      { $set: setDoc },
      {
        arrayFilters,
        new: true,
        projection: {
          ...restFields,
          questionaryGroups: {
            $map: {
              input: '$questionaryGroups',
              as: 'group',
              in: {
                _id: '$$group._id',
                uuid: '$$group.uuid',
                title: '$$group.title',
                questionaryDetails: {
                  $filter: {
                    input: '$$group.questionaryDetails',
                    as: 'detail',
                    cond: { $eq: ['$$detail.isDeleted', false] },
                  },
                },
              },
            },
          },
        },
      },
    );

    return questionaryRes;
  }
}
