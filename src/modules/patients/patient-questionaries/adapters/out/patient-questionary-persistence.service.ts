import { Injectable } from '@nestjs/common';
import { PatientQuestionary, PatientQuestionaryDocument } from './patient-questionary.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { CreatePatientQuestionary } from 'src/modules/patients/patient-questionaries/adapters/out/questionary-config';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { UpdateAnswersAndAdditionalNotesDto } from 'src/modules/patients/patient-questionaries/adapters/in/web/dtos/update-answers-and-additional-notes.dto';
import { UpdateAnswersDto } from 'src/modules/patients/patient-questionaries/adapters/in/mobile/dtos/update-answers.dto';
import { MongodbQueryBuilder } from 'src/shared/adapters/out/database/mongodb-query-builder';
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
      ...(isFromExternalRequest ? [{ $project: selectors }] : []),
    ]);
    return questionaryRes[0];
  }
  async updateAnswerAndAdditionalNotes(
    { questionary, professional, patient, questionaryGroups }: UpdateAnswersDto | UpdateAnswersAndAdditionalNotesDto,
    selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    const { arrayFilters, updateSubDocuments } = questionaryGroups.reduce(
      (acc, { questionaryGroup, questionaryDetails }, x) => {
        acc.arrayFilters.push({ [`group${x}.uuid`]: questionaryGroup });

        const { detailFilters, detailDocuments } = questionaryDetails.reduce(
          (detailAcc, { questionaryDetail, answer, ...rest }, y) => {
            detailAcc.detailFilters.push({ [`detail${x}with${y}.uuid`]: questionaryDetail });
            detailAcc.detailDocuments.push({
              [`questionaryGroups.$[group${x}].questionaryDetails.$[detail${x}with${y}].answer`]: answer,
              ...((rest as Record<string, string>).additionalNotes && {
                [`questionaryGroups.$[group${x}].questionaryDetails.$[detail${x}with${y}].additionalNotes`]: (
                  rest as Record<string, string>
                ).additionalNotes,
              }),
            });

            return detailAcc;
          },
          { detailFilters: [], detailDocuments: [] },
        );

        acc.arrayFilters.push(...detailFilters);
        acc.updateSubDocuments.push(...detailDocuments);

        return acc;
      },
      { arrayFilters: [], updateSubDocuments: [] },
    );

    const questionaryRes = await this.initializeQuery(this.updateAnswerAndAdditionalNotes.name).findOneAndUpdate(
      { uuid: questionary, professional, patient },
      { $set: Object.assign({}, ...updateSubDocuments) },
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
