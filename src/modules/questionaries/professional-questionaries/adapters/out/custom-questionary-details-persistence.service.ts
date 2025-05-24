import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfessionalQuestionary, ProfessionalQuestionaryDocument } from './professional-questionary.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import {
  AddQuestionaryDetail,
  DeleteQuestionaryDetail,
  UpdateQuestionaryDetail,
} from 'src/modules/questionaries/professional-questionaries/adapters/out/professional-questionary';
import { LayersServer, CustomFieldsGroupName } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class CustomQuestionaryDetailsPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(
    @InjectModel(ProfessionalQuestionary.name) private readonly professionalQuestionary: Model<ProfessionalQuestionaryDocument>,
    private readonly logger: AthvioLoggerService,
  ) {}
  async addQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetailBodies }: AddQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    try {
      const questionaryRes = await this.professionalQuestionary.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $push: {
            'questionaryGroups.$[questionaryGroup].questionaryDetails': {
              $each: questionaryDetailBodies,
            },
          },
        },
        {
          arrayFilters: [
            { 'questionaryGroup._id': new Types.ObjectId(questionaryGroup), 'questionaryGroup.title': CustomFieldsGroupName },
          ],
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
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async updateQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetailBodies }: UpdateQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    try {
      const updateSubDocuments = questionaryDetailBodies.map((body, index) => ({
        [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].fieldName`]: body.fieldName,
        [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].associatedQuestion`]: body.associatedQuestion,
        [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isEnabled`]: body.isEnabled,
        [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].fieldType`]: body.fieldType,
      }));

      const arrayFilters = questionaryDetailBodies.map((body, index) => ({
        [`detail${index}._id`]: new Types.ObjectId(body.questionaryDetail),
        [`detail${index}.isDeleted`]: false,
      }));

      const questionaryRes = await this.professionalQuestionary.findOneAndUpdate(
        { _id: questionary, professional },
        { $set: Object.assign({}, ...updateSubDocuments) },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': CustomFieldsGroupName },
            ...arrayFilters,
          ],
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
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async deleteQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetails }: DeleteQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<ProfessionalQuestionary> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    try {
      const deleteSubDocuments = questionaryDetails.map((_item, index) => ({
        [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isDeleted`]: true,
      }));
      const arrayFilters = questionaryDetails.map((item, index) => ({
        [`detail${index}._id`]: new Types.ObjectId(item),
        [`detail${index}.isDeleted`]: false,
      }));
      const questionaryRes = await this.professionalQuestionary.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $set: Object.assign({}, ...deleteSubDocuments),
        },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': CustomFieldsGroupName },
            ...arrayFilters,
          ],
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
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
