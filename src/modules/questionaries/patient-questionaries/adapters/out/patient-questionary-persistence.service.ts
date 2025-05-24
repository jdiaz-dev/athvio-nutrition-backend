import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PatientQuestionary, PatientQuestionaryDocument } from './patient-questionary.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import { LayersServer } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { CreatePatientQuestionary } from 'src/modules/questionaries/patient-questionaries/adapters/out/questionary-config';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { GetPatientQuestionaryDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/get-patient-questionary.dto';
import { UpdateAnswerAndAdditionalNotesDto } from 'src/modules/questionaries/patient-questionaries/adapters/in/dtos/update-custom-questionary-details.dto';

@Injectable()
export class PatientQuestionaryPersistenceService {
  constructor(
    @InjectModel(PatientQuestionary.name) private readonly patientQuestionary: Model<PatientQuestionaryDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}

  async createPatientQuestionary(questionary: CreatePatientQuestionary): Promise<PatientQuestionary> {
    try {
      const questionaryRes = await this.patientQuestionary.create({
        ...questionary,
      });
      return questionaryRes;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async getPatientQuestionary(
    { patient, professional }: GetPatientQuestionaryDto,
    selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    try {
      const questionaryRes = await this.patientQuestionary.aggregate([
        {
          $match: { patient, professional },
        },
        {
          $project: {
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
        {
          $project: {
            ...selectors,
          },
        },
      ]);
      return questionaryRes[0];
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
  async updateAnwerAndAdditionalNotes(
    { questionary, professional, patient, questionaryGroups }: UpdateAnswerAndAdditionalNotesDto,
    selectors: Record<string, number>,
  ): Promise<PatientQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    try {
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

      const questionaryRes = await this.patientQuestionary.findOneAndUpdate(
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
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }
}
