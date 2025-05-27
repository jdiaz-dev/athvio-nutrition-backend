import { Injectable } from '@nestjs/common';
import { PatientQuestionary, PatientQuestionaryDocument } from './patient-questionary.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { CreatePatientQuestionary } from 'src/modules/questionaries/patient-questionaries/adapters/out/questionary-config';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { UpdateAnswerAndAdditionalNotesDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/update-answer-and-additional-notes.dto';
import { BaseRepository } from 'src/shared/database/base-repository';

@Injectable()
export class PatientQuestionaryPersistenceService extends BaseRepository<PatientQuestionaryDocument> {
  constructor(
    @InjectModel(PatientQuestionary.name) protected readonly patientQuestionaryModel: Model<PatientQuestionaryDocument>,
    protected readonly logger: AthvioLoggerService,
  ) {
    super(patientQuestionaryModel, logger, PatientQuestionary.name);
  }

  async createPatientQuestionary(questionary: CreatePatientQuestionary): Promise<PatientQuestionary> {
    return this.create({
      ...questionary,
    });
  }
  async getPatientQuestionary(
    { _id, patient, professional }: { _id?: string; patient: string; professional: string },
    selectors?: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const isFromExternalRequest = selectors ? true : false;

    const questionaryRes = await this.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(_id),
          patient: patient,
          professional: professional,
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
  async updateAnwerAndAdditionalNotes(
    { questionary, professional, patient, questionaryGroups }: UpdateAnswerAndAdditionalNotesDto,
    selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    const arrayFilters = [];
    const updateSubDocuments = [];

    for (let x = 0; x < questionaryGroups.length; x++) {
      const { questionaryGroup, questionaryDetails } = questionaryGroups[x];

      arrayFilters.push({ [`group${x}._id`]: new Types.ObjectId(questionaryGroup) });

      for (let y = 0; y < questionaryDetails.length; y++) {
        const { questionaryDetail, answer, additionalNotes } = questionaryDetails[y];
        arrayFilters.push({ [`detail${x}with${y}._id`]: new Types.ObjectId(questionaryDetail) });
        updateSubDocuments.push({
          [`questionaryGroups.$[group${x}].questionaryDetails.$[detail${x}with${y}].answer`]: answer,
          [`questionaryGroups.$[group${x}].questionaryDetails.$[detail${x}with${y}].additionalNotes`]: additionalNotes,
        });
      }
    }

    const questionaryRes = await this.findOneAndUpdate(
      { _id: questionary, professional, patient },
      { $set: Object.assign({}, ...updateSubDocuments) },
      {
        arrayFilters: [...arrayFilters],
        new: true,
        projection: {
          ...restFields,
          questionaryGroups: {
            $map: {
              input: '$questionaryGroups',
              as: 'group',
              in: {
                _id: '$$group._id',
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
