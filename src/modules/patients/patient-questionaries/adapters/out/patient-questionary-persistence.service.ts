import { Injectable } from '@nestjs/common';
import { PatientQuestionary, PatientQuestionaryDocument } from './patient-questionary.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { CreatePatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/questionary-config';
import { AthvioLoggerService } from 'src/shared/adapters/observability/athvio-logger.service';
import { UpdateAnswersAndAdditionalNotesDto } from 'src/modules/patients/patient-questionaries/adapters/in/web/dtos/update-answers-and-additional-notes.dto';
import { UpdateAnswersDto } from 'src/modules/patients/patient-questionaries/adapters/in/mobile/dtos/update-answers.dto';
import { MongodbQueryBuilder } from 'src/shared/adapters/database/mongodb-query-builder';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Trazability } from 'src/shared/types';

@Injectable()
export class PatientInternalQuestionaryPersistenceService extends MongodbQueryBuilder<PatientQuestionaryDocument> {
  constructor(
    @InjectModel(PatientQuestionary.name) protected readonly patientQuestionaryModel: Model<PatientQuestionaryDocument>,
    protected readonly logger: AthvioLoggerService,
    protected readonly als: AsyncLocalStorage<Trazability>,
  ) {
    super(patientQuestionaryModel, logger, PatientQuestionary.name, als);
  }

  async createPatientQuestionary(questionary: CreatePatientQuestionary): Promise<PatientQuestionary> {
    return this.initializeQuery(this.createPatientQuestionary.name).create({
      ...questionary,
    });
  }
  async getPatientQuestionary(
    { uuid, patient, professional }: { uuid?: string; patient?: string; professional?: string },
    selectors?: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const isFromExternalRequest = selectors ? true : false;
    const questionaryRes = await this.initializeQuery(this.getPatientQuestionary.name).aggregate([
      {
        $match: {
          ...(uuid && { uuid }),
          ...(patient && { patient }),
          ...(professional && { professional }),
        },
      },
      {
        $lookup: {
          from: 'ProfessionalQuestionaries',
          localField: 'professional',
          foreignField: 'professional',
          as: 'professionalQuestionary',
        },
      },
      {
        $addFields: {
          professionalQuestionaryDetails: {
            $reduce: {
              input: { $ifNull: [{ $arrayElemAt: ['$professionalQuestionary.questionaryGroups', 0] }, []] },
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this.questionaryDetails'] },
            },
          },
        },
      },
      {
        $project: {
          ...(isFromExternalRequest && removeAttributesWithFieldNames(selectors, ['questionaryGroups'])),
          questionaryGroups: {
            $map: {
              input: '$questionaryGroups',
              as: 'group',
              in: {
                _id: '$$group._id',
                uuid: '$$group.uuid',
                title: '$$group.title',
                questionaryDetails: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$$group.questionaryDetails',
                        as: 'detail',
                        cond: { $eq: ['$$detail.isDeleted', false] },
                      },
                    },
                    as: 'detail',
                    in: {
                      $let: {
                        vars: {
                          professionalDetail: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: '$professionalQuestionaryDetails',
                                  as: 'professionalDetail',
                                  cond: { $eq: ['$$professionalDetail.uuid', '$$detail.professionalQuestionaryDetail'] },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: {
                          $mergeObjects: [
                            '$$detail',
                            {
                              options: { $ifNull: ['$$professionalDetail.options', '$$detail.options'] },
                              optionType: { $ifNull: ['$$professionalDetail.optionType', '$$detail.optionType'] },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      ...(isFromExternalRequest ? [{ $project: selectors }] : []),
    ]);
    return questionaryRes[0];
  }
  async updateAnswerAndAdditionalNotes(
    { questionary, professional, patient, questionaryGroups }: UpdateAnswersDto | UpdateAnswersAndAdditionalNotesDto,
    selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const arrayFilters: Record<string, string>[] = [];
    const $set: Record<string, unknown> = {};

    questionaryGroups.forEach(({ questionaryGroup, questionaryDetails }, x) => {
      let isGroupUsed = false;

      questionaryDetails.forEach(({ questionaryDetail, answer, ...rest }, y) => {
        const additionalNotes = (rest as { additionalNotes?: string }).additionalNotes;
        const detailPath = `questionaryGroups.$[group${x}].questionaryDetails.$[detail${x}with${y}]`;
        const detailSet: Record<string, unknown> = {
          ...(answer !== undefined && { [`${detailPath}.answer`]: answer }),
          ...(additionalNotes && { [`${detailPath}.additionalNotes`]: additionalNotes }),
        };
        if (Object.keys(detailSet).length === 0) return;

        isGroupUsed = true;
        arrayFilters.push({ [`detail${x}with${y}.uuid`]: questionaryDetail });
        Object.assign($set, detailSet);
      });

      if (isGroupUsed) arrayFilters.push({ [`group${x}.uuid`]: questionaryGroup });
    });

    const updatedQuestionary = await this.initializeQuery(this.updateAnswerAndAdditionalNotes.name).findOneAndUpdate(
      { uuid: questionary, professional, patient },
      { $set: { ...$set, updatedAt: new Date() } },
      { arrayFilters, new: true, projection: { uuid: 1 } },
    );
    if (!updatedQuestionary) return null;

    return this.getPatientQuestionary({ uuid: questionary, professional, patient }, selectors);
  }
}
