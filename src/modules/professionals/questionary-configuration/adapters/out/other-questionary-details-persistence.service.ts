import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuestionaryConfig, QuestionaryConfigDocument } from './questionary-config.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InternalErrors } from 'src/shared/enums/messages-response';
import {
  AddQuestionaryDetail,
  DeleteQuestionaryDetail,
  UpdateQuestionaryDetail,
} from 'src/modules/professionals/questionary-configuration/adapters/out/questionary-config';
import { LayersServer, OtherFieldsGroupName } from 'src/shared/enums/project';
import { removeAttributesWithFieldNames } from 'src/shared/helpers/graphql-helpers';

@Injectable()
export class OtherQuestionaryDetailsPersistenceService {
  private layer = LayersServer.INFRAESTRUCTURE;

  constructor(@InjectModel(QuestionaryConfig.name) private readonly questionaryConfig: Model<QuestionaryConfigDocument>) {
    this.questionaryConfig;
  }
  async addQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetailBodies }: AddQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);
    
    try {
      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
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
            { 'questionaryGroup._id': new Types.ObjectId(questionaryGroup), 'questionaryGroup.title': OtherFieldsGroupName },
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
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async updateQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetailBodies }: UpdateQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
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

      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
        { _id: questionary, professional },
        { $set: Object.assign({}, ...updateSubDocuments) },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': OtherFieldsGroupName },
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
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
  async deleteQuestionaryDetail(
    { questionary, questionaryGroup, professional, questionaryDetails }: DeleteQuestionaryDetail,
    selectors: Record<string, number>,
  ): Promise<QuestionaryConfig> {
    const restFields = removeAttributesWithFieldNames(selectors, ['questionaryGroups']);

    try {
      const deleteSubDocuments = questionaryDetails.map((_item, index) => ({
        [`questionaryGroups.$[group].questionaryDetails.$[detail${index}].isDeleted`]: true,
      }));
      const arrayFilters = questionaryDetails.map((item, index) => ({
        [`detail${index}._id`]: new Types.ObjectId(item),
        [`detail${index}.isDeleted`]: false,
      }));
      const questionaryRes = await this.questionaryConfig.findOneAndUpdate(
        { _id: questionary, professional },
        {
          $set: Object.assign({}, ...deleteSubDocuments),
        },
        {
          arrayFilters: [
            { 'group._id': new Types.ObjectId(questionaryGroup), 'group.title': OtherFieldsGroupName },
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
    } catch (e) {
      throw new InternalServerErrorException(InternalErrors.DATABASE, this.layer);
    }
  }
}
